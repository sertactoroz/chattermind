import type { ChatRow, MessageRow } from '@/features/chat/types/chat.types';

export async function listChats(userId: string): Promise<ChatRow[]> {
  const resp = await fetch(`/api/chat/list?userId=${encodeURIComponent(userId)}`);

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(err || 'Failed to load chats');
  }

  const raw = await resp.json();
  return (raw.data ?? raw) as ChatRow[];
}

export async function createChat(userId: string, characterId: string, title: string): Promise<ChatRow> {
  const resp = await fetch('/api/chat/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, characterId, title: title ?? 'New chat' }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(err || 'Failed to create chat');
  }

  const raw = await resp.json();
  return (raw.data ?? raw) as ChatRow;
}

export async function addMessage(
  chatId: string,
  sender: 'user' | 'ai',
  content: string,
  metadata?: unknown
): Promise<MessageRow> {
  const resp = await fetch('/api/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, sender, content, metadata }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(err || 'Failed to add message');
  }

  const raw = await resp.json();
  return (raw.data ?? raw) as MessageRow;
}

export async function listMessages(chatId: string): Promise<MessageRow[]> {
  const resp = await fetch(`/api/chat/messages?chatId=${encodeURIComponent(chatId)}`);

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(err || 'Failed to load messages');
  }

  const raw = await resp.json();
  return (raw.data ?? raw) as MessageRow[];
}