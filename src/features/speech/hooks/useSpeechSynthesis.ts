'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { speechSynthesisService } from '../services/speechSynthesisService';
import type { VoiceOption, SpeechSynthesisConfig } from '../types/speech.types';

interface UseSpeechSynthesisOptions {
  voiceURI?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  lang?: string;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
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
    lang,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [allVoices, setAllVoices] = useState<VoiceOption[]>([]);
  const [config, setConfigState] = useState<SpeechSynthesisConfig>({
    voiceURI,
    pitch,
    rate,
    volume,
  });

  const isSupported = speechSynthesisService.isSupported();

  const voices = useMemo(() => {
    if (!lang || !allVoices.length) return allVoices;
    const prefix = lang.split('-')[0];
    return allVoices.filter(v => v.lang.startsWith(prefix));
  }, [allVoices, lang]);

  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      setAllVoices(speechSynthesisService.getAvailableVoices());
    };

    updateVoices();

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
    speechSynthesisService.speak(text, lang);
  }, [lang]);

  const stop = useCallback(() => {
    speechSynthesisService.stop();
  }, []);

  const setConfig = useCallback((newConfig: Partial<SpeechSynthesisConfig>) => {
    setConfigState((prev) => ({ ...prev, ...newConfig }));
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    config,
    setConfig,
  };
}
