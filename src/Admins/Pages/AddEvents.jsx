import React, { useState, useEffect } from "react";
import { DateTimePicker } from "@mantine/dates";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/getCroppedImg";
import { useNavigate } from "react-router-dom";
import "@mantine/dates/styles.css";

const AddEvents = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [organizers, setOrganizers] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [event, setEvent] = useState({
    title: "",
    description: "",
    is_public: true,
    image: null,
    imagePreview: "",
    organizer_id: "",
  });

  const [eventTimes, setEventTimes] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      venue: "",
      ticketPrices: [{ type: "", price: "" }],
    },
  ]);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/organizers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        const data = await response.json();
        setOrganizers(data);
      } catch (error) {
        console.error("Error fetching organizers:", error);
      }
    };

    const fetchVenues = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/venues", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        const data = await response.json();
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchOrganizers();
    fetchVenues();
  }, []);

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value,
    });
  };

  const handleEventTimeChange = (index, field, value) => {
    const updatedEventTimes = [...eventTimes];
    updatedEventTimes[index][field] = value;
    setEventTimes(updatedEventTimes);
  };

  const handleTicketPriceChange = (eventTimeIndex, priceIndex, field, value) => {
    const updatedEventTimes = [...eventTimes];
    if (field === "price") {
      const regex = /^\d+(\.\d{0,2})?$/;
      if (value === "" || regex.test(value)) {
        updatedEventTimes[eventTimeIndex].ticketPrices[priceIndex][field] = value;
        setEventTimes(updatedEventTimes);
      }
    } else {
      updatedEventTimes[eventTimeIndex].ticketPrices[priceIndex][field] = value;
      setEventTimes(updatedEventTimes);
    }
  };

  const addEventTime = () => {
    setEventTimes([
      ...eventTimes,
      {
        startDate: new Date(),
        endDate: new Date(),
        venue: "",
        ticketPrices: [{ type: "", price: "" }],
      },
    ]);
  };

  const removeEventTime = (index) => {
    const updatedEventTimes = eventTimes.filter((_, i) => i !== index);
    setEventTimes(updatedEventTimes);
  };

  const addTicketPrice = (eventTimeIndex) => {
    const updatedEventTimes = [...eventTimes];
    updatedEventTimes[eventTimeIndex].ticketPrices.push({
      type: "",
      price: "",
    });
    setEventTimes(updatedEventTimes);
  };

  const removeTicketPrice = (eventTimeIndex, priceIndex) => {
    const updatedEventTimes = [...eventTimes];
    updatedEventTimes[eventTimeIndex].ticketPrices = updatedEventTimes[eventTimeIndex].ticketPrices.filter((_, i) => i !== priceIndex);
    setEventTimes(updatedEventTimes);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = async (croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
    if (imagePreview) {
      try {
        const croppedImageUrl = await getCroppedImg(imagePreview, pixels);
        setCroppedImage(croppedImageUrl);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    } else {
      console.error("Image preview is not defined.");
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvent({ ...event, image: file, imagePreview: reader.result });
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setImagePreview(null);
  };

  const handleCropSave = async (croppedAreaPixels) => {
    try {
      const croppedImageUrl = await getCroppedImg(imagePreview, croppedAreaPixels);
      setCroppedImage(croppedImageUrl);
      setEvent({ ...event, image: croppedImageUrl, imagePreview: croppedImageUrl }); 
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsCropping(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (!event.title.trim()) newErrors.title = "Event title is required.";
    if (!event.description.trim()) newErrors.description = "Event description is required.";
    if (!event.organizer_id) newErrors.organizer_id = "Organizer is required.";
    if (!event.image) newErrors.image = "Event image is required.";
  
    eventTimes.forEach((eventTime, index) => {
      if (!eventTime.startDate) {
        newErrors[`startDate_${index}`] = "Start date and time is required.";
      }
      if (!eventTime.endDate) {
        newErrors[`endDate_${index}`] = "End date and time is required.";
      } else if (eventTime.startDate && eventTime.endDate <= eventTime.startDate) {
        newErrors[`endDate_${index}`] = "End date and time must be later than start date and time.";
      }
    
      if (!eventTime.venue) {
        newErrors[`venue_${index}`] = "Venue selection is required.";
      }
    
      eventTime.ticketPrices.forEach((ticketPrice, priceIndex) => {
        if (!ticketPrice.type.trim()) {
          newErrors[`ticketPrice_${index}_${priceIndex}_type`] = "Ticket type is required.";
        }
        if (!ticketPrice.price.trim()) {
          newErrors[`ticketPrice_${index}_${priceIndex}_price`] = "Ticket price is required.";
        }
      });
    });
  
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const newErrors = validateForm();
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return; 
    }
  
    try {
      const eventData = {
        ...event,
        is_public: event.is_public, 
      };
  
      if (croppedImage) {
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const reader = new FileReader();
  
        const base64Image = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob); 
        });
  
        eventData.image = base64Image;
      }
  
      const eventResponse = await fetch("http://127.0.0.1:8000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(eventData),
      });
  
      if (!eventResponse.ok) {
        const errorData = await eventResponse.json();
        throw new Error(errorData.message || "Error creating event");
      }
  
      const createdEventData = await eventResponse.json();
  
      const formatDateForMySQL = (date) =>
        date.toISOString().slice(0, 19).replace("T", " ");
      const eventDatesPromises = eventTimes.map((eventTime) => {
        return fetch("http://127.0.0.1:8000/api/event_dates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            event_id: createdEventData.id,
            start_date_time: formatDateForMySQL(eventTime.startDate),
            end_date_time: formatDateForMySQL(eventTime.endDate),
            venue_id: eventTime.venue,
          }),
        }).then((res) => res.json());
      });
  
      const createdEventDates = await Promise.all(eventDatesPromises);
  
      const ticketPricesPromises = eventTimes.flatMap((eventTime, eventIndex) =>
        eventTime.ticketPrices
          .filter((price) => price.type && price.price)
          .map((price) => {
            return fetch("http://127.0.0.1:8000/api/ticket_prices", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                Accept: "application/json",
              },
              body: JSON.stringify({
                event_id: createdEventData.id,
                event_date_id: createdEventDates[eventIndex].id,
                ticket_type: price.type,
                price: price.price,
              }),
            }).then((res) => res.json());
          })
      );
  
      await Promise.all(ticketPricesPromises);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
      setFeedbackMessage("Event addded successfully!");
      setTimeout(() => setFeedbackMessage(null), 2000);
      navigate("/manage-events");
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {feedbackMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white text-lg px-6 py-4 rounded-full shadow-2xl z-50 transition-opacity duration-500 ease-in-out backdrop-blur-md">
          {feedbackMessage}
        </div>
      )}
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600">
        Create New Event
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            name="title"
            value={event.title}
            onChange={handleEventChange}
            placeholder="Event Title"
            className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring ${errors.title ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'}`}
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
        </div>
        <div>
          <textarea
            name="description"
            value={event.description}
            onChange={handleEventChange}
            placeholder="Event Description"
            className={`w-full max-h-[300px] px-4 py-3 border rounded-md shadow-sm focus:ring ${errors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'}`}
            rows="5"
          ></textarea>
          {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        </div>
        <div className="text-gray-700">
          <select
            name="organizer_id"
            value={event.organizer_id}
            onChange={handleEventChange}
            className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring ${errors.organizer_id ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'}`}
          >
            <option value="">Select Organizer</option>
            {organizers.map((organizer) => (
              <option key={organizer.id} value={organizer.id}>
                {organizer.organizer_name}
              </option>
            ))}
          </select>
          {errors.organizer_id && <span className="text-red-500 text-sm">{errors.organizer_id}</span>}
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="is_public"
            checked={event.is_public}
            onChange={(e) => setEvent({ ...event, is_public: e.target.checked })}
            className="mr-2"
          />
          <label className="text-gray-700">Public Event</label>
        </div>
  
        <div>
          <h2 className="text-xl font-semibold mb-2">Event Dates, Times, and Ticket Prices</h2>
          {eventTimes.map((eventTime, index) => (
            <div key={index} className="border p-4 rounded-md bg-gray-50 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Event Time #{index + 1}</h3>
                {eventTimes.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 hover:underline"
                    onClick={() => removeEventTime(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="flex justify-between">
                <div className="mb-3 w-[48%]">
                  <DateTimePicker
                    minDate={new Date()}
                    value={eventTime.startDate}
                    onChange={(date) => handleEventTimeChange(index, "startDate", date)}
                    label="Start date and time"
                    placeholder="Start date and time"
                    clearable
                    highlightToday
                  />
                  {errors[`startDate_${index}`] && (
                    <span className="text-red-500 text-sm">{errors[`startDate_${index}`]}</span>
                  )}
                </div>
                <div className="mb-3 w-[48%]">
                  <DateTimePicker
                    minDate={eventTime.startDate}
                    value={eventTime.endDate}
                    onChange={(date) => handleEventTimeChange(index, "endDate", date)}
                    label="End date and time"
                    placeholder="End date and time"
                    clearable
                    highlightToday
                  />
                  {errors[`endDate_${index}`] && (
                    <span className="text-red-500 text-sm">{errors[`endDate_${index}`]}</span>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <select
                  value={eventTime.venue}
                  onChange={(e) => handleEventTimeChange(index, "venue", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring ${errors[`venue_${index}`] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'}`}
                >
                  <option value="">Select Venue</option>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
                {errors[`venue_${index}`] && (
                  <span className="text-red-500 text-sm">{errors[`venue_${index}`]}</span>
                )}
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Ticket Prices</h4>
                {eventTime.ticketPrices.map((ticketPrice, priceIndex) => (
                  <div key={priceIndex} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Ticket Type (e.g., General, VIP)"
                      value={ticketPrice.type}
                      onChange={(e) => handleTicketPriceChange(index, priceIndex, "type", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring ${errors[`ticketPrice_${index}_${priceIndex}_type`] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'}`}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={ticketPrice.price}
                      onChange={(e) => handleTicketPriceChange(index, priceIndex, "price", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring ${errors[`ticketPrice_${index}_${priceIndex}_price`] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'}`}
                    />
                    {eventTime.ticketPrices.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 hover:underline"
                        onClick={() => removeTicketPrice(index, priceIndex)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                
              <div className="flex flex-col">
                {Object.keys(errors).some(errorKey => errorKey.startsWith(`ticketPrice_${index}_`) && errorKey.endsWith('_type')) && (
                  <span className="text-red-500 text-sm">Ticket type is required for each ticket price.</span>
                )}

                <button
                  type="button"
                  className="text-indigo-500 hover:underline mt-2"
                  onClick={() => addTicketPrice(index)}
                >
                  Add Another Ticket Price
                </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="mt-4 w-full px-4 py-2 text-indigo-500 hover:underline"
            onClick={addEventTime}
          >
            Add Another Event Time
          </button>
        </div>
  
        <div className="mb-4 flex flex-col items-center w-full">
          <div
            className={`border-2 border-dashed border-gray-600 relative flex flex-col justify-center items-center rounded-lg text-center hover:bg-gray-100 transition-all duration-300 cursor-pointer min-w-[255px] w-[100%] max-w-[300px] ${event.imagePreview ? "h-[400px]" : "h-[150px]"}`}
            onDrop={handleImageDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {event.imagePreview ? (
              <>
                <img
                  src={event.imagePreview}
                  alt="Image Preview"
                  className="absolute inset-0 h-full w-full object-cover rounded-lg"
                />
                <label className="absolute inset-0 z-10 cursor-pointer">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full w-full">
                <label className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-200 z-10 relative inline-block">
                  Upload Image
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-gray-500 z-10 relative">
                  Or drag and drop image here
                </p>
              </div>
            )}
          </div>
          <div>
            {errors.image && <span className="text-red-500 text-sm mt-2">{errors.image}</span>}
          </div>
        </div>
  
        {isCropping && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" style={{ marginTop: 0, marginBottom: 0 }}>
            <div className="relative w-full h-full flex justify-center items-center">
              <div className="absolute top-[1%] w-[85vw] h-[85vh]">
                <Cropper
                  image={imagePreview}
                  crop={crop}
                  zoom={zoom}
                  aspect={3 / 4}
                  minZoom={1}
                  maxZoom={2}
                  zoomSpeed={0.1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="controls absolute bottom-24 left-1/2 transform -translate-x-1/2 w-[40%] flex items-center">
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={2}
                  step={0.01}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="zoom-range"
                />
              </div>
              <div className="flex justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2 space-x-4 mb-5">
                <button
                  type="button"
                  onClick={handleCropCancel}
                  className="bg-gray-300 text-gray-800 rounded-lg px-6 py-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleCropSave(croppedAreaPixels)}
                  className="bg-indigo-500 text-white rounded-lg px-6 py-2 hover:bg-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
  
        <button
          type="submit" disabled={loading}
          className="mt-6 w-full px-4 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600"
        >
          {loading ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEvents;
