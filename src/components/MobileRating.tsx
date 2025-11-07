import { useState, useRef, useEffect } from 'react';

interface MobileRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export default function MobileRating({ rating, onRatingChange }: MobileRatingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRating, setTempRating] = useState(rating);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    setTempRating(rating);
  }, [rating]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const timer = setTimeout(() => {
      setIsOpen(true);
      isDragging.current = true;
    }, 300); // 300ms delay
    setHoldTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isOpen || !sliderRef.current) return;

    const touch = e.touches[0];
    const rect = sliderRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newRating = Math.round(percentage * 10) / 2; // 0.5 step
    setTempRating(newRating);
  };

  const handleTouchEnd = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }

    if (isOpen) {
      onRatingChange(tempRating);
      setIsOpen(false);
    }
    isDragging.current = false;
  };

  const handleTouchCancel = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    setIsOpen(false);
    isDragging.current = false;
    setTempRating(rating);
  };

  // Cleanup timer on unmount
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
      const halfFilled = star === Math.ceil(displayRating) && displayRating % 1 !== 0;
      
      return (
        <span key={star} className="popup-star">
          {filled ? '★' : halfFilled ? '⯨' : '☆'}
        </span>
      );
    });
  };

  return (
    <div className="mobile-rating-container">
      <button
        className="mobile-rating-trigger"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {rating.toFixed(1)}
      </button>

      {isOpen && (
        <div className="rating-popup">
          <div className="popup-stars">
            {renderStars(tempRating)}
          </div>
          <div 
            ref={sliderRef}
            className="popup-slider"
            onTouchMove={handleTouchMove}
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
      )}
    </div>
  );
}