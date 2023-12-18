import React, { useState } from 'react';

const StarRatingInput = ({ onRatingSelect }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (star) => {
    setRating(star);
    onRatingSelect(star);
  };

  return (
    <div className="star-rating">
    {[...Array(5)].map((_, index) => {
      const ratingValue = index + 1;

      return (
        <label key={index} style={{ cursor: 'pointer' }}>
          <input
            type="radio"
            name="rating"
            value={ratingValue}
            onClick={() => handleClick(ratingValue)}
            style={{ opacity: 0, position: 'absolute', width: 0 }} // Ẩn input radio
          />
          <span
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(rating)}
            style={{
              color: ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9',
            }}>
            &#9733;
          </span>
        </label>
      );
    })}
  </div>
  );
};
export default StarRatingInput;