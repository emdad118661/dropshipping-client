import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Stars = ({ rating = 0 }) => {
  const rounded = Math.round(rating * 2) / 2;         // Round to nearest 0.5
  const fullStars = Math.floor(rounded);              // 4 or 5
  const hasHalfStar = rounded % 1 === 0.5;            // true if 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty

  return (
    <div className="flex items-center gap-1 text-sm text-yellow-400">
      {/* Full Stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <FaStar key={`full-${i}`} />
      ))}

      {/* Half Star */}
      {hasHalfStar && <FaStarHalfAlt key="half" />}

      {/* Empty Stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-gray-300" />
      ))}

      {/* Numeric label (optional) */}
      <span className="ml-2 text-xs text-gray-600">({rating.toFixed(1)}) </span>
    </div>
  );
};

export default Stars;