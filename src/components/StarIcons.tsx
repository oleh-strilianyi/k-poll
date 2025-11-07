import React from 'react';

// Кольори взяті з .star-filled (#fbbf24) та .star-empty (#d1d5db) у App.css
const FILLED_COLOR = '#fbbf24';
const EMPTY_COLOR = '#d1d5db';

// Загальний стиль для всіх іконок, щоб гарантувати однакове відображення
const iconStyle: React.CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'baseline', // Вирівнюємо по базовій лінії тексту/інших іконок
  width: '1em', // Ширина буде успадковуватись від font-size батька
  height: '1em', // Висота буде успадковуватись від font-size батька
};

export const FullStarIcon = () => (
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

export const HalfStarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={iconStyle}
    aria-hidden="true"
  >
    {/* Контур порожньої зірки */}
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
      fill={EMPTY_COLOR}
    />
    {/* Половина заповненої зірки */}
    <path
      d="M12 17.27V2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
      fill={FILLED_COLOR}
    />
  </svg>
);

export const EmptyStarIcon = () => (
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