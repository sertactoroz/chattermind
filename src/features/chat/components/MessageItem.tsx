'use client';

import React from 'react';
import type { MessageRow } from '../types/chat.types';

type Props = { message: MessageRow };

export default function MessageItem({ message }: Props) {
  // Determine if the message was sent by the current user
  const isUser = message.sender === 'user';

  // Theme-aware classes are used for background and text colors.
  // User messages: bg-primary (Theme color), text-primary-foreground (White/Dark text on theme color)
  // AI/Other messages: bg-muted (Light gray/Dark background), text-foreground (Standard text color)
  return (
    <div
      className={`max-w-[80%] break-words px-3 py-2 rounded-xl ${isUser
        ? 'ml-auto bg-primary text-primary-foreground' // User's message style: uses the central primary color
        : 'mr-auto bg-muted text-foreground'          // AI/Other style: uses the muted background and standard foreground text
        }`}
    >
      <div className="text-sm whitespace-pre-wrap">{message.content}</div>

      {/* Time stamp logic: only display if it's a real message (not a temporary optimistic update) */}
      {message.id && !message.id.startsWith('temp-') && (
        // text-muted-foreground ensures the timestamp color adapts to Dark/Light mode
        <div className="text-[10px] mt-1 text-muted-foreground opacity-70">
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}