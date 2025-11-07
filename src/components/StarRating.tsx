import React from 'react'; // Імпорт React необхідний для JSX

// --- Вбудовані SVG Іконки ---
// Кольори взяті з .star-filled (#fbbf24) та .star-empty (#d1d5db) у App.css
const FILLED_COLOR = '#fbbf24';
const EMPTY_COLOR = '#d1d5db';

// Загальний стиль для всіх іконок, щоб гарантувати однакове відображення
const iconStyle: React.CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'baseline', // Вирівнюємо по базовій лінії
  width: '1em', // Ширина буде успадковуватись від font-size батька
  height: '1em', // Висота буде успадковуватись від font-size батька
};

const FullStarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill={FILLED_COLOR}
    xmlns="http://www.w3.org/2000/svg"
    style={iconStyle}
    aria-hidden="true"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
  </svg>
);

const EmptyStarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill={EMPTY_COLOR}
    xmlns="http://www.w3.org/2000/svg"
    style={iconStyle}
    aria-hidden="true"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
  </svg>
);
// --- Кінець Вбудованих SVG Іконок ---

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export default function StarRating({ rating, onRatingChange }: StarRatingProps) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className="star-button"
          onClick={() => onRatingChange(star)}
          aria-label={`Rate ${star} stars`}
        >
          {/*
            Замінюємо символи на SVG компоненти.
            Класи .star-filled та .star-empty тепер не впливають на колір.
          */}
          <span className={star <= rating ? 'star-filled' : 'star-empty'}>
            {star <= rating ? <FullStarIcon /> : <EmptyStarIcon />}
          </span>
        </button>
      ))}
    </div>
  );
}