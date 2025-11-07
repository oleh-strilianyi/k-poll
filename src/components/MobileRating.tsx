import React, { useState, useRef, useEffect } from 'react';

// --- Вбудовані SVG Іконки ---
const FILLED_COLOR = '#fbbf24';
const EMPTY_COLOR = '#d1d5db';

const iconStyle: React.CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'baseline',
  width: '1em',
  height: '1em',
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

const HalfStarIcon = () => (
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

interface MobileRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export default function MobileRating({
  rating,
  onRatingChange,
}: MobileRatingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRating, setTempRating] = useState(rating);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    setTempRating(rating);
  }, [rating]);

  const updateRatingFromTouch = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const touch = e.touches[0];
    const rect = sliderRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newRating = Math.round(percentage * 10) / 2; // Крок 0.5
    setTempRating(newRating);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const timer = setTimeout(() => {
      setIsOpen(true);
      isDragging.current = true;
    }, 300); // Затримка 300ms
    setHoldTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (holdTimer) {
      clearTimeout(holdTimer); // Якщо користувач почав рухати пальцем, не відкриваємо попап
      setHoldTimer(null);
    }

    if (isOpen) {
      updateRatingFromTouch(e);
    }
  };

  // Обробник для слайдера
  const handleSliderTouchMove = (e: React.TouchEvent) => {
    if (!isOpen) return;
    updateRatingFromTouch(e);
  };

  const handleTouchEnd = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }

    // Якщо ми не перетягували (тобто не відкрили попап),
    // то це був клік, який теж має відкрити попап
    if (!isDragging.current && !isOpen) {
      setIsOpen(true);
    }

    // Зберігаємо рейтинг при відпусканні пальця зі слайдера.
    if (isOpen) {
      onRatingChange(tempRating);
    }

    isDragging.current = false;
  };

  const handleTouchCancel = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    // Якщо жест скасовано, закриваємо і скидаємо
    setIsOpen(false);
    isDragging.current = false;
    setTempRating(rating);
  };

  // Очищення таймера
  useEffect(() => {
    return () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
      }
    };
  }, [holdTimer]);

  const renderStars = (displayRating: number) => {
    return [1, 2, 3, 4, 5].map((star) => {
      const filled = star <= Math.floor(displayRating);
      const halfFilled =
        star === Math.ceil(displayRating) && displayRating % 1 !== 0;

      return (
        <span key={star} className="popup-star">
          {/* Замінюємо символи на SVG компоненти */}
          {filled ? (
            <FullStarIcon />
          ) : halfFilled ? (
            <HalfStarIcon />
          ) : (
            <EmptyStarIcon />
          )}
        </span>
      );
    });
  };

  const closePopup = () => {
    onRatingChange(tempRating); // Зберігаємо рейтинг при закритті
    setIsOpen(false);
    isDragging.current = false;
  };

  return (
    <div className="mobile-rating-container">
      <button
        className="mobile-rating-trigger"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        // Додамо onClick для тестування на десктопі
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {rating.toFixed(1)}
      </button>

      {isOpen && (
        // Використовуємо div-бекдроп для закриття по кліку на фон
        <div
          className="rating-popup-backdrop"
          onClick={closePopup}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999, // Фон
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="rating-popup"
            // Зупиняємо клік, щоб він не закрив попап
            onClick={(e) => e.stopPropagation()}
            onTouchMove={handleSliderTouchMove} // Рух ТІЛЬКИ по слайдеру
            onTouchEnd={() => onRatingChange(tempRating)} // Зберігаємо, коли відпускаємо палець від слайдера
            onTouchCancel={handleTouchCancel}
          >
            <div className="popup-stars">{renderStars(tempRating)}</div>
            <div
              ref={sliderRef}
              className="popup-slider"
            >
              <div className="slider-track">
                <div
                  className="slider-fill"
                  style={{ width: `${(tempRating / 5) * 100}%` }}
                />
                <div
                  className="slider-thumb"
                  style={{ left: `${(tempRating / 5) * 100}%` }}
                />
              </div>
            </div>
            <div className="popup-value">{tempRating.toFixed(1)}</div>
          </div>
        </div>
      )}
    </div>
  );
}