import { useState } from 'react';
import type { Participant, ParticipantData } from '../types';
import StarRating from './StarRating';

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
      <td className="participant-info">
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
      <td>
        <textarea
          className="comment-input"
          value={data.comment}
          onChange={handleCommentChange}
          placeholder="Додати коментар..."
          rows={2}
        />
      </td>
      <td className="prediction-cell">
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
      <td className="rating-cell">
        <StarRating rating={data.rating} onRatingChange={handleRatingChange} />
      </td>
    </tr>
  );
}