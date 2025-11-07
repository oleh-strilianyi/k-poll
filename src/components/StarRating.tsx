import { FullStarIcon, EmptyStarIcon } from './StarIcons.tsx';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export default function StarRating({ rating, onRatingChange }: StarRatingProps) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className="star-button"
          onClick={() => onRatingChange(star)}
          aria-label={`Rate ${star} stars`}
        >
          <span className={star <= rating ? 'star-filled' : 'star-empty'}>
            {star <= rating ? <FullStarIcon /> : <EmptyStarIcon />}
          </span>
        </button>
      ))}
    </div>
  );
}