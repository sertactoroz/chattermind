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
  if (!isSupported) {
    return null; // Don't show button if not supported
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isListening}
      className={`px-3 py-2 rounded border border-input bg-background hover:bg-accent hover:text-accent-foreground min-h-[44px] transition-colors flex items-center justify-center gap-2
        ${isListening ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Stop</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Voice</span>
        </>
      )}
    </button>
  );
}
