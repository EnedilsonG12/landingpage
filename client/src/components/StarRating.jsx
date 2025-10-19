import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ productId, initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null);

  const handleClick = (value) => {
    setRating(value);
    if (onRate) onRate(productId, value);
  };

  return (
    <div className="stars">
      {[...Array(5)].map((_, index) => {
        const value = index + 1;
        return (
          <FaStar
            key={value}
            size={22}
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}
            color={value <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
            style={{ cursor: "pointer", marginRight: "3px" }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
