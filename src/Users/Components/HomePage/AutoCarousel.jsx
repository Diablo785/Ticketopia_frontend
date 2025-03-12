import React from "react";
import { Link } from "react-router-dom";
import { useAutoCarousel } from "../../Context/AutoCarouselContext";

const AutoCarousel = ({ items }) => {
  const { currentIndex, goToNextSlide, goToPrevSlide, setCurrentSlide } =
    useAutoCarousel(items);

  return (
    <div className="relative w-full h-[425px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full relative">
            <div
              className="absolute top-0 left-0 h-full w-[70%] z-10"
              style={{
                background:
                  "linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))",
              }}
            ></div>

            <img
              src={
                item.image ||
                "https://cdn.ticketshop.lv/event/6306/5f3e6ef9f6352bb42765f8f1fb71fa76/1000x500.jpg"
              }
              alt={item.title}
              className="w-full h-full object-cover overflow-x-scroll"
            />

            <div className="absolute left-[50px] sm:left-[60px] lg:left-[80px] top-1/2 transform -translate-y-1/2 z-20 w-[80%] sm:w-[70%] lg:w-[30%] text-white p-2 sm:p-4">
              <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                {item.title}
              </h2>
              <p className="text-base sm:text-lg lg:text-lg mt-1">
                {item.date}
              </p>
              <p className="text-base sm:text-lg lg:text-lg mt-1">
                {item.location}
              </p>

              <Link
                to={{
                  pathname: `/event-details`,
                  state: { event: item },
                }}
                className="bg-blue-500 text-white text-sm sm:text-base lg:text-lg px-[2vw] py-[1vw] sm:px-[1.8vw] sm:py-[0.8vw] lg:px-[1.5vw] lg:py-[0.7vw] rounded-lg mt-2 inline-block"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 border border-white rounded-full z-30 transition-transform duration-300 hover:bg-gray-700"
        style={{ border: "1px solid white" }}
      >
        &#10094;
      </button>

      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 border border-white rounded-full z-30 transition-transform duration-300 hover:bg-gray-700"
        style={{ border: "1px solid white" }}
      >
        &#10095;
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center z-30">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 mx-1 rounded-full ${
              currentIndex === index ? "bg-blue-600" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoCarousel;
