export interface PrankState {
  petition: string;
  question: string;
  secretAnswer: string;
  isRecordingSecret: boolean;
}

export interface AnswerResult {
  text: string;
  isRevealed: boolean;
  type: 'secret' | 'ai' | 'fallback';
}

export enum GameState {
  IDLE = 'IDLE',
  ASKING = 'ASKING',
  ANSWERING = 'ANSWERING',
}