'use client';

import React from 'react';
import type { MessageRow } from '../types/chat.types';
import type { Character } from '@/features/characters/types/character.types';

type Props = {
  message: MessageRow;
  character?: Character | null;
};

export default function MessageItem({ message, character }: Props) {
  // Determine if the message was sent by the current user
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex gap-3 items-start ${isAI ? 'justify-start' : 'justify-end'}`}>
      {/* Avatar for AI messages - shown on the left */}
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

      {/* Message bubble */}
      <div
        className={`max-w-[80%] break-words px-3 py-2 rounded-xl ${isUser
          ? 'ml-auto bg-primary text-primary-foreground' // User's message style
          : 'mr-auto bg-muted text-foreground'          // AI/Other style
          }`}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>

        {/* Time stamp logic: only display if it's a real message (not a temporary optimistic update) */}
        {message.id && !message.id.startsWith('temp-') && (
          <div className="text-[10px] mt-1 text-muted-foreground opacity-70">
            {new Date(message.created_at).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}