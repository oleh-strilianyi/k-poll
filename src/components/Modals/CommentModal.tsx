import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setComment(initialValue);
      textareaRef.current?.focus();
    }
  }, [isOpen, initialValue]);

  const handleClose = () => {
    textareaRef.current?.blur();
    onClose();
  };

  const handleSave = () => {
    textareaRef.current?.blur();
    onSave(comment);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <>
      <div
        className={styles.backdrop}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{participantName}</h3>
          <button onClick={handleClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ваш коментар..."
          rows={5}
        />
        <button onClick={handleSave} className={styles.saveButton}>
          Зберегти
        </button>
      </div>
    </>,
    document.body
  );
}