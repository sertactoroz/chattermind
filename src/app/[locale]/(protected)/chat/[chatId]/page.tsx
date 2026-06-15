'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import ChatWindow from '@/features/chat/containers/ChatWindow';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { useCompanions } from '@/features/companions/hooks/useCompanions';
import { listChats } from '@/features/chat/services/chatService';
import type { ChatRow } from '@/features/chat/types/chat.types';
import { LoaderPinwheel } from 'lucide-react';

export default function ChatIdPage() {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId;
  const { user, loading: authLoading } = useAuthContext();
  const { allCompanions, isLoading: companionsLoading } = useCompanions();
  const [chat, setChat] = useState<ChatRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    listChats(user.id)
      .then((chats) => {
        if (mounted) setChat(chats.find((item) => item.id === chatId) ?? null);
      })
      .catch((err) => {
        console.error('Chat page error:', err);
        if (mounted) setChat(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [authLoading, chatId, user]);

  const companion = useMemo(
    () => allCompanions.find((item) => item.id === chat?.character_id) ?? null,
    [allCompanions, chat?.character_id]
  );

  if (authLoading || isLoading || companionsLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <LoaderPinwheel className="h-10 w-10 animate-spin text-primary" aria-label="Loading chat" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center flex-1">
        <NotFoundToast />
      </div>
    );
  }

  return <ChatWindow chatId={chatId} characterId={chat.character_id} companion={companion} />;
}
