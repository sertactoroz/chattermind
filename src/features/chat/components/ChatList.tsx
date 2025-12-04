'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listChats } from '../services/chatService';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useCharacters } from '@/features/characters/hooks/useCharacters';
import type { Character } from '@/features/characters/types/character.types';
import ChatItem from './ChatItem';
import { ChatRow } from '../types/chat.types';
import { toast } from 'sonner';

export default function ChatList() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { allCharacters, isLoading: charsLoading } = useCharacters();
  const characterMap: Record<string, Character> = Object.fromEntries(allCharacters.map(c => [c.id, c]));

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const loadChats = async () => {
      setIsLoading(true);
      try {
        const rows = await listChats(user.id);
        if (!mounted) return;
        setChats(rows);
      } catch (err) {
        console.error('Error loading chats', err);
        // Show Sonner toast on error
        toast.error('Failed to load chats.', {
          description: 'An error occurred while fetching your conversation list.',
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadChats();
    return () => { mounted = false; };
  }, [user]);

  const handleNewChat = () => router.push('/chat/select-character');

  if (authLoading || isLoading || charsLoading) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Chats</h2>
        <Button onClick={handleNewChat}>New chat</Button>
      </div>

      {chats.length === 0 ? (
        <Card className="text-center p-6 border-2 border-dashed">
          <CardContent className="p-0">
            <p className="mb-4 text-sm text-muted-foreground">
              No chats yet. Start a new conversation to see it here.
            </p>
            <Button onClick={handleNewChat}>Create first chat</Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {chats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              character={chat.character_id ? characterMap[chat.character_id] : undefined}
            />
          ))}
        </ul>
      )}
    </div>
  );
}