import { useState } from 'react';
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
}

export default function ParticipantRow({
  participant,
  data,
  onDataChange,
}: ParticipantRowProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const isMobile = useIsMobile();

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

  return (
    <>
      <tr className={styles.participantRow}>
        <td className={styles.participantInfo} data-label="Учасниця">
          <div className={styles.participantContent}>
            {!imageLoaded && (
              <div className={styles.imagePlaceholder}>...</div>
            )}
            <img
              src={participant.imageUrl}
              alt={participant.name}
              className={styles.participantImage}
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
            <span className={styles.participantName}>{participant.name}</span>
          </div>
        </td>
        <td data-label="Коментар">
          {isMobile ? (
            <button
              className={styles.commentTrigger}
              onClick={() => setIsCommentModalOpen(true)}
            >
              {data.comment || 'Додати коментар...'}
            </button>
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
            <div
              className={styles.mobileRating}
              data-tooltip="Натисніть та проведіть"
            >
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