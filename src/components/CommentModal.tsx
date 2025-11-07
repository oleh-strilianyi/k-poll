import { useState, useEffect } from 'react';
import styles from './CommentModal.module.css';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comment: string) => void;
  initialValue: string;
  participantName: string;
}

export default function CommentModal({
  isOpen,
  onClose,
  onSave,
  initialValue,
  participantName,
}: CommentModalProps) {
  const [comment, setComment] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setComment(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleSave = () => {
    onSave(comment);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{participantName}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <textarea
          className={styles.textarea}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ваш коментар..."
          rows={5}
          autoFocus
        />
        <button onClick={handleSave} className={styles.saveButton}>
          Зберегти
        </button>
      </div>
    </>
  );
}