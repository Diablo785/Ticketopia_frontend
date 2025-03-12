import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ManageOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const initialOrganizerState = {
    id: null,
    organizer_name: "",
    organizer_registration_number: "",
    organizer_email: "",
    organizer_phone: "",
    organizer_address: "",
    image: null,
    imagePreview: "",
  };

  const [newOrganizer, setNewOrganizer] = useState(initialOrganizerState);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [sortOption, setSortOption] = useState("organizer_name");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const fetchOrganizers = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://127.0.0.1:8000/api/organizers", {
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
      setOrganizers(data);
    } catch (error) {
      setFieldErrors({
        general: error.message || "Failed to fetch organizers.",
      });
    }
  };

  useEffect(() => {
    fetchOrganizers();
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
    const {
      organizer_name,
      organizer_email,
      organizer_phone,
      organizer_address,
    } = newOrganizer;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^\+?[0-9]{1,15}$/;

    const errors = {};

    if (!organizer_name) errors.organizer_name = "Organizer name is required.";
    if (!organizer_email) {
      errors.organizer_email = "Organizer email is required.";
    } else if (!emailRegex.test(organizer_email)) {
      errors.organizer_email = "Please enter a valid email address.";
    }
    if (!organizer_phone) {
      errors.organizer_phone = "Organizer phone is required.";
    }
    if (!organizer_address) errors.organizer_address = "Address is required.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrganizer = async () => {
    if (!validateInputs()) return;

    setFieldErrors({});
    try {
      const formData = new FormData();
      Object.entries(newOrganizer).forEach(([key, value]) => {
        if (key === "image" && value) {
          formData.append("image", value);
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch("http://127.0.0.1:8000/api/organizers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message);
      }

      const data = await response.json();
      setOrganizers([...organizers, data.organizer]);
      setNewOrganizer(initialOrganizerState);
      setFeedbackMessage("Organizer added successfully!");
      setTimeout(() => setFeedbackMessage(null), 2000);
    } catch (error) {
      setFieldErrors({ general: "Failed to add organizer: " + error.message });
    }
  };

  const handleEditOrganizer = (organizer) => {
    setNewOrganizer({
      ...organizer,
      imagePreview: `${organizer.image}`,
      image: null,
    });
    setIsEditing(true);
    setFieldErrors({});
    setIsPopupOpen(true);
  };

  const handleUpdateOrganizer = async () => {
    const {
      organizer_name,
      organizer_email,
      organizer_phone,
      organizer_address,
      image,
    } = newOrganizer;

    const hasChanges =
      organizer_name !== initialOrganizerState.organizer_name ||
      organizer_email !== initialOrganizerState.organizer_email ||
      organizer_phone !== initialOrganizerState.organizer_phone ||
      organizer_address !== initialOrganizerState.organizer_address ||
      image !== null;

    if (!hasChanges) {
      setFieldErrors({ general: "No changes made to update the organizer." });
      return;
    }

    if (!validateInputs()) return;

    try {
      const formData = new FormData();

      Object.entries(newOrganizer).forEach(([key, value]) => {
        if (key === "image" && value) {
          formData.append("image", value);
        } else if (key !== "image") {
          formData.append(key, value);
        }
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/organizers/${newOrganizer.id}`,
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

      const updatedOrganizer = await response.json();
      const updatedOrganizers = organizers.map((organizer) =>
        organizer.id === updatedOrganizer.organizer.id
          ? updatedOrganizer.organizer
          : organizer,
      );

      setOrganizers(updatedOrganizers);
      setIsEditing(false);
      setNewOrganizer(initialOrganizerState);
      setFeedbackMessage("Organizer updated successfully!");
      setTimeout(() => setFeedbackMessage(null), 2000);
    } catch (error) {
      setFieldErrors({
        general: "Failed to update organizer: " + error.message,
      });
    }
  };

  const handleDeleteOrganizer = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/organizers/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message);
      }

      const updatedOrganizers = organizers.filter(
        (organizer) => organizer.id !== id,
      );
      setOrganizers(updatedOrganizers);
      setFeedbackMessage("Organizer deleted successfully!");
      setTimeout(() => setFeedbackMessage(null), 2000);
    } catch (error) {
      setFieldErrors({
        general: "Failed to delete organizer: " + error.message,
      });
    }
  };

  const handleCancelEdit = () => {
    setNewOrganizer(initialOrganizerState);
    setIsEditing(false);
    setFieldErrors({});
    setIsPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];
      setNewOrganizer({
        ...newOrganizer,
        [name]: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      setNewOrganizer({ ...newOrganizer, [name]: value });
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

  const sortOrganizers = (organizersList) => {
    return [...organizersList].sort((a, b) => {
      switch (sortOption) {
        case "organizer_name-asc":
          return a.organizer_name.localeCompare(b.organizer_name);
        case "organizer_name-desc":
          return b.organizer_name.localeCompare(a.organizer_name);
        default:
          return 0;
      }
    });
  };

  const filteredOrganizers = sortOrganizers(
    organizers.filter((organizer) =>
      organizer.organizer_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    ),
  );

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setNewOrganizer((prevState) => ({
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
            Manage Organizers
          </h1>
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105"
            onClick={() => setIsPopupOpen(true)}
          >
            Add Organizer
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Search Organizers"
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
            <option value="organizer_name-asc">Name (A-Z)</option>
            <option value="organizer_name-desc">Name (Z-A)</option>
          </select>
        </div>

        <ul className="space-y-8 lg:space-y-10 max-h-[625px] overflow-y-auto">
          {filteredOrganizers.map((organizer) => (
            <li
              key={organizer.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                {organizer.image && (
                  <img
                    src={organizer.image}
                    alt={`${organizer.organizer_name}'s Image`}
                    className="w-full md:w-1/4 max-w-[250px] max-h-[250px] object-contain rounded-lg mb-4 md:mb-0 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(organizer.image, "_blank")}
                  />
                )}
                <div className="flex-1 border-l-2 border-gray-300 pl-4 overflow-x-auto bg-white rounded-lg shadow-sm p-5 max-w-full">
                  <h2 className="font-bold text-2xl text-gray-900 mb-3">
                    {organizer.organizer_name}
                  </h2>
                  <p className="text-gray-700 text-sm mb-2">
                    {organizer.organizer_email}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Phone:{" "}
                    <span className="font-medium">
                      {organizer.organizer_phone}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Address:{" "}
                    <span className="font-medium">
                      {organizer.organizer_address}
                    </span>
                  </p>
                </div>
                <div className="flex flex-row md:flex-col justify-center md:self-center items-center gap-3 mt-4 md:mt-0">
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 shadow-md transform hover:scale-105"
                    onClick={() => handleEditOrganizer(organizer)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 shadow-md transform hover:scale-105"
                    onClick={() => handleDeleteOrganizer(organizer.id)}
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
              {isEditing ? "Edit Organizer" : "Add Organizer"}
            </h2>

            {fieldErrors.general && (
              <p className="text-red-500 text-center">{fieldErrors.general}</p>
            )}

            <label className="block text-gray-700 font-medium mb-1">
              Organizer Name
            </label>
            <input
              type="text"
              name="organizer_name"
              placeholder="Organizer Name"
              value={newOrganizer.organizer_name}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400"
            />
            {fieldErrors.organizer_name && (
              <p className="text-red-500">{fieldErrors.organizer_name}</p>
            )}

            <label className="block text-gray-700 font-medium mb-1">
              Registration Number
            </label>
            <input
              type="text"
              name="organizer_registration_number"
              placeholder="Registration Number"
              value={newOrganizer.organizer_registration_number}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400"
            />

            <label className="block text-gray-700 font-medium mb-1">
              Organizer Email
            </label>
            <input
              type="email"
              name="organizer_email"
              placeholder="Organizer Email"
              value={newOrganizer.organizer_email}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400"
            />
            {fieldErrors.organizer_email && (
              <p className="text-red-500">{fieldErrors.organizer_email}</p>
            )}

            <label className="block text-gray-700 font-medium mb-1">
              Organizer Phone
            </label>
            <PhoneInput
              country={"lv"}
              placeholder="Enter phone number"
              value={newOrganizer.organizer_phone}
              onChange={(value) => {
                const cleanedValue = value.replace(/\D/g, "");
                setNewOrganizer({
                  ...newOrganizer,
                  organizer_phone: cleanedValue,
                });
              }}
              className={`mb-2 w-full `}
            />
            {fieldErrors.organizer_phone && (
              <p className="text-red-500">{fieldErrors.organizer_phone}</p>
            )}

            <label className="block text-gray-700 font-medium mb-1">
              Organizer Address
            </label>
            <input
              type="text"
              name="organizer_address"
              placeholder="Organizer Address"
              value={newOrganizer.organizer_address}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400"
            />
            {fieldErrors.organizer_address && (
              <p className="text-red-500">{fieldErrors.organizer_address}</p>
            )}

            <div className="mb-4">
              {newOrganizer.imagePreview ? (
                <div className="flex justify-center mb-4">
                  <img
                    src={newOrganizer.imagePreview}
                    alt="Image Preview"
                    className="max-w-[225px] max-h-[175px] object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() =>
                      window.open(newOrganizer.imagePreview, "_blank")
                    }
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
                <p className="mt-2 text-gray-500">
                  Or drag and drop image here
                </p>
              </div>
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
                onClick={isEditing ? handleUpdateOrganizer : handleAddOrganizer}
              >
                {isEditing ? "Update Organizer" : "Add Organizer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrganizers;
