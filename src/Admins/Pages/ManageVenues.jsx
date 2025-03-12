import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const initialVenueState = {
    id: null,
    name: "",
    address: "",
    contact_email: "",
    contact_phone: "",
    capacity: "",
    notes: "",
    image: null,
    imagePreview: "",
  };

  const [newVenue, setNewVenue] = useState(initialVenueState);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [sortOption, setSortOption] = useState("name");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const fetchVenues = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://127.0.0.1:8000/api/venues", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVenues(data);
    } catch (error) {
      setFieldErrors({ general: error.message || "Failed to fetch venues." });
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const validateInputs = () => {
    const { name, address, contact_email, contact_phone, capacity } = newVenue;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^\+?[0-9]{1,15}$/;

    const errors = {};

    if (!name) errors.name = "Venue name is required.";
    if (!address) errors.address = "Address is required.";
    if (!contact_email) {
      errors.contact_email = "Contact email is required.";
    } else if (!emailRegex.test(contact_email)) {
      errors.contact_email = "Please enter a valid email address.";
    }
    if (!contact_phone) {
      errors.contact_phone = "Contact phone is required.";
    }
    if (!capacity) {
      errors.capacity = "Capacity is required.";
    } else if (isNaN(capacity) || capacity <= 0) {
      errors.capacity = "Capacity must be a positive number.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddVenue = async () => {
    if (!validateInputs()) return;

    setFieldErrors({});
    try {
      const formData = new FormData();
      Object.entries(newVenue).forEach(([key, value]) => {
        if (key === "image" && value) {
          formData.append("image", value);
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch("http://127.0.0.1:8000/api/venues", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.json();
        console.log("Error response:", errorText);
        throw new Error(errorText.message);
      }

      const data = await response.json();
      console.log("API response:", data);

      setVenues([...venues, data.venue]);
      setNewVenue(initialVenueState);
      setFeedbackMessage("Venue added successfully!");
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (error) {
      setFieldErrors({ general: "Failed to add venue: " + error.message });
    }
  };

  const handleEditVenue = (venue) => {
    setNewVenue({
      ...venue,
      imagePreview: `${venue.image}`,
      image: null,
    });
    setIsEditing(true);
    setFieldErrors({});
    setIsPopupOpen(true);
  };

  const handleUpdateVenue = async () => {
    const {
      name,
      address,
      contact_email,
      contact_phone,
      capacity,
      notes,
      image,
    } = newVenue;

    const hasChanges =
      name !== initialVenueState.name ||
      address !== initialVenueState.address ||
      contact_email !== initialVenueState.contact_email ||
      contact_phone !== initialVenueState.contact_phone ||
      capacity !== initialVenueState.capacity ||
      notes !== initialVenueState.notes ||
      image !== null; 

    if (!hasChanges) {
      setFieldErrors({ general: "No changes made to update the venue." });
      return;
    }

    if (!validateInputs()) return;

    try {
      const formData = new FormData();

      Object.entries(newVenue).forEach(([key, value]) => {
        if (key === "image" && value) {
          formData.append("image", value);
        } else if (key !== "image") {
          formData.append(key, value);
        }
      });

      console.log(
        "FormData to be sent on Update Venue:",
        Array.from(formData.entries()),
      );

      const response = await fetch(
        `http://127.0.0.1:8000/api/venues/${newVenue.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message);
      }

      const updatedVenue = await response.json();
      const updatedVenues = venues.map((venue) =>
        venue.id === updatedVenue.venue.id ? updatedVenue.venue : venue,
      );

      setVenues(updatedVenues);
      setIsEditing(false);
      setNewVenue(initialVenueState);
      setFeedbackMessage("Venue updated successfully!");
      setTimeout(() => setFeedbackMessage(null), 2000);
    } catch (error) {
      setFieldErrors({ general: "Failed to update venue: " + error.message });
    }
  };

  const handleDeleteVenue = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/venues/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message);
      }

      const updatedVenues = venues.filter((venue) => venue.id !== id);
      setVenues(updatedVenues);
      setFeedbackMessage("Venue deleted successfully!");
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (error) {
      setFieldErrors({ general: "Failed to delete venue: " + error.message });
    }
  };

  const handleCancelEdit = () => {
    setNewVenue(initialVenueState);
    setIsEditing(false);
    setFieldErrors({});
    setIsPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];
      setNewVenue({
        ...newVenue,
        [name]: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      setNewVenue({ ...newVenue, [name]: value });
    }

    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  const sortVenues = (venuesList) => {
    return [...venuesList].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "capacity-asc":
          return a.capacity - b.capacity;
        case "capacity-desc":
          return b.capacity - a.capacity;
        default:
          return 0;
      }
    });
  };

  const filteredVenues = sortVenues(
    venues.filter((venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setNewVenue((prevState) => ({
        ...prevState,
        image: file,
        imagePreview: imagePreview,
      }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-white to-gray-500 px-4 py-8">
      {feedbackMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white text-lg px-6 py-4 rounded-full shadow-2xl z-50 transition-opacity duration-500 ease-in-out backdrop-blur-md">
          {feedbackMessage}
        </div>
      )}

      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 mt-10 animate__animated animate__fadeIn overflow-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center sm:text-left">
            Manage Venues
          </h1>
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105"
            onClick={() => setIsPopupOpen(true)}
          >
            Add Venue
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Search Venues"
            className="border border-gray-300 p-2 rounded-full w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="mb-4 flex items-center justify-center">
          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="capacity-asc">Capacity (Low to High)</option>
            <option value="capacity-desc">Capacity (High to Low)</option>
          </select>
        </div>

        <ul className="space-y-8 lg:space-y-10 max-h-[625px] overflow-y-auto">
          {filteredVenues.map((venue) => (
            <li
              key={venue.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                {venue.image && (
                  <img
                    src={`${venue.image}`}
                    alt={venue.name}
                    className="w-full md:w-1/4 max-w-[250px] max-h-[250px] object-contain rounded-lg mb-4 md:mb-0 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(venue.image, "_blank")}
                  />
                )}
                <div className="flex-1 border-l-2 border-gray-300 pl-4 overflow-x-auto bg-white rounded-lg shadow-sm p-5 max-w-full">
                  <h2 className="font-bold text-2xl text-gray-900 mb-3">
                    {venue.name}
                  </h2>
                  <p className="text-gray-700 text-sm mb-2">{venue.address}</p>
                  <p className="text-gray-600 text-sm mb-2">
                    Contact:{" "}
                    <span className="font-medium">{venue.contact_phone}</span> |{" "}
                    <span className="font-medium">{venue.contact_email}</span>
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Capacity:{" "}
                    <span className="font-medium">{venue.capacity}</span>
                  </p>
                  <p className="text-gray-600 text-sm whitespace-nowrap">
                    Notes: <span className="font-medium">{venue.notes}</span>
                  </p>
                </div>
                <div className="flex flex-row md:flex-col justify-center md:self-center items-center gap-3 mt-4 md:mt-0">
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 shadow-md transform hover:scale-105"
                    onClick={() => handleEditVenue(venue)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 shadow-md transform hover:scale-105"
                    onClick={() => handleDeleteVenue(venue.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate__animated animate__zoomIn relative">
            <h2 className="text-xl font-bold mb-4 text-center">
              {isEditing ? "Edit Venue" : "Add Venue"}
            </h2>

            {fieldErrors.general && (
              <p className="text-red-500 text-center">{fieldErrors.general}</p>
            )}

            <label className="block text-gray-700 font-medium mb-1">
              Venue Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Venue Name"
              value={newVenue.name}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400"
            />
            {fieldErrors.name && (
              <p className="text-red-500">{fieldErrors.name}</p>
            )}

            <label className="block text-gray-700 font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newVenue.address}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400"
            />
            {fieldErrors.address && (
              <p className="text-red-500">{fieldErrors.address}</p>
            )}

            <label className="block text-gray-700 font-medium mb-1">
              Contact Email
            </label>
            <input
              type="text"
              name="contact_email"
              placeholder="Contact Email"
              value={newVenue.contact_email}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400"
            />
            {fieldErrors.contact_email && (
              <p className="text-red-500">{fieldErrors.contact_email}</p>
            )}

            <label className="block text-gray-700 font-medium mb-1">
              Contact Phone
            </label>
            <PhoneInput
              country={"lv"}
              placeholder="Enter phone number"
              value={newVenue.contact_phone}
              onChange={(value) => {
                const cleanedValue = value.replace(/\D/g, "");
                setNewVenue({ ...newVenue, contact_phone: cleanedValue });
              }}
              className="custom-phone-input mb-2"
            />
            {fieldErrors.contact_phone && (
              <p className="text-red-500">{fieldErrors.contact_phone}</p>
            )}

            <label className="block text-gray-700 font-medium mb-1">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={newVenue.capacity}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400"
            />
            {fieldErrors.capacity && (
              <p className="text-red-500">{fieldErrors.capacity}</p>
            )}

            <label className="block text-gray-700 font-medium mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              placeholder="Notes"
              value={newVenue.notes}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400 min-h-[60px] max-h-[150px] overflow-y-auto"
            />

            {newVenue.imagePreview ? (
              <div className="flex justify-center mb-4">
                <img
                  src={newVenue.imagePreview}
                  alt="Image Preview"
                  className="max-w-[225px] max-h-[175px] object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(newVenue.imagePreview, "_blank")}
                />
              </div>
            ) : (
              <p className="text-gray-500">No image selected</p>
            )}

            <div
              className="border-2 border-dashed border-gray-300 p-4 rounded-lg mb-4 text-center hover:bg-gray-100 transition-colors cursor-pointer"
              onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <label className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-200 inline-block">
                Upload Image
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-gray-500">Or drag and drop image here</p>
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                onClick={isEditing ? handleUpdateVenue : handleAddVenue}
              >
                {isEditing ? "Update Venue" : "Add Venue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVenues;
