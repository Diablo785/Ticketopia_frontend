import React from "react";

const CartItem = ({ item, handleAddOne, handleRemoveOne, handleRemoveAll }) => {
  return (
    <div className="flex items-center p-3 bg-white dark:bg-gray-800 shadow-md rounded-lg space-x-4 w-full min-w-[250px] max-w-md mx-auto md:max-w-lg">
      <img
        className="w-14 h-14 object-cover rounded-md"
        src={item.event.image}
        alt={item.event.title}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-lg truncate">
          {item.event.title}
        </span>
        <span className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mt-5 md:mt-2">
          {item.ticketType}
        </span>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <span className="text-gray-900 dark:text-gray-100 font-medium text-sm md:text-base">
          €{item.price.toFixed(2)}
        </span>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleRemoveOne}
            className="w-7 h-7 bg-gray-100 dark:bg-gray-700 text-lg font-semibold rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-center items-center"
          >
            -
          </button>
          <span className="w-6 text-center text-gray-900 dark:text-gray-100 font-medium text-sm md:text-base">
            {item.quantity}
          </span>
          <button
            onClick={handleAddOne}
            className="w-7 h-7 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600 flex justify-center items-center"
          >
            +
          </button>
        </div>

        <button
          onClick={handleRemoveAll}
          className="text-xs md:text-sm text-red-500 dark:text-red-400 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
