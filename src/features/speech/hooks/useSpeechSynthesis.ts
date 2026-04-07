'use client';

import { useState, useEffect, useCallback } from 'react';
import { speechSynthesisService } from '../services/speechSynthesisService';
import type { VoiceOption, SpeechSynthesisConfig } from '../types/speech.types';

interface UseSpeechSynthesisOptions {
  voiceURI?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: VoiceOption[];
  config: SpeechSynthesisConfig;
  setConfig: (config: Partial<SpeechSynthesisConfig>) => void;
}

export function useSpeechSynthesis(
  options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn {
  const {
    voiceURI = '',
    pitch = 1,
    rate = 1,
    volume = 1,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [config, setConfigState] = useState<SpeechSynthesisConfig>({
    voiceURI,
    pitch,
    rate,
    volume,
  });

  const isSupported = speechSynthesisService.isSupported();

  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      setVoices(speechSynthesisService.getAvailableVoices());
    };

    // Initial voice load
    updateVoices();

    // Listen for voice changes
    const synth = window.speechSynthesis;
    if (synth.onvoiceschanged !== undefined) {
      synth.addEventListener('voiceschanged', updateVoices);
    }

    return () => {
      if (synth.onvoiceschanged !== undefined) {
        synth.removeEventListener('voiceschanged', updateVoices);
      }
    };
  }, [isSupported]);

  useEffect(() => {
    speechSynthesisService.setConfig(config);
  }, [config]);

  useEffect(() => {
    speechSynthesisService.setCallbacks({
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, []);

  const speak = useCallback((text: string) => {
    speechSynthesisService.speak(text);
  }, []);

  const cancel = useCallback(() => {
    speechSynthesisService.cancel();
  }, []);

  const pause = useCallback(() => {
    speechSynthesisService.pause();
  }, []);

  const resume = useCallback(() => {
    speechSynthesisService.resume();
  }, []);

  const setConfig = useCallback((newConfig: Partial<SpeechSynthesisConfig>) => {
    setConfigState((prev) => ({ ...prev, ...newConfig }));
  }, []);

  return {
    speak,
    cancel,
    pause,
    resume,
    isSpeaking,
    isSupported,
    voices,
    config,
    setConfig,
  };
}
