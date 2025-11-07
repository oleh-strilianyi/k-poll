import styles from './ClearDataModal.module.css';

interface ClearDataModalProps {
  isOpen: boolean;
  onClear: () => void;
  onKeep: () => void;
}

export default function ClearDataModal({
  isOpen,
  onClear,
  onKeep,
}: ClearDataModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles.modal}>
        <h2>Новий тиждень!</h2>
        <p>
          Чи хочете ви повністю видалити свої коментарі, прогнози та рейтинги з
          попереднього випуску? Ця дія є незворотною.
        </p>
        <div className={styles.buttonGroup}>
          <button onClick={onKeep} className={styles.keepButton}>
            Ні, залишити
          </button>
          <button onClick={onClear} className={styles.clearButton}>
            Так, видалити
          </button>
        </div>
      </div>
    </>
  );
}