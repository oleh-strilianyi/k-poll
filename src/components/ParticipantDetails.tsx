import { useState, useEffect, useRef } from 'react';
import type { Participant } from '../types';
import styles from './ParticipantDetails.module.css';
import { motion, type PanInfo } from 'framer-motion';

interface ParticipantDetailsProps {
  participant: Participant;
  onClose: () => void;
}

const ANIMATION_DURATION = 0.3;

export default function ParticipantDetails({
  participant,
  onClose,
}: ParticipantDetailsProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

  useEffect(() => {
    if (!participant.photos || !CLOUD_NAME || !BASE_URL) return;

    participant.photos.forEach((photo) => {
      const { version, publicId } = photo;
      const imageUrl = `${BASE_URL}w_1080,h_1920,c_fill,g_face,f_auto,q_90/${version}/${publicId}`;
      const img = new Image();
      img.src = imageUrl;
    });
  }, [participant, CLOUD_NAME, BASE_URL]);

  const { photos } = participant;
  const isFirstPhoto = currentPhotoIndex === 0;
  const isLastPhoto = currentPhotoIndex === photos.length - 1;

  const paginate = (newDirection: number) => {
    let newIndex = currentPhotoIndex + newDirection;
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= photos.length) {
      newIndex = photos.length - 1;
    }
    setCurrentPhotoIndex(newIndex);
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent,
    { offset, velocity }: PanInfo
  ) => {
    const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
    const swipeThreshold = containerWidth / 4;

    if (offset.x < -swipeThreshold || velocity.x < -500) {
      paginate(1);
    } else if (offset.x > swipeThreshold || velocity.x > 500) {
      paginate(-1);
    }
  };

  return (
    <>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ANIMATION_DURATION }}
        onClick={onClose}
      />
      <div className={styles.detailsView}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрити"
        >
          &times;
        </button>

        {photos.length > 1 && (
          <div className={styles.dots}>
            {photos.map((_, index) => (
              <span
                key={index}
                className={
                  index === currentPhotoIndex ? styles.dotActive : styles.dot
                }
              />
            ))}
          </div>
        )}

        <motion.div
          className={styles.imageContainer}
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: ANIMATION_DURATION,
              ease: [0.65, 0, 0.35, 1],
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: ANIMATION_DURATION,
              ease: [0.65, 0, 0.35, 1],
            },
          }}
        >
          <motion.div
            className={styles.imageTrack}
            drag="x"
            onDragEnd={handleDragEnd}
            animate={{ x: `-${currentPhotoIndex * 100}%` }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            dragElastic={0.1}
          >
            {photos.map((photo, index) => {
              const imageUrl = `${BASE_URL}w_1080,h_1920,c_fill,g_face,f_auto,q_90/${photo.version}/${photo.publicId}`;
              return (
                <motion.img
                  key={index}
                  src={imageUrl}
                  alt={`${participant.name} ${index + 1}`}
                  className={styles.participantImage}
                  draggable="false"
                />
              );
            })}
          </motion.div>
        </motion.div>

        {photos.length > 1 && (
          <>
            {!isFirstPhoto && (
              <button
                onClick={() => paginate(-1)}
                className={`${styles.navButton} ${styles.prev}`}
                aria-label="Попереднє фото"
              >
                ‹
              </button>
            )}
            {!isLastPhoto && (
              <button
                onClick={() => paginate(1)}
                className={`${styles.navButton} ${styles.next}`}
                aria-label="Наступне фото"
              >
                ›
              </button>
            )}
          </>
        )}

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, transform: 'translateY(100%)' }}
          animate={{
            opacity: 1,
            transform: 'translateY(0)',
            transition: {
              duration: ANIMATION_DURATION,
              ease: [0.65, 0, 0.35, 1],
            },
          }}
          exit={{
            opacity: 0,
            transform: 'translateY(100%)',
            transition: {
              duration: ANIMATION_DURATION,
              ease: [0.65, 0, 0.35, 1],
            },
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
        </motion.div>
      </div>
    </>
  );
}