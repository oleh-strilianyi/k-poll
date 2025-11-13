import { useState } from 'react';
import type { Participant } from '../types';
import styles from './ParticipantDetails.module.css';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';

interface ParticipantDetailsProps {
  participant: Participant;
  onClose: () => void;
}

const ANIMATION_DURATION = 0.3;
const SWIPE_THRESHOLD = 10000;

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export default function ParticipantDetails({
  participant,
  onClose,
}: ParticipantDetailsProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

  const { photos } = participant;
  const isFirstPhoto = currentPhotoIndex === 0;
  const isLastPhoto = currentPhotoIndex === photos.length - 1;

  const paginate = (newDirection: number) => {
    if (newDirection > 0 && !isLastPhoto) {
      setSwipeDirection(1);
      setCurrentPhotoIndex(currentPhotoIndex + 1);
      setIsImageLoaded(false);
    } else if (newDirection < 0 && !isFirstPhoto) {
      setSwipeDirection(-1);
      setCurrentPhotoIndex(currentPhotoIndex - 1);
      setIsImageLoaded(false);
    }
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipePower = Math.abs(offset.x) * velocity.x;

    if (swipePower < -SWIPE_THRESHOLD) {
      paginate(1);
    } else if (swipePower > SWIPE_THRESHOLD) {
      paginate(-1);
    }
  };

  const currentPhoto = photos[currentPhotoIndex];
  const imageUrl = `${BASE_URL}w_1080,h_1920,c_fill,g_face,f_auto,q_90/${currentPhoto.version}/${currentPhoto.publicId}`;

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
          <AnimatePresence initial={false} custom={swipeDirection}>
            <motion.img
              key={currentPhotoIndex}
              src={imageUrl}
              alt={`${participant.name} ${currentPhotoIndex + 1}`}
              className={styles.participantImage}
              custom={swipeDirection}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              onLoad={() => setIsImageLoaded(true)}
              style={{ opacity: isImageLoaded ? 1 : 0 }}
            />
          </AnimatePresence>

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
        </motion.div>

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