import { createContext, useState, useContext } from "react";

const CarouselContext = createContext();

export const useCarousel = () => {
  return useContext(CarouselContext);
};

export const CarouselProvider = ({ children }) => {
  const [carousels, setCarousels] = useState({});

  const initializeCarousel = (id) => {
    if (!carousels[id]) {
      setCarousels((prev) => ({
        ...prev,
        [id]: {
          currentIndex: 0,
          goToNextSlide: (items, cardsToShow) => {
            setCarousels((prev) => {
              const newIndex = prev[id].currentIndex + 1;
              return newIndex <= items.length - cardsToShow
                ? {
                    ...prev,
                    [id]: { ...prev[id], currentIndex: newIndex },
                  }
                : prev;
            });
          },
          goToPrevSlide: (items) => {
            setCarousels((prev) => {
              const newIndex = prev[id].currentIndex - 1;
              console.log(`Previous Slide: ${newIndex}`);
              return newIndex >= 0
                ? {
                    ...prev,
                    [id]: { ...prev[id], currentIndex: newIndex },
                  }
                : prev;
            });
          },
        },
      }));
    }
  };

  const updateCarouselIndex = (id, newIndex) => {
    setCarousels((prev) => ({
      ...prev,
      [id]: { ...prev[id], currentIndex: newIndex },
    }));
  };

  return (
    <CarouselContext.Provider
      value={{ initializeCarousel, carousels, updateCarouselIndex }}
    >
      {children}
    </CarouselContext.Provider>
  );
};
