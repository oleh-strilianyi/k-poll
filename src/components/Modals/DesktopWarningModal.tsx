import { useState } from 'react';
import styles from './DesktopWarningModal.module.css';

type ModalStep = 'initial' | 'confirm';

export default function DesktopWarningModal() {
  const [step, setStep] = useState<ModalStep>('initial');

  const content = {
    initial: {
      title: 'Попередження',
      text: 'Мобільна версія – єдиний підтримуваний варіант. Продовжити на десктопі?',
      yesText: 'Так, я мазохіст',
      noText: 'Ні, я нормальний',
    },
    confirm: {
      title: 'Серйозно?',
      text: 'Точно? Воно ж жахливе.',
      yesText: 'Так, 100%',
      noText: 'Окей, ні',
    },
  };

  const currentContent = content[step];

  const handleYes = () => {
    setStep(step === 'initial' ? 'confirm' : 'initial');
  };

  const handleNo = () => {
    setStep(step === 'initial' ? 'confirm' : 'initial');
  };

  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles.modal}>
        <h2>{currentContent.title}</h2>
        <p>{currentContent.text}</p>
        <div className={styles.buttonGroup}>
          <button onClick={handleYes} className={styles.button}>
            {currentContent.yesText}
          </button>
          <button onClick={handleNo} className={styles.button}>
            {currentContent.noText}
          </button>
        </div>
      </div>
    </>
  );
}