import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FullStarIcon, HalfStarIcon, EmptyStarIcon } from './StarIcons';

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
  const [isPopupTop, setIsPopupTop] = useState(true); 
  const sliderRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setTempRating(rating);
    }
  }, [rating, isOpen]);

  const updateRatingFromTouch = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (!sliderRef.current) return;
    const touch = e.touches[0];
    const rect = sliderRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newRating = Math.round(percentage * 10) / 2; 
    setTempRating(newRating);
  }, []); 

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setTempRating(rating); 

    if (triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = triggerRect.top;
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const popupHeight = 100;

      if (spaceAbove < popupHeight && spaceBelow > spaceAbove) {
        setIsPopupTop(false); 
      } else {
        setIsPopupTop(true);
      }
    }

    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleWindowTouchMove = (e: TouchEvent) => {
      e.preventDefault(); 
      updateRatingFromTouch(e);
    };

    const handleTouchEndGlobal = () => {
      onRatingChange(tempRating);
      setIsOpen(false);
    };

    window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEndGlobal);
    window.addEventListener('touchcancel', handleTouchEndGlobal);

    return () => {
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleTouchEndGlobal);
      window.removeEventListener('touchcancel', handleTouchEndGlobal);
    };
  }, [isOpen, onRatingChange, tempRating, updateRatingFromTouch]);

  const renderStars = (displayRating: number) => {
    return [1, 2, 3, 4, 5].map((star) => {
      const filled = star <= Math.floor(displayRating);
      const halfFilled =
        star === Math.ceil(displayRating) && displayRating % 1 !== 0;

      return (
        <span key={star} className="popup-star">
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

  return (
    <div className="mobile-rating-container">
      <button
        ref={triggerRef}
        className="mobile-rating-trigger"
        onTouchStart={handleTouchStart}
      >
        {rating.toFixed(1)}
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="rating-popup"
          style={
            isPopupTop
              ? { bottom: 'calc(100% + 8px)' }
              : { top: 'calc(100% + 8px)' }
          }
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="popup-stars">{renderStars(tempRating)}</div>
          <div ref={sliderRef} className="popup-slider">
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
        </div>
      )}
    </div>
  );
}