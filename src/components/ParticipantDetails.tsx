import { useState, useEffect } from 'react';
import type { Participant } from '../types';
import styles from './ParticipantDetails.module.css';

interface ParticipantDetailsProps {
  participant: Participant;
  originRect: DOMRect;
  onClose: () => void;
}

const ANIMATION_DURATION = 250;
const SWIPE_THRESHOLD = 50;

export default function ParticipantDetails({
  participant,
  originRect,
  onClose,
}: ParticipantDetailsProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [animationState, setAnimationState] = useState<
    'opening' | 'open' | 'closing'
  >('opening');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);

  const [imageStyle, setImageStyle] = useState<React.CSSProperties>({
    top: `${originRect.top}px`,
    left: `${originRect.left}px`,
    width: `${originRect.width}px`,
    height: `${originRect.height}px`,
    borderRadius: '50%',
  });
  const [backdropOpacity, setBackdropOpacity] = useState(0);
  const [contentTransform, setContentTransform] = useState('translateY(100%)'); 
  const [contentOpacity, setContentOpacity] = useState(0);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

  useEffect(() => {
    requestAnimationFrame(() => {
      setImageStyle({
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%', 
        borderRadius: '0px',
      });
      setBackdropOpacity(1);
    });

    const contentTimer = setTimeout(() => {
      setContentOpacity(1);
      setContentTransform('translateY(0)'); 
    }, 100);

    const openTimer = setTimeout(() => {
      setAnimationState('open');
    }, ANIMATION_DURATION);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(openTimer);
    };
  }, []);

  const handleClose = () => {
    if (animationState === 'closing') return;

    setAnimationState('closing');
    setContentOpacity(0);
    setContentTransform('translateY(100%)'); 

    setTimeout(() => {
      setImageStyle({
        top: `${originRect.top}px`,
        left: `${originRect.left}px`,
        width: `${originRect.width}px`,
        height: `${originRect.height}px`,
        borderRadius: '50%',
      });
      setBackdropOpacity(0);
    }, 50);

    setTimeout(onClose, ANIMATION_DURATION + 100);
  };

  const { photos } = participant;

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsImageLoaded(false);
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsImageLoaded(false);
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const currentPhoto = photos[currentPhotoIndex];
  const imageUrl = `${BASE_URL}w_1080,h_1920,c_fill,g_face,f_auto,q_90/${currentPhoto.version}/${currentPhoto.publicId}`;

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation(); 
    setTouchStartX(e.touches[0].clientX);
    setTouchCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (touchStartX === null) return;
    setTouchCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchCurrentX === null) return;

    const diff = touchStartX - touchCurrentX;

    if (diff > SWIPE_THRESHOLD) {
      nextPhoto();
    } else if (diff < -SWIPE_THRESHOLD) {
      prevPhoto();
    }

    setTouchStartX(null);
    setTouchCurrentX(null);
  };

  return (
    <>
      <div
        className={styles.backdrop}
        style={{ opacity: backdropOpacity }}
        onClick={handleClose}
      />
      <div className={styles.detailsView}>
        <div
          className={styles.imageContainer}
          style={imageStyle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={imageUrl}
            alt={`${participant.name} ${currentPhotoIndex + 1}`}
            className={styles.participantImage}
            onLoad={() => setIsImageLoaded(true)}
            style={{ opacity: isImageLoaded ? 1 : 0 }}
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className={`${styles.navButton} ${styles.prev}`}
                aria-label="Попереднє фото"
              >
                ‹
              </button>
              <button
                onClick={nextPhoto}
                className={`${styles.navButton} ${styles.next}`}
                aria-label="Наступне фото"
              >
                ›
              </button>
              <div className={styles.dots}>
                {photos.map((_, index) => (
                  <span
                    key={index}
                    className={
                      index === currentPhotoIndex
                        ? styles.dotActive
                        : styles.dot
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <button
          className={styles.closeButton}
          onClick={handleClose}
          style={{ opacity: contentOpacity }}
          aria-label="Закрити"
        >
          &times;
        </button>

        <div
          className={styles.content}
          style={{
            opacity: contentOpacity,
            transform: contentTransform,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>
            {participant.name}, {participant.age}
          </h2>
          <a
            href={`https://www.instagram.com/${participant.instagramNickname}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instaNickname}
          >
            @{participant.instagramNickname}
          </a>
          <p className={styles.description}>{participant.description}</p>
        </div>
      </div>
    </>
  );
}