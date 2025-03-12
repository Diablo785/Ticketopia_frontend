import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";

const ImagePopUp = ({ isOpen, onClose, imageUrl }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  if (!isOpen) return null;

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPosition({ x, y });
    setIsZoomed(!isZoomed);
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-[90%] md:max-w-full h-full max-h-[90%] rounded-lg overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Full-size"
          className={`w-full h-full object-contain transition-transform duration-300 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={{
            transformOrigin: `${(zoomPosition.x / (imageRef.current?.clientWidth || 1)) * 100}% ${(zoomPosition.y / (imageRef.current?.clientHeight || 1)) * 100}%`,
            transition: "transform 0.3s",
          }}
          onClick={handleImageClick}
        />
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-4 text-4xl`}
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ImagePopUp;
