import { useState } from 'react';
import type { Participant, ParticipantData } from '../types';
import StarRating from './StarRating';
import MobileRating from './MobileRating';

interface ParticipantRowProps {
  participant: Participant;
  data: ParticipantData;
  onDataChange: (data: ParticipantData) => void;
}

export default function ParticipantRow({ participant, data, onDataChange }: ParticipantRowProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleContinue = () => {
    onDataChange({ ...data, willContinue: !data.willContinue });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDataChange({ ...data, comment: e.target.value });
  };

  const handleRatingChange = (rating: number) => {
    onDataChange({ ...data, rating });
  };

  return (
    <tr className="participant-row">
      <td className="participant-info" data-label="Учасниця">
        <div className="participant-content">
          {!imageLoaded && <div className="image-placeholder">Завантаження...</div>}
          <img
            src={participant.imageUrl}
            alt={participant.name}
            className="participant-image"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
          <span className="participant-name">{participant.name}</span>
        </div>
      </td>
      <td data-label="Коментар">
        <textarea
          className="comment-input"
          value={data.comment}
          onChange={handleCommentChange}
          placeholder="Додати коментар..."
          rows={2}
        />
      </td>
      <td className="prediction-cell" data-label="Прогноз">
        <button
          className="prediction-button"
          onClick={toggleContinue}
          aria-label={data.willContinue ? 'Отримає троянду' : 'Не отримає троянду'}
        >
          <span className="prediction-emoji">
            {data.willContinue ? '🌹' : '💔'}
          </span>
        </button>
      </td>
      <td className="rating-cell" data-label="Рейтинг">
        <div className="rating-wrapper">
          <div className="desktop-rating">
            <StarRating rating={data.rating} onRatingChange={handleRatingChange} />
          </div>
          <div className="mobile-rating">
            <MobileRating rating={data.rating} onRatingChange={handleRatingChange} />
          </div>
        </div>
      </td>
    </tr>
  );
}