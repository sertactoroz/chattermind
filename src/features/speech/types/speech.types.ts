export interface SpeechRecognitionConfig {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
}

export interface SpeechSynthesisConfig {
  voiceURI: string;
  pitch: number;
  rate: number;
  volume: number;
}

export interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  localService: boolean;
}

export type SpeechRecognitionStatus = 'idle' | 'listening' | 'processing' | 'error';
