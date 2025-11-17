'use client';

import React from 'react';
import type { MessageRow } from '../types/chat.types';

type Props = { message: MessageRow };

export default function MessageItem({ message }: Props) {
  const isUser = message.sender === 'user';
  return (
    <div
      className={`max-w-[80%] break-words px-3 py-2 rounded-xl ${isUser ? 'ml-auto bg-sky-600 text-white' : 'mr-auto bg-slate-100 text-slate-800'
        }`}
    >
      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
      {message.id && !message.id.startsWith('temp-') && (
        <div className="text-[10px] mt-1 text-slate-400">
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
