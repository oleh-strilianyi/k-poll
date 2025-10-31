export interface Participant {
  id: number;
  name: string;
  imageUrl: string;
}

export interface ParticipantData {
  comment: string;
  willContinue: boolean; // true = rose, false = broken heart
  rating: number; // 0-5
}

export type ParticipantsState = Record<number, ParticipantData>;