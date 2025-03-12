import React from "react";
import AutoCarousel from "../Components/HomePage/AutoCarousel";
import ContinueViewingCarousel from "../Components/HomePage/ContinueViewingCarousel";
import RecommendedCarousel from "../Components/HomePage/RecommendedCarousel";
import { CarouselProvider } from "../Context/CarouselContext";

const events = [
  {
    title: "Concert A",
    date: "2024-09-20",
    location: "New York, NY",
    image:
      "https://cdn.ticketshop.lv/event/6306/5f3e6ef9f6352bb42765f8f1fb71fa76/1000x500.jpg",
  },
  {
    title: "Comedy Show B",
    date: "2024-10-05",
    location: "Los Angeles, CA",
    image:
      "https://cdn.ticketshop.lv/event/6306/5f3e6ef9f6352bb42765f8f1fb71fa76/1000x500.jpg",
  },
  {
    title: "Casdasd",
    date: "2024-10-05",
    location: "wergwergwggfsdf",
    image:
      "https://cdn.ticketshop.lv/event/6306/5f3e6ef9f6352bb42765f8f1fb71fa76/1000x500.jpg",
  },
  {
    title: "wergwerg",
    date: "2024-10-05",
    location: "wergewrg",
    image:
      "https://cdn.ticketshop.lv/event/6306/5f3e6ef9f6352bb42765f8f1fb71fa76/1000x500.jpg",
  },
  {
    title: "wergwerg",
    date: "2024-10-05",
    location: "wergewrg",
    image:
      "https://cdn.ticketshop.lv/event/6306/5f3e6ef9f6352bb42765f8f1fb71fa76/1000x500.jpg",
  },
  {
    title: "wergwerg",
    date: "2024-10-05",
    location: "wergewrg",
    image:
      "https://cdn.ticketshop.lv/event/6306/5f3e6ef9f6352bb42765f8f1fb71fa76/1000x500.jpg",
  },
  {
    title: "wergwerg",
    date: "2024-10-05",
    location: "wergewrg",
    image:
      "https://cdn.ticketshop.lv/event/6306/5f3e6ef9f6352bb42765f8f1fb71fa76/1000x500.jpg",
  },
];

const Homepage = () => {

  return (
    <CarouselProvider>
      <div
        className={`w-full mb-8 min-h-screen`}
      >
        <AutoCarousel items={events} />
        <ContinueViewingCarousel
          events={events}
          carouselId="continueViewingCarousel"
        />
        <RecommendedCarousel events={events} carouselId="recommendedCarousel" />
      </div>
    </CarouselProvider>
  );
};

export default Homepage;
