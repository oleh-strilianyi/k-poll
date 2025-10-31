import { useLocalStorage } from './hooks/useLocalStorage';
import type { ParticipantsState, ParticipantData } from './types';
import { participants } from './data/participants';
import Header from './components/Header';
import ParticipantRow from './components/ParticipantRow';
import './App.css';

// Initialize default data for all participants
const getInitialData = (): ParticipantsState => {
  const initial: ParticipantsState = {};
  participants.forEach(participant => {
    initial[participant.id] = {
      comment: '',
      willContinue: true, // Default to rose
      rating: 0, // Default to no rating
    };
  });
  return initial;
};

function App() {
  const [participantsData, setParticipantsData] = useLocalStorage<ParticipantsState>(
    'kholostyak-poll-data',
    getInitialData()
  );

  const handleDataChange = (id: number, data: ParticipantData) => {
    setParticipantsData(prev => ({
      ...prev,
      [id]: data,
    }));
  };

  return (
    <div className="app">
      <Header />
      <div className="table-container">
        <table className="participants-table">
          <thead>
            <tr>
              <th>Учасниця</th>
              <th>Коментар</th>
              <th>Прогноз</th>
              <th>Рейтинг</th>
            </tr>
          </thead>
          <tbody>
            {participants.map(participant => (
              <ParticipantRow
                key={participant.id}
                participant={participant}
                data={participantsData[participant.id] || { comment: '', willContinue: true, rating: 0 }}
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