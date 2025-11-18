'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Character } from '@/features/characters/types/character.types';
import type { ChatRow } from '../types/chat.types';

type Props = {
    chat: ChatRow;
    character?: Character;
};

export default function ChatItem({ chat, character }: Props) {
    const avatarUrl = character?.avatar;
    const fallbackText =
        character?.name?.slice(0, 2).toUpperCase() || (chat.character_id ? chat.character_id.slice(0, 2).toUpperCase() : 'AI');

    return (
        <li>
            <Link href={`/chat/${chat.id}`} passHref>
                <Card className="hover:bg-accent transition-colors cursor-pointer py-0">
                    <CardContent className="p-4 flex items-start gap-3 min-h-[100px]">
                        <Avatar className="w-20 h-auto self-stretch rounded-xl overflow-hidden shrink-0">
                            {avatarUrl ? (
                                <AvatarImage src={avatarUrl} alt={character?.name || chat.title || 'Chat'} className="object-cover w-full h-full" />
                            ) : (
                                <AvatarFallback className="text-base font-semibold rounded-xl flex items-center justify-center h-full">
                                    {fallbackText}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <div className="font-semibold text-base truncate">
                                {character?.name || 'New Chat'} |{' '}
                                <span className="text-muted-foreground">{character?.role || 'AI Assistant'}</span>
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {chat.last_message || 'No messages yet'}
                            </div>
                            <div className="text-xs text-muted-foreground shrink-0 mt-2">
                                {new Date(chat.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </li>
    );
}
