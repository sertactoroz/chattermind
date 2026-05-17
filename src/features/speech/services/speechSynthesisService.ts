import type { SpeechSynthesisConfig, VoiceOption } from '../types/speech.types';

type SpeechSynthesisCallbacks = {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const VOICE_MAP: Record<string, { id: string; name: string }[]> = {
  tr: [
    { id: 'tr-TR-Standard-B', name: 'Can' },
    { id: 'tr-TR-Standard-A', name: 'Zeynep' },
  ],
  de: [
    { id: 'de-DE-Standard-B', name: 'Alexander' },
    { id: 'de-DE-Standard-A', name: 'Sophie' },
  ],
  en: [
    { id: 'en-US-Standard-D', name: 'Alex' },
    { id: 'en-US-Standard-A', name: 'Emma' },
  ],
};

class SpeechSynthesisServiceClass {
  private synthesis: SpeechSynthesis | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private callbacks: SpeechSynthesisCallbacks = {};
  private config: SpeechSynthesisConfig = {
    voiceURI: '',
    pitch: 1,
    rate: 1,
    volume: 1,
  };
  private _isSpeaking = false;
  private _useElevenLabs = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return true;
  }

  public getAvailableVoices(lang?: string): VoiceOption[] {
    if (!lang) {
      return Object.values(VOICE_MAP).flat().map(v => ({
        name: v.name,
        lang: '',
        voiceURI: v.id,
        localService: false,
      }));
    }
    const prefix = lang.split('-')[0];
    const voices = VOICE_MAP[prefix] || VOICE_MAP['en'];
    return voices.map(v => ({
      name: v.name,
      lang: prefix,
      voiceURI: v.id,
      localService: false,
    }));
  }

  public setConfig(config: Partial<SpeechSynthesisConfig>) {
    this.config = { ...this.config, ...config };
  }

  public setCallbacks(callbacks: SpeechSynthesisCallbacks) {
    this.callbacks = callbacks;
  }

  public async speak(text: string, lang?: string) {
    this.stop();

    try {
      const prefix = lang?.split('-')[0] || 'en';

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const response = await fetch(`${API_BASE}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text, lang: prefix }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.volume = this.config.volume;

      this.currentAudio = audio;
      this._isSpeaking = true;
      this.callbacks.onStart?.();

      audio.onended = () => {
        this._isSpeaking = false;
        this.currentAudio = null;
        URL.revokeObjectURL(audioUrl);
        this.callbacks.onEnd?.();
      };

      audio.onerror = () => {
        this._isSpeaking = false;
        this.currentAudio = null;
        URL.revokeObjectURL(audioUrl);
        this.callbacks.onError?.('Audio playback failed');
      };

      await audio.play();
    } catch (e) {
      console.error('[ElevenLabs TTS] Error, falling back to browser TTS:', e);
      this._useElevenLabs = false;
      await this.browserSpeak(text, lang);
    }
  }

  private async browserSpeak(text: string, lang?: string) {
    if (!this.synthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (lang) utterance.lang = lang;

    const voices = this.synthesis.getVoices();
    if (voices.length > 0) {
      const prefix = lang?.split('-')[0] || 'en';
      const match = voices.find(v => v.lang.startsWith(prefix) && !v.localService);
      if (match) utterance.voice = match;
    }

    utterance.pitch = this.config.pitch;
    utterance.rate = this.config.rate;
    utterance.volume = this.config.volume;

    utterance.onstart = () => {
      this._isSpeaking = true;
      this.callbacks.onStart?.();
    };
    utterance.onend = () => {
      this._isSpeaking = false;
      this.callbacks.onEnd?.();
    };
    utterance.onerror = (event) => {
      this._isSpeaking = false;
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        this.callbacks.onError?.(event.error);
      }
    };

    if (this.synthesis.speaking) this.synthesis.cancel();
    this.synthesis.speak(utterance);
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (this.synthesis?.speaking) {
      this.synthesis.cancel();
    }
    this._isSpeaking = false;
  }

  public get isSpeaking(): boolean {
    return this._isSpeaking;
  }
}

export const speechSynthesisService = new SpeechSynthesisServiceClass();
