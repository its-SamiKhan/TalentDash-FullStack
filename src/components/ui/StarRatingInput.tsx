'use client';

import React, { useState } from 'react';

interface StarRatingInputProps {
  label?: string;
  rating: number;
  onChange: (rating: number) => void;
  error?: string;
}

export function StarRatingInput({ label, rating, onChange, error }: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="w-full">
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-wider text-[#717171] mb-1.5">
          {label}
        </span>
      )}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
          >
            <svg
              className={`h-7 w-7 transition-colors ${
                star <= (hoverRating ?? rating) ? 'text-[#FFB400]' : 'text-[#EBEBEB]'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-[#D93025] font-medium">{error}</p>}
    </div>
  );
}
