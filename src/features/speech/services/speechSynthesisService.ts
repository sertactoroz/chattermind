import type { SpeechSynthesisConfig, VoiceOption } from '../types/speech.types';

type SpeechSynthesisCallbacks = {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
};

class SpeechSynthesisServiceClass {
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private callbacks: SpeechSynthesisCallbacks = {};
  private config: SpeechSynthesisConfig = {
    voiceURI: '',
    pitch: 1,
    rate: 1,
    volume: 1,
  };
  private isSpeaking = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      // Get voices when they become available
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => {
          // Voices are now available
        };
      }
    }
  }

  private getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.getVoices() || [];
  }

  private findVoice(voiceURI: string): SpeechSynthesisVoice | undefined {
    const voices = this.getVoices();
    if (voiceURI) {
      return voices.find(voice => voice.voiceURI === voiceURI);
    }
    // Try to find a default English voice
    return voices.find(voice => voice.lang.startsWith('en')) || voices[0];
  }

  public isSupported(): boolean {
    return !!this.synthesis;
  }

  public getAvailableVoices(): VoiceOption[] {
    return this.getVoices().map(voice => ({
      name: voice.name,
      lang: voice.lang,
      voiceURI: voice.voiceURI,
    }));
  }

  public setConfig(config: Partial<SpeechSynthesisConfig>) {
    this.config = { ...this.config, ...config };
  }

  public setCallbacks(callbacks: SpeechSynthesisCallbacks) {
    this.callbacks = callbacks;
  }

  public speak(text: string) {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not supported');
    }

    // Cancel any ongoing speech
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    const selectedVoice = this.findVoice(this.config.voiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.pitch = this.config.pitch;
    utterance.rate = this.config.rate;
    utterance.volume = this.config.volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.currentUtterance = utterance;
      this.callbacks.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.callbacks.onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.callbacks.onError?.(event.error);
    };

    this.synthesis.speak(utterance);
  }

  public pause() {
    if (this.synthesis && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  public resume() {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  public cancel() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speechSynthesisService = new SpeechSynthesisServiceClass();
