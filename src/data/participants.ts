import type { Participant } from '../types';

// Ця змінна автоматично стане '/k-poll/' на GitHub Pages
// і '/' під час локальної розробки (npm run dev)
const BASE_URL = import.meta.env.BASE_URL;

export const participants: Participant[] = [
  { id: 1, name: 'Яна учілка', imageUrl: `${BASE_URL}images/1.jpg` },
  // { id: 2, name: 'Софія турнікет', imageUrl: `${BASE_URL}images/2.jpg` },
  { id: 3, name: 'Настя новая', imageUrl: `${BASE_URL}images/3.jpg` },
  // { id: 4, name: 'Віка вставна челюсть', imageUrl: `${BASE_URL}images/4.jpg` },
  { id: 5, name: 'Надін у апарата', imageUrl: `${BASE_URL}images/5.jpg` },
  { id: 6, name: 'Оксана косметолог', imageUrl: `${BASE_URL}images/6.jpg` },
  { id: 7, name: 'Юля письмо пізніше', imageUrl: `${BASE_URL}images/7.jpg` },
  { id: 8, name: 'Надя табуретка', imageUrl: `${BASE_URL}images/8.jpg` },
  { id: 9, name: 'Даша весільне агенство', imageUrl: `${BASE_URL}images/9.jpg` },
  { id: 10, name: 'Валерія наєздніца', imageUrl: `${BASE_URL}images/10.jpg` },
  // { id: 11, name: 'Ніколетта тату', imageUrl: `${BASE_URL}images/11.jpg` },
  { id: 12, name: 'Іра купальники', imageUrl: `${BASE_URL}images/12.jpg` },
  { id: 13, name: 'Ольга фітнес тренер', imageUrl: `${BASE_URL}images/13.jpg` },
  { id: 14, name: 'Юля фешн фотограф', imageUrl: `${BASE_URL}images/14.jpg` },
  { id: 15, name: 'Іра шапка з аврори', imageUrl: `${BASE_URL}images/15.jpg` },
  { id: 16, name: 'Діана Зотова', imageUrl: `${BASE_URL}images/16.jpg` },
];