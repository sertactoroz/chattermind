'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listChats, deleteChat } from '../services/chatService';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useCompanions } from '@/features/companions/hooks/useCompanions';
import type { Companion } from '@/features/companions/types/companion.types';
import ChatItem from './ChatItem';
import { ChatRow } from '../types/chat.types';
import { toast } from 'sonner';

export default function ChatList() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const { allCompanions, isLoading: charsLoading } = useCompanions();
  const companionMap: Record<string, Companion> = Object.fromEntries(allCompanions.map(c => [c.id, c]));

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

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);
      setChats(prev => prev.filter(c => c.id !== chatId));
    } catch {
      toast.error('Failed to delete chat.');
    }
  };

  const handleNewChat = () => router.push('/companions');

  const filtered = search.trim()
    ? chats.filter(c => {
        const q = search.toLowerCase();
        const titleMatch = (c.title || '').toLowerCase().includes(q);
        const msgMatch = (c.last_message || '').toLowerCase().includes(q);
        const compName = companionMap[c.character_id]?.name || '';
        const nameMatch = compName.toLowerCase().includes(q);
        return titleMatch || msgMatch || nameMatch;
      })
    : chats;

  if (authLoading || isLoading || charsLoading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-20" />
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
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Chats</h2>
      </div>

      {chats.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      )}

      {chats.length === 0 ? (
        <Card className="text-center p-6 border-2 border-dashed">
          <CardContent className="p-0">
            <p className="mb-4 text-sm text-muted-foreground">
              No chats yet. Start a new conversation to see it here.
            </p>
            <Button onClick={handleNewChat}>Create first chat</Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No chats match your search.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              companion={chat.character_id ? companionMap[chat.character_id] : undefined}
              onDelete={handleDeleteChat}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
