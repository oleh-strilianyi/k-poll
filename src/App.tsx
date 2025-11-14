import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { ParticipantsState, ParticipantData, Participant } from './types';
import { participants } from './data/participants';
import Header from './components/Header';
import ParticipantRow from './components/ParticipantRow';
import ClearDataModal from './components/ClearDataModal';
import ParticipantDetails from './components/ParticipantDetails';
import NewFeaturePopup from './components/NewFeaturePopup';
import styles from './App.module.css';
import { AnimatePresence } from 'framer-motion';

const CURRENT_WEEK_ID = 4;
const WEEK_ID_KEY = 'kholostyak-poll-week-id';
const DATA_KEY = 'kholostyak-poll-data';
const FEATURE_POPUP_KEY = 'k-poll-feature-discovery-seen';

const getInitialData = (): ParticipantsState => {
  const initial: ParticipantsState = {};
  participants.forEach((participant) => {
    initial[participant.id] = {
      comment: '',
      willContinue: true,
      rating: 0,
    };
  });
  return initial;
};

function App() {
  const [participantsData, setParticipantsData] =
    useLocalStorage<ParticipantsState>(DATA_KEY, getInitialData());

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);

  const [hasSeenPopup, setHasSeenPopup] = useLocalStorage(
    FEATURE_POPUP_KEY,
    false
  );

  useEffect(() => {
    const checkWeek = () => {
      const storedWeekId = window.localStorage.getItem(WEEK_ID_KEY);
      const storedData = window.localStorage.getItem(DATA_KEY);

      if (storedWeekId !== JSON.stringify(CURRENT_WEEK_ID) && storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          const initialData = getInitialData();

          if (JSON.stringify(parsedData) !== JSON.stringify(initialData)) {
            setIsClearModalOpen(true);
          } else {
            window.localStorage.setItem(
              WEEK_ID_KEY,
              JSON.stringify(CURRENT_WEEK_ID)
            );
          }
        } catch (e) {
          setIsClearModalOpen(true);
        }
      } else if (!storedWeekId) {
        window.localStorage.setItem(
          WEEK_ID_KEY,
          JSON.stringify(CURRENT_WEEK_ID)
        );
      }
    };

    checkWeek();
  }, []);

  const handleClearData = () => {
    setParticipantsData(getInitialData());
    window.localStorage.setItem(WEEK_ID_KEY, JSON.stringify(CURRENT_WEEK_ID));
    setIsClearModalOpen(false);
  };

  const handleKeepData = () => {
    window.localStorage.setItem(WEEK_ID_KEY, JSON.stringify(CURRENT_WEEK_ID));
    setIsClearModalOpen(false);
  };

  const handleDataChange = (id: number, data: ParticipantData) => {
    setParticipantsData((prev) => ({
      ...prev,
      [id]: data,
    }));
  };

  const handleAvatarClick = (participant: Participant) => {
    setSelectedParticipant(participant);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseDetails = () => {
    setSelectedParticipant(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.tableContainer}>
        <table className={styles.participantsTable}>
          <thead>
            <tr>
              <th style={{ width: '176px' }}>Учасниця</th>
              <th>Коментар</th>
              <th style={{ width: '100px' }}>Прогноз</th>
              <th style={{ width: '120px' }}>Рейтинг</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <ParticipantRow
                key={participant.id}
                participant={participant}
                data={
                  participantsData[participant.id] || {
                    comment: '',
                    willContinue: true,
                    rating: 0,
                  }
                }
                onDataChange={(data) => handleDataChange(participant.id, data)}
                onAvatarClick={handleAvatarClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      <ClearDataModal
        isOpen={isClearModalOpen}
        onClear={handleClearData}
        onKeep={handleKeepData}
      />

      <AnimatePresence>
        {selectedParticipant && (
          <ParticipantDetails
            participant={selectedParticipant}
            onClose={handleCloseDetails}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!hasSeenPopup && (
          <NewFeaturePopup onClose={() => setHasSeenPopup(true)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;