'use client';

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { MessageRow } from '../types/chat.types';
import type { Character } from '@/features/characters/types/character.types';

type Props = {
  message: MessageRow;
  character?: Character | null;
  onSpeak?: () => void;
  isSpeaking?: boolean;
};

export default function MessageItem({ message, character, onSpeak, isSpeaking }: Props) {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex gap-3 items-start ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && character && (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 mt-1 border border-border">
          {(character.avatar || (character as any).avatar_url) ? (
            <img
              src={character.avatar || (character as any).avatar_url}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary">
              {character.name ? character.name.slice(0, 2).toUpperCase() : 'AI'}
            </div>
          )}
        </div>
      )}

      <div
        className={`max-w-[80%] break-words px-3 py-2 rounded-xl ${isUser
          ? 'ml-auto bg-primary text-primary-foreground'
          : 'mr-auto bg-muted text-foreground'
          }`}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>

        <div className="flex items-center justify-between mt-1 gap-2">
          {message.id && !message.id.startsWith('temp-') && (
            <div className="text-[10px] text-muted-foreground opacity-70">
              {new Date(message.created_at).toLocaleTimeString()}
            </div>
          )}

          {isAI && onSpeak && (
            <button
              type="button"
              onClick={onSpeak}
              className="ml-auto flex-shrink-0 p-0.5 rounded hover:bg-muted-foreground/10 transition-colors"
              title={isSpeaking ? 'Stop' : 'Listen'}
            >
              {isSpeaking ? (
                <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-muted-foreground opacity-50 hover:opacity-100" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
