'use client';

import { useState, useEffect, useCallback } from 'react';
import { speechRecognitionService } from '../services/speechRecognitionService';
import type { SpeechRecognitionStatus } from '../types/speech.types';

interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  status: SpeechRecognitionStatus;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
  } = options;

  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [status, setStatus] = useState<SpeechRecognitionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const isListening = status === 'listening';
  const isSupported = speechRecognitionService.isSupported();

  useEffect(() => {
    speechRecognitionService.setConfig({
      lang: language,
      continuous,
      interimResults,
    });

    speechRecognitionService.setCallbacks({
      onResult: (resultText, isFinal) => {
        if (isFinal) {
          setTranscript(resultText);
          setInterimTranscript('');
        } else {
          setInterimTranscript(resultText);
        }
      },
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        if (newStatus === 'error') {
          setError('Speech recognition error');
        } else {
          setError(null);
        }
      },
      onError: (errorMsg) => {
        setError(errorMsg);
      },
    });

    return () => {
      if (isListening) {
        speechRecognitionService.stop();
      }
    };
  }, [language, continuous, interimResults, isListening]);

  const startListening = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    try {
      speechRecognitionService.start();
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const stopListening = useCallback(() => {
    speechRecognitionService.stop();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    status,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
}
