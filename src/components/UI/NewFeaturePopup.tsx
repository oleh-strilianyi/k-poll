import { motion } from 'framer-motion';
import styles from './NewFeaturePopup.module.css';

interface NewFeaturePopupProps {
  onClose: () => void;
}

export default function NewFeaturePopup({ onClose }: NewFeaturePopupProps) {
  return (
    <motion.div
      className={styles.popupContainer}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      layout
    >
      <p className={styles.popupText}>
        Новий функціонал! Тепер можна натискати на фотографії учасниць,
        щоб дізнатись про них більше.
      </p>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Закрити"
      >
        &times;
      </button>
    </motion.div>
  );
}