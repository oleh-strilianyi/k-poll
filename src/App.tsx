import { useLocalStorage } from './hooks/useLocalStorage';
import type { ParticipantsState, ParticipantData } from './types';
import { participants } from './data/participants';
import Header from './components/Header';
import ParticipantRow from './components/ParticipantRow';
import styles from './App.module.css';

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
    useLocalStorage<ParticipantsState>('kholostyak-poll-data', getInitialData());

  const handleDataChange = (id: number, data: ParticipantData) => {
    setParticipantsData((prev) => ({
      ...prev,
      [id]: data,
    }));
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
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;