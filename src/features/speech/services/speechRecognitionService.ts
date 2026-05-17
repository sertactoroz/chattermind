import type { SpeechRecognitionConfig, SpeechRecognitionStatus } from '../types/speech.types';

type SpeechRecognitionCallbacks = {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onStatusChange?: (status: SpeechRecognitionStatus) => void;
  onError?: (error: string) => void;
};

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: { results: SpeechRecognitionResultList; resultIndex: number }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

class SpeechRecognitionServiceClass {
  private recognition: SpeechRecognitionInstance | null = null;
  private callbacks: SpeechRecognitionCallbacks = {};
  private config: SpeechRecognitionConfig = {
    continuous: false,
    interimResults: true,
    lang: 'en-US',
    maxAlternatives: 1,
  };
  private status: SpeechRecognitionStatus = 'idle';

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined') {
      const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
                  (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
      
      if (SR) {
        this.recognition = new (SR as new () => SpeechRecognitionInstance)();
        this.setupRecognition();
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.lang = this.config.lang;
    this.recognition.maxAlternatives = this.config.maxAlternatives;

    this.recognition.onstart = () => {
      this.status = 'listening';
      this.callbacks.onStatusChange?.(this.status);
    };

    this.recognition.onresult = (event: { results: SpeechRecognitionResultList; resultIndex: number }) => {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      this.callbacks.onResult?.(transcript, isFinal);
    };

    this.recognition.onerror = (event: { error: string }) => {
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
      }
      this.status = 'error';
      this.callbacks.onError?.(event.error);
      this.callbacks.onStatusChange?.(this.status);
    };

    this.recognition.onend = () => {
      if (this.status === 'listening') {
        this.status = 'idle';
        this.callbacks.onStatusChange?.(this.status);
      }
    };
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public setConfig(config: Partial<SpeechRecognitionConfig>) {
    this.config = { ...this.config, ...config };
    if (this.recognition) {
      this.setupRecognition();
    }
  }

  public setCallbacks(callbacks: SpeechRecognitionCallbacks) {
    this.callbacks = callbacks;
  }

  public start() {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }
    if (this.status === 'listening') {
      this.stop();
    }
    this.recognition.start();
  }

  public stop() {
    if (this.recognition && this.status === 'listening') {
      this.recognition.stop();
    }
  }

  public getStatus(): SpeechRecognitionStatus {
    return this.status;
  }
}

export const speechRecognitionService = new SpeechRecognitionServiceClass();
