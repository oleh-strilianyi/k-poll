import { useState, useEffect, useRef } from 'react';
import type { Participant } from '../types';
import styles from './ParticipantDetails.module.css';
import { motion, type PanInfo, useAnimation } from 'framer-motion';
import ParticipantImage from './ParticipantImage';

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
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    if (!participant.photos || !CLOUD_NAME || !BASE_URL) {
      return () => {
        window.removeEventListener('resize', updateWidth);
      };
    }

    const preloadImagesSequentially = async () => {
      for (const photo of participant.photos) {
        await new Promise((resolve) => {
          const { version, publicId } = photo;
          const imageUrl = `${BASE_URL}w_1080,h_1920,c_fill,g_face,f_auto,q_90/${version}/${publicId}`;
          const img = new Image();
          img.src = imageUrl;
          img.onload = resolve;
          img.onerror = resolve;
        });
      }
    };

    preloadImagesSequentially();

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, [participant, CLOUD_NAME, BASE_URL]);

  useEffect(() => {
    controls.start({
      x: `-${currentPhotoIndex * 100}%`,
      transition: {
        type: 'tween',
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    });
  }, [currentPhotoIndex, controls]);

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
    const swipeThreshold = containerWidth / 4;

    if (offset.x < -swipeThreshold || velocity.x < -500) {
      paginate(1);
    } else if (offset.x > swipeThreshold || velocity.x > 500) {
      paginate(-1);
    } else {
      controls.start({
        x: `-${currentPhotoIndex * 100}%`,
        transition: {
          type: 'tween',
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        },
      });
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
            animate={controls}
            dragElastic={0.1}
            dragConstraints={{
              right: 0,
              left: -containerWidth * (photos.length - 1),
            }}
          >
            {photos.map((photo, index) => {
              return (
                <ParticipantImage
                  key={index}
                  photo={photo}
                  baseUrl={BASE_URL}
                  participantName={participant.name}
                  className={styles.participantImage}
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