export interface ParticipantPhoto {
  publicId: string;
  version: string;
}

export interface Participant {
  id: number;
  name: string;
  age: number;
  description: string;
  instagramNickname: string; 
  photos: ParticipantPhoto[];
}

export interface ParticipantData {
  comment: string;
  willContinue: boolean;
  rating: number;
}

export type ParticipantsState = Record<number, ParticipantData>;