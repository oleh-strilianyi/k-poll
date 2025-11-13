import { useState, useRef } from 'react';
import type { Participant, ParticipantData } from '../types';
import StarRating from './StarRating';
import MobileRating from './MobileRating';
import CommentModal from './CommentModal';
import { useIsMobile } from '../hooks/useIsMobile';
import styles from './ParticipantRow.module.css';

interface ParticipantRowProps {
  participant: Participant;
  data: ParticipantData;
  onDataChange: (data: ParticipantData) => void;
  onAvatarClick: (participant: Participant, rect: DOMRect) => void;
}

export default function ParticipantRow({
  participant,
  data,
  onDataChange,
  onAvatarClick,
}: ParticipantRowProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const avatarRef = useRef<HTMLImageElement>(null);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

  const { publicId, version } = participant.photos[0];

  const desktopTransforms = 'w_160,h_160,c_thumb,g_face,f_auto,q_85';
  const mobileTransforms = 'w_60,h_60,c_thumb,g_face,f_auto,q_90';
  const transforms = isMobile ? mobileTransforms : desktopTransforms;

  const dynamicImageUrl = `${BASE_URL}${transforms}/${version}/${publicId}`;

  const toggleContinue = () => {
    onDataChange({ ...data, willContinue: !data.willContinue });
  };

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onDataChange({ ...data, comment: e.target.value });
  };

  const handleSaveComment = (comment: string) => {
    onDataChange({ ...data, comment });
  };

  const handleRatingChange = (rating: number) => {
    onDataChange({ ...data, rating });
  };

  const handleAvatarClick = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      onAvatarClick(participant, rect);
    }
  };

  return (
    <>
      <tr className={styles.participantRow}>
        <td className={styles.participantInfo} data-label="Учасниця">
          <div className={styles.participantContent}>
            {!imageLoaded && (
              <div className={styles.imagePlaceholder}>...</div>
            )}
            <img
              ref={avatarRef}
              src={dynamicImageUrl}
              alt={participant.name}
              className={styles.participantImage}
              onLoad={() => setImageLoaded(true)}
              style={{
                display: imageLoaded ? 'block' : 'none',
                cursor: 'pointer',
              }}
              onClick={handleAvatarClick}
            />
            <span className={styles.participantName}>{participant.name}</span>
          </div>
        </td>
        <td data-label="Коментар">
          {isMobile ? (
            <div
              className={styles.commentTrigger}
              onClick={() => setIsCommentModalOpen(true)}
              role="button"
              tabIndex={0}
            >
              {data.comment || 'Додати коментар...'}
            </div>
          ) : (
            <textarea
              className={styles.commentInput}
              value={data.comment}
              onChange={handleCommentChange}
              placeholder="Додати коментар..."
              rows={2}
            />
          )}
        </td>
        <td className={styles.predictionCell} data-label="Прогноз">
          <button
            className={styles.predictionButton}
            onClick={toggleContinue}
            aria-label={
              data.willContinue ? 'Отримає троянду' : 'Не отримає троянду'
            }
          >
            <span className={styles.predictionEmoji}>
              {data.willContinue ? '🌹' : '💔'}
            </span>
          </button>
        </td>
        <td className={styles.ratingCell} data-label="Рейтинг">
          <div className={styles.ratingWrapper}>
            <div className={styles.desktopRating}>
              <StarRating
                rating={data.rating}
                onRatingChange={handleRatingChange}
              />
            </div>
            <div className={styles.mobileRating}>
              <MobileRating
                rating={data.rating}
                onRatingChange={handleRatingChange}
              />
            </div>
          </div>
        </td>
      </tr>
      {isMobile && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          onSave={handleSaveComment}
          initialValue={data.comment}
          participantName={participant.name}
        />
      )}
    </>
  );
}