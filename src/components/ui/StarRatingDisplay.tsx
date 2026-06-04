import React from 'react';

interface StarRatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRatingDisplay({ rating, size = 'sm' }: StarRatingDisplayProps) {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2;

  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6';

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(
        <svg key={i} className={`${sizeClass} text-[#FFB400]`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    } else if (i - 0.5 === roundedRating) {
      stars.push(
        <svg key={i} className={`${sizeClass} text-[#FFB400]`} fill="currentColor" viewBox="0 0 24 24" id={`half-star-svg-${i}`}>
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="#FFB400" />
              <stop offset="50%" stopColor="#EBEBEB" />
            </linearGradient>
          </defs>
          <path fill={`url(#half-${i})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className={`${sizeClass} text-[#EBEBEB]`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
}
