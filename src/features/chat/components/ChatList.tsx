'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { listChats, createChat, ChatRow } from '../services/chatService';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatList() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const rows = await listChats(user.id);
        if (!mounted) return;
        setChats(rows);
      } catch (err) {
        console.error('listChats error', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();

    // optional: subscribe to chats table changes for this user
    // if you added realtime for chats you can subscribe here to keep list live
    // return unsub on cleanup
    return () => { mounted = false; };
  }, [user]);

  const handleNewChat = async () => {
    if (!user) return;
    setCreating(true);
    try {
      // Optionally let user pick a character — for now create empty chat
      const chat = await createChat(user.id, null, 'New chat');
      // redirect to chat page
      router.push(`/chat/${chat.id}`);
    } catch (err) {
      console.error('createChat error', err);
      alert('Failed to create chat');
    } finally {
      setCreating(false);
    }
  };

  if (loading || isLoading) {
    // use Skeleton component for consistent UI
    return (
      <div className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button
          onClick={handleNewChat}
          disabled={creating}
          className="min-h-[44px] px-3 py-2 rounded-lg bg-sky-600 text-white text-sm shadow"
        >
          {creating ? 'Creating…' : 'New chat'}
        </button>
      </div>

      {chats.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-sm text-slate-600">
          <p className="mb-3">No chats yet. Start a new conversation to see it here.</p>
          <button onClick={handleNewChat} className="px-4 py-2 rounded bg-sky-600 text-white">
            Create first chat
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {chats.map(c => (
            <li key={c.id}>
              <Link
                href={`/chat/${c.id}`}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-sm font-medium">
                    {c.character_id ? c.character_id.slice(0, 2).toUpperCase() : 'AI'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{c.title || 'New chat'}</div>
                    <div className="text-xs text-slate-500 truncate">{c.last_message || 'No messages yet'}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">{new Date(c.created_at).toLocaleDateString()}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
