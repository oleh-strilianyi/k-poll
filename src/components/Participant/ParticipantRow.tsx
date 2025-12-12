import { useState, useEffect } from 'react';
import type { Participant, ParticipantData } from '../../types';
import StarRating from './../Rating/StarRating';
import CommentModal from './../Modals/CommentModal';
import styles from './ParticipantRow.module.css';

interface ParticipantRowProps {
  participant: Participant;
  data: ParticipantData;
  onDataChange: (data: ParticipantData) => void;
  onAvatarClick: (participant: Participant) => void;
}

export default function ParticipantRow({
  participant,
  data,
  onDataChange,
  onAvatarClick,
}: ParticipantRowProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

  const { publicId, version } = participant.photos[0];
  const transforms = 'w_250,h_250,c_fill,g_face,f_auto,q_90';
  const dynamicImageUrl = `${BASE_URL}${transforms}/${version}/${publicId}`;

  useEffect(() => {
    const handlePopState = () => {
      setIsCommentModalOpen(false);
    };

    const stateId = `commentModal-${participant.id}`;

    if (isCommentModalOpen) {
      window.history.pushState({ modal: stateId }, '');
      window.addEventListener('popstate', handlePopState);
    } else {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state?.modal === stateId) {
        window.history.back();
      }
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isCommentModalOpen, participant.id]);

  const toggleContinue = () => {
    onDataChange({ ...data, willContinue: !data.willContinue });
  };

  const handleSaveComment = (comment: string) => {
    onDataChange({ ...data, comment });
  };

  const handleRatingChange = (rating: number) => {
    onDataChange({ ...data, rating });
  };

  const handleAvatarClick = () => {
    onAvatarClick(participant);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.sectionPhoto}>
          {!imageLoaded && <div className={styles.imagePlaceholder}>...</div>}
          <img
            src={dynamicImageUrl}
            alt={participant.name}
            className={styles.participantImage}
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onClick={handleAvatarClick}
          />
        </div>

        <div className={styles.sectionContent}>
          <div className={styles.rowTop}>
            <span className={styles.nameText}>
              {participant.name}, {participant.age}
            </span>
          </div>

          <div className={styles.rowMiddle}>
            <div 
              className={styles.commentBox}
              onClick={() => setIsCommentModalOpen(true)}
            >
              {data.comment ? (
                <p className={styles.commentText}>{data.comment}</p>
              ) : (
                <span className={styles.commentPlaceholder}>Додати коментар...</span>
              )}
            </div>
          </div>

          <div className={styles.rowBottom}>
            <StarRating
              rating={data.rating}
              onRatingChange={handleRatingChange}
            />
          </div>
        </div>

        <div className={styles.roseContainer}>
          <button
            className={`${styles.roseButton} ${data.willContinue ? styles.roseActive : styles.roseInactive}`}
            onClick={toggleContinue}
            aria-label={data.willContinue ? 'Забрати розу' : 'Дати розу'}
          >
            <span className={styles.roseIcon}>🌹</span>
          </button>
        </div>
      </div>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        onSave={handleSaveComment}
        initialValue={data.comment}
        participantName={participant.name}
      />
    </>
  );
}