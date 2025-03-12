import React, { useContext, useRef, useEffect } from "react";
import { CartContext } from "../../Context/CartContext";
import CartItem from "./CartItem";
import { useDiscountLevel } from "../../Hooks/UseDiscount";
import { loadStripe } from "@stripe/stripe-js";

const Cart = ({ cartButtonRef }) => {
  const { cartItems, updateItemQuantity, removeFromCart, isCartOpen, setIsCartOpen } =
    useContext(CartContext);
  const cartRef = useRef(null);

  const vatRate = 0.07;
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const vatAmount = totalPrice * vatRate;
  const totalWithVAT = totalPrice + vatAmount;

  const { discountPercentage } = useDiscountLevel(totalPrice);
  const discountAmount = (totalWithVAT * discountPercentage) / 100;
  const totalWithDiscount = totalWithVAT - discountAmount;

  const stripePromise = loadStripe("pk_test_51OWZ2IHrTxM02xRgsNyjZI5qEKyBxeIRiIWhxcMrQzthIJPL5nT6xscTO9TSbcfjZ99iPHlNTndRH7NtCX5q0P6E00A9XKdpgo");

  const handleCheckout = async () => {
    const cartItemsData = cartItems.map(item => ({
      event_id: item.event.id,
      event_image: item.event.image, 
      event_name: item.event.title,  
      price: Math.round(item.price * 100), 
      quantity: item.quantity  
    }));

    try {
      const response = await fetch('https://ticketopia-backend-main-dc9cem.laravel.cloud/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItemsData,
          total_price: Math.round(totalWithDiscount * 100)  
        })
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.url;
      } else {
        console.error('Checkout session creation failed:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        cartButtonRef?.current &&
        !cartButtonRef.current.contains(event.target) &&
        !event.target.closest(".cart-item-button")
      ) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, setIsCartOpen, cartButtonRef]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setIsCartOpen(false);
    }
  }, [cartItems, setIsCartOpen]);

  return (
    <div
      ref={cartRef}
      className={`fixed top-0 right-0 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200 border-l border-gray-300 dark:border-gray-700 transition-transform transform ${
        isCartOpen ? "translate-x-0 shadow-xl shadow-gray-500/50 dark:shadow-gray-900" : "translate-x-full"
      } cart-container`}
      style={{ height: "100vh", zIndex: 1000 }}
    >
      <div className="flex flex-col h-full p-6 cart-content">
        <h2 className="text-2xl font-semibold mb-4 cart-title">
          Shopping Cart
        </h2>

        <div className="flex-grow overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                handleRemoveOne={() => updateItemQuantity(index, -1)}
                handleRemoveAll={() => removeFromCart(index)}
                handleAddOne={() => updateItemQuantity(index, 1)}
                className="cart-item"
              />
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              Your cart is empty.
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-4 cart-total">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
              <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300">PVN (7%):</span>
              <span className="text-lg font-bold">${vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300">
                Discount ({discountPercentage}%):
              </span>
              <span className="text-lg font-bold text-gray-600">
                -${discountAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span className="text-gray-900 dark:text-gray-100">
                Total with Discount:
              </span>
              <span className="text-lg text-gray-900 dark:text-gray-100">
                ${totalWithDiscount.toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold py-2 px-4 rounded mt-4 checkout-button"
            onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
