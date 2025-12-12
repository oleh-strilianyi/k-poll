import { FullStarIcon, EmptyStarIcon } from './StarIcons.tsx';
import styles from './StarRating.module.css';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export default function StarRating({ rating, onRatingChange }: StarRatingProps) {
  return (
    <div className={styles.container}>
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={styles.starButton}
            onClick={(e) => {
              e.stopPropagation();
              onRatingChange(star);
            }}
            aria-label={`Оцінити на ${star} зірок`}
          >
            <span className={star <= rating ? styles.starFilled : styles.starEmpty}>
              {star <= rating ? <FullStarIcon /> : <EmptyStarIcon />}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}