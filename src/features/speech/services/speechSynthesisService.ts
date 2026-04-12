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
  private _isSpeaking = false;
  private _voicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
    }
  }

  async ensureVoices(): Promise<SpeechSynthesisVoice[]> {
    const voices = this.synthesis?.getVoices() || [];
    if (voices.length > 0) {
      this._voicesLoaded = true;
      return voices;
    }
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve([]);
        return;
      }
      const onVoicesChanged = () => {
        const v = this.synthesis!.getVoices();
        this._voicesLoaded = true;
        this.synthesis!.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(v);
      };
      this.synthesis.addEventListener('voiceschanged', onVoicesChanged);
      setTimeout(() => {
        this.synthesis?.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(this.synthesis?.getVoices() || []);
      }, 3000);
    });
  }

  private getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.getVoices() || [];
  }

  private findVoice(voiceURI: string, lang?: string): SpeechSynthesisVoice | undefined {
    const voices = this.getVoices();

    if (voiceURI) {
      const exact = voices.find(v => v.voiceURI === voiceURI);
      if (exact) return exact;
    }

    if (lang) {
      const prefix = lang.split('-')[0];
      const langVoices = voices.filter(v => v.lang.startsWith(prefix));

      if (langVoices.length > 0) {
        const male = langVoices.find(v =>
          /male|erkek|david|markus|hans|thomas|james|daniel|alex|george|john|andreas|peter|murat|ahmet|emre|can/i.test(v.name)
        );
        if (male) return male;

        const remote = langVoices.find(v => !v.localService);
        if (remote) return remote;

        return langVoices[0];
      }
    }

    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  public isSupported(): boolean {
    return !!this.synthesis;
  }

  public getAvailableVoices(lang?: string): VoiceOption[] {
    const allVoices = this.getVoices();
    if (!lang) {
      return allVoices.map(voice => ({
        name: voice.name,
        lang: voice.lang,
        voiceURI: voice.voiceURI,
        localService: voice.localService,
      }));
    }
    const prefix = lang.split('-')[0];
    return allVoices
      .filter(voice => voice.lang.startsWith(prefix))
      .map(voice => ({
        name: voice.name,
        lang: voice.lang,
        voiceURI: voice.voiceURI,
        localService: voice.localService,
      }));
  }

  public setConfig(config: Partial<SpeechSynthesisConfig>) {
    this.config = { ...this.config, ...config };
  }

  public setCallbacks(callbacks: SpeechSynthesisCallbacks) {
    this.callbacks = callbacks;
  }

  public async speak(text: string, lang?: string) {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not supported');
    }

    await this.ensureVoices();

    const utterance = new SpeechSynthesisUtterance(text);

    if (lang) {
      utterance.lang = lang;
    }

    const selectedVoice = this.findVoice(this.config.voiceURI, lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.pitch = this.config.pitch;
    utterance.rate = this.config.rate;
    utterance.volume = this.config.volume;

    utterance.onstart = () => {
      this._isSpeaking = true;
      this.currentUtterance = utterance;
      this.callbacks.onStart?.();
    };

    utterance.onend = () => {
      this._isSpeaking = false;
      this.currentUtterance = null;
      this.callbacks.onEnd?.();
    };

    utterance.onerror = (event) => {
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('[TTS] Error:', event.error);
      }
      this._isSpeaking = false;
      this.currentUtterance = null;
      this.callbacks.onError?.(event.error);
    };

    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }

    if (this.synthesis.paused) {
      this.synthesis.resume();
    }

    try {
      this.synthesis.speak(utterance);
    } catch (e) {
      console.error('[TTS] speak() failed, retrying...', e);
      this.synthesis.resume();
      setTimeout(() => {
        try {
          this.synthesis?.speak(utterance);
        } catch (e2) {
          console.error('[TTS] retry failed:', e2);
        }
      }, 200);
    }
  }

  public stop() {
    if (this.synthesis) {
      if (this.synthesis.speaking) {
        this.synthesis.cancel();
      }
      this._isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public get isSpeaking(): boolean {
    return this._isSpeaking;
  }
}

export const speechSynthesisService = new SpeechSynthesisServiceClass();
