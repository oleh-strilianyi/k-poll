export interface Participant {
  id: number;
  name: string;
  image: {
    publicId: string; 
    version: string;  
  };
}

export interface ParticipantData {
  comment: string;
  willContinue: boolean;
  rating: number;
}

export type ParticipantsState = Record<number, ParticipantData>;