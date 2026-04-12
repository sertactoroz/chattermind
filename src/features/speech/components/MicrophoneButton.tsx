'use client';

import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface MicrophoneButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function MicrophoneButton({
  isListening,
  isSupported,
  onClick,
  disabled = false,
}: MicrophoneButtonProps) {
  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
        isListening
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
