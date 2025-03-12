import React, { createContext, useState, useContext, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false); // Track cart visibility

  const getRemainingTime = () => {
    const savedTimestamp = localStorage.getItem("timerTimestamp");
    const savedTime = localStorage.getItem("timer");

    if (savedTimestamp && savedTime) {
      const startTime = parseInt(savedTimestamp, 10); // The time when the timer started
      const endTime = startTime + parseInt(savedTime, 10) * 1000; // Timer will end here

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(endTime - Date.now(), 0); // Ensure no negative time

      return Math.floor(remainingTime / 1000); // Convert to seconds
    }

    return 10 * 60; // Default: 10 minutes
  };

  const [timer, setTimer] = useState(getRemainingTime);

  useEffect(() => {
    if (timer <= 0) {
      clearCart(); // Only clears when timer truly hits 0
    } else {
      localStorage.setItem("timer", timer.toString());
      localStorage.setItem("timerTimestamp", Date.now().toString());
    }
  }, [timer]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
    localStorage.removeItem("timer");
    localStorage.removeItem("timerTimestamp");
  };

  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem.event.title === item.event.title &&
        cartItem.ticketType === item.ticketType
    );

    let updatedItems;
    if (existingItemIndex > -1) {
      updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
    } else {
      updatedItems = [...cartItems, item];
    }

    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    resetTimer();
    setIsCartOpen(true); // Open cart when an item is added
  };

  const removeFromCart = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const updateItemQuantity = (index, quantityChange) => {
    const updatedItems = [...cartItems];
    const item = updatedItems[index];
    const newQuantity = item.quantity + quantityChange;

    if (newQuantity <= 0) {
      updatedItems.splice(index, 1);
    } else {
      updatedItems[index] = { ...item, quantity: newQuantity };
    }

    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));

    // Reset the timer when quantity is updated
    resetTimer();
  };

  const resetTimer = () => {
    const newTime = 10 * 60; // 10 minutes in seconds
    setTimer(newTime);
    localStorage.setItem("timer", newTime.toString());
    localStorage.setItem("timerTimestamp", Date.now().toString());
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        timer,
        isCartOpen, // Expose isCartOpen
        setIsCartOpen, // Expose setter for Cart open state
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
