import { useState, useEffect } from "react";

// Define the levels for discounts based on thresholds
const levels = [
  { name: "Beginner", threshold: 0, discount: 0 },
  { name: "Bronze", threshold: 50, discount: 5 },
  { name: "Silver", threshold: 100, discount: 10 },
  { name: "Gold", threshold: 150, discount: 15 },
  { name: "Platinum", threshold: 200, discount: 20 },
];

/**
 * Custom hook to calculate the discount level, next level, and progress based on the total price.
 * @param {number} totalPrice - The current total price in the cart
 * @returns {Object} - Contains discountPercentage, nextLevel, totalSpent, and progress
 */
export const useDiscountLevel = (totalPrice) => {
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [nextLevel, setNextLevel] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Find the index of the current level based on the total spent
    const currentLevelIndex = levels.findIndex(
      (level) => totalPrice < level.threshold,
    );
    const currentLevel =
      currentLevelIndex > 0
        ? levels[currentLevelIndex - 1]
        : levels[levels.length - 1];
    const next = levels[currentLevelIndex] || null;

    // Update discount, next level, and progress
    setDiscountPercentage(currentLevel.discount);
    setNextLevel(next);
    setTotalSpent(totalPrice);

    // Calculate progress to the next discount level (if any)
    if (next) {
      const newProgress = ((totalPrice / next.threshold) * 100).toFixed(0);
      setProgress(newProgress);
    } else {
      setProgress(100); // Max level reached
    }
  }, [totalPrice]);

  return { discountPercentage, nextLevel, totalSpent, progress };
};
