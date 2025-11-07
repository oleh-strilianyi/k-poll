import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FullStarIcon, HalfStarIcon, EmptyStarIcon } from './StarIcons';
import { useTooltip } from '../contexts/TooltipContext';
import styles from './MobileRating.module.css';

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
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const [isTap, setIsTap] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const holdTimerRef = useRef<number | null>(null);
  const { showTooltip } = useTooltip();

  useEffect(() => {
    if (!isOpen) {
      setTempRating(rating);
    }
  }, [rating, isOpen]);

  useEffect(() => {
    if (isOpen && popupRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const style: React.CSSProperties = {
        position: 'fixed',
        opacity: 1,
        transform: 'none',
        pointerEvents: 'auto',
      };

      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      if (spaceAbove > popupRect.height + 8) {
        style.top = triggerRect.top - popupRect.height - 8;
      } else if (spaceBelow > popupRect.height + 8) {
        style.top = triggerRect.bottom + 8;
      } else {
        style.top = Math.max(8, viewportHeight - popupRect.height - 8);
      }

      const triggerCenter = triggerRect.left + triggerRect.width / 2;
      let left = triggerCenter - popupRect.width / 2;
      if (left < 8) left = 8;
      if (left + popupRect.width > viewportWidth - 8) {
        left = viewportWidth - popupRect.width - 8;
      }
      style.left = left;

      setPopupStyle(style);
    } else if (!isOpen) {
      setPopupStyle({ opacity: 0, pointerEvents: 'none' });
    }
  }, [isOpen]);

  const updateRatingFromTouch = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (!sliderRef.current) return;
      const touch = e.touches[0];
      const rect = sliderRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newRating = Math.round(percentage * 10) / 2;
      setTempRating(newRating);
    },
    []
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsTap(true);
    setTempRating(rating);

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }

    holdTimerRef.current = window.setTimeout(() => {
      setIsTap(false);
      setIsOpen(true);
      holdTimerRef.current = null;
    }, 300);
  };

  const handleTouchMove = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsTap(false);
  };

  const handleTouchEnd = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isTap) {
      setIsTap(false);

      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const badgeCenterX = rect.left + rect.width / 2;
        const badgeTopY = rect.top;

        showTooltip(
          'Треба затиснути',
          badgeCenterX - 60, 
          badgeTopY           
        );
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleWindowTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateRatingFromTouch(e);
    };

    const handleTouchEndGlobal = () => {
      setIsOpen(false);
      onRatingChange(tempRating);
    };

    window.addEventListener('touchmove', handleWindowTouchMove, {
      passive: false,
    });
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
        <span key={star} className={styles.popupStar}>
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
    <div className={styles.mobileRatingContainer}>
      <button
        ref={triggerRef}
        className={styles.mobileRatingTrigger}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {rating.toFixed(1)}
      </button>

      <div
        ref={popupRef}
        className={styles.ratingPopup}
        style={popupStyle}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className={styles.popupStars}>{renderStars(tempRating)}</div>
        <div ref={sliderRef} className={styles.popupSlider}>
          <div className={styles.sliderTrack}>
            <div
              className={styles.sliderFill}
              style={{ width: `${(tempRating / 5) * 100}%` }}
            />
            <div
              className={styles.sliderThumb}
              style={{ left: `${(tempRating / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}