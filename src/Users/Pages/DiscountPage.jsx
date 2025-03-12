import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../Context/CartContext";

const levels = [
  { name: "Beginner", threshold: 0, discount: "0%" },
  { name: "Bronze", threshold: 50, discount: "5%" },
  { name: "Silver", threshold: 100, discount: "10%" },
  { name: "Gold", threshold: 150, discount: "15%" },
  { name: "Platinum", threshold: 200, discount: "20%" },
];

const DiscountPage = () => {
  const { cartItems } = useCart();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null); // Reference to the popup container

  const totalSpent = 10;
  const currentLevelIndex = levels.findIndex(
    (level) => totalSpent < level.threshold,
  );
  const currentLevel =
    currentLevelIndex > 0
      ? levels[currentLevelIndex - 1]
      : levels[levels.length - 1];
  const nextLevel = levels[currentLevelIndex] || null;
  const progress = nextLevel
    ? ((totalSpent / nextLevel.threshold) * 100).toFixed(0)
    : 100;

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <div
      className={`w-full overflow-hidden`}
    >
      <div className="discount-container text-center p-4">
        <div className="current-level-container my-8">
          <p
            className={`text-5xl font-extrabold py-3 px-6 rounded-lg shadow-lg ransition duration-300 border-4`}
          >
            {currentLevel.name}
          </p>
          <p
            className={`text-3xl mt-2 ransition duration-300 font-semibold`}
          >
            {currentLevel.discount} Discount
          </p>
        </div>

        <div
          className={`text-center mt-4`}
        >
          <p className="text-lg font-bold tracking-wide">Total Spent:</p>
          <p
            className={`text-3xl font-extrabold transition duration-300`}
          >
            €{totalSpent.toFixed(2)}
          </p>
        </div>

        {nextLevel && (
          <>
            <p className="text-lg mt-6">
              Next Level: <strong>{nextLevel.name}</strong> -{" "}
              {nextLevel.discount} Discount
            </p>
            <p className="mt-2 text-center">
              Spend €{(nextLevel.threshold - totalSpent).toFixed(2)} more to
              reach the next level.
            </p>
          </>
        )}

        <div
          className={`progressbar-container border-2 overflow-hidden mt-4`}
        >
          <div
            className="progressbar-complete"
            style={{ width: `${progress}%` }}
          >
            <div className="progressbar-liquid"></div>
          </div>
          <span className="progress">{progress}%</span>
        </div>

        <button
          className={`mt-8 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-700 text-white`}
          onClick={togglePopup}
        >
          View Level Details
        </button>

        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
              ref={popupRef}
              className={`p-6 rounded shadow-lg w-11/12 max-w-md max-h-[90vh] overflow-y-auto`}
            >
              <h2 className="text-xl font-bold mb-4">Level Details</h2>
              <ul>
                {levels.map((level) => (
                  <li key={level.name} className="mb-2">
                    <strong>{level.name}:</strong> Spend €{level.threshold} -{" "}
                    {level.discount} Discount
                  </li>
                ))}
              </ul>
              <button
                className={`mt-4 py-2 px-4 rounded transition duration-300 text-white`}
                onClick={togglePopup}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountPage;
