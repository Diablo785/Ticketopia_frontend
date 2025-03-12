import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../Hooks/UseCart";
import ImagePopUp from "../Components/PopUps/ImagePopUp";

const EventDetailsPage = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const { addToCart } = useCart();
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [ticketType, setTicketType] = useState(event?.ticket_prices?.[0]?.ticket_type || "General Admission");
  const [isScrolled, setIsScrolled] = useState(false);

  const selectedTicket = event?.ticket_prices?.find(
    (ticket) => ticket.ticket_type === ticketType
  );
  const ticketPrice = selectedTicket ? parseFloat(selectedTicket.price) : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = (ticketType) => {
    addToCart({
      event,
      ticketType,
      quantity: 1,
      price: ticketPrice,
    });
  };

  const handleImageClick = () => {
    setImagePopupOpen(true);
  };

  const handleClosePopup = () => {
    setImagePopupOpen(false);
  };

  if (!event) {
    return <div>Event not found.</div>;
  }

  const formattedDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#242424] text-white">
      <div className="relative h-64 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${event.image})`,
            transform: isScrolled ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.5s ease-out',
            filter: 'brightness(50%)',
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 md:px-6 -mt-16 md:-mt-24 relative z-10">
        <div className="bg-[#2e2e2e] rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="lg:w-2/5 p-6 flex justify-center items-center">
              <img
                className="w-full h-auto object-cover rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
                src={event.image}
                alt={event.title}
                onClick={handleImageClick}
              />
            </div>

            <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col border-l border-gray-700 justify-between">
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.dates.map((date, index) => (
                    <div key={index} className="px-4 py-2 bg-[#444] flex items-center text-gray-300 rounded-full text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formattedDate(date.start_date)} - {formattedDate(date.end_date)}
                    </div>
                  ))}
                </div>

                <div className="bg-[#3a3a3a] p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About This Event</h3>
                  <p className="leading-relaxed">{event.description || "No description available."}</p>
                </div>
              </div>

              <div className="bg-[#3a3a3a] p-6 rounded-lg shadow-inner hidden md:block">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Buy Tickets</h3>
                <div className="mb-4">
                  <label htmlFor="ticketType" className="block text-lg mb-2 font-medium">
                    Ticket Type:
                  </label>
                  <select
                    id="ticketType"
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-[#2e2e2e] text-white"
                  >
                    {event.ticket_prices.map((ticket) => (
                      <option key={ticket.ticket_type} value={ticket.ticket_type}>
                        {ticket.ticket_type} - €{ticket.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-3xl font-bold">€{ticketPrice.toFixed(2)}</p>
                  <button
                    onClick={() => handleAddToCart(ticketType)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transform transition-transform duration-200 hover:scale-105 flex items-center"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#2e2e2e] rounded-xl shadow-lg p-6 mb-24">
          <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
             Venue Information</h3>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#444] p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Venue</h4>
                    <p className="text-lg">{event.venue || "Melno Cepurīšu Balerija"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#444] p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Address</h4>
                    <p className="text-lg">{event.address || "Raiņa iela 28, Jelgava"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#444] p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Email</h4>
                    <p className="text-lg">{event.contact?.email || "barsmcb@gmail.com"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#444] p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Phone</h4>
                    <p className="text-lg">{event.contact?.phone || "+371 27787776"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="w-full h-64 bg-[#3a3a3a] rounded-lg shadow-md overflow-hidden flex items-center justify-center">
                <p className="text-center">Google Maps Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImagePopUp isOpen={isImagePopupOpen} onClose={handleClosePopup} imageUrl={event?.image} />

      <div className="fixed z-50 bottom-0 left-0 w-full p-4 border-t md:hidden flex justify-center bg-[#2e2e2e] border-gray-700">
        <div className="flex flex-col items-center w-full max-w-[600px]">
          <div className="flex justify-between items-center mb-2 w-full">
            <label htmlFor="ticketTypeMobile" className="text-lg text-white">Ticket Type:</label>
            <p className="text-2xl font-bold text-green-500">€{ticketPrice.toFixed(2)}</p>
          </div>
          <select
            id="ticketTypeMobile"
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded mb-2 bg-[#3a3a3a] text-white"
          >
            {event.ticket_prices.map((ticket) => (
              <option key={ticket.ticket_type} value={ticket.ticket_type}>
                {ticket.ticket_type} - €{ticket.price}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleAddToCart(ticketType)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 w-full rounded transition-transform duration-200 hover:scale-105"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
