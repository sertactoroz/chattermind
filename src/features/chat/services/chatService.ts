import type { ChatRow, MessageRow } from '@/features/chat/types/chat.types';
import { api } from '@/lib/api';

function mapChatRow(raw: Record<string, unknown>): ChatRow {
  return {
    id: raw.id as string,
    user_id: (raw.user_id || raw.userId) as string,
    character_id: (raw.character_id || raw.characterId) as string,
    title: (raw.title || '') as string,
    last_message: (raw.last_message || raw.lastMessage || '') as string,
    created_at: (raw.created_at || raw.createdAt || '') as string,
  };
}

function mapMessageRow(raw: Record<string, unknown>): MessageRow {
  return {
    id: raw.id as string,
    chat_id: (raw.chat_id || raw.chatId) as string,
    sender: api.mapSender(raw.sender as string),
    content: raw.content as string,
    metadata: raw.metadata as MessageRow['metadata'],
    created_at: (raw.created_at || raw.createdAt) as string,
  };
}

export async function listChats(userId: string): Promise<ChatRow[]> {
  const data = await api.get<Record<string, unknown>[]>(`/api/chat/list?userId=${encodeURIComponent(userId)}`);
  return data.map(mapChatRow);
}

export async function createChat(userId: string, characterId: string, title: string): Promise<ChatRow> {
  const raw = await api.post<Record<string, unknown>>('/api/chat/create', { userId, characterId, title: title ?? 'New chat' });
  return mapChatRow(raw);
}

export async function addMessage(
  chatId: string,
  sender: 'user' | 'ai',
  content: string,
  metadata?: unknown
): Promise<MessageRow> {
  const raw = await api.post<Record<string, unknown>>('/api/chat/message', {
    chatId,
    sender: sender.toUpperCase(),
    content,
    metadata,
  });
  return mapMessageRow(raw);
}

export async function listMessages(chatId: string): Promise<MessageRow[]> {
  const data = await api.get<Record<string, unknown>[]>(`/api/chat/messages?chatId=${encodeURIComponent(chatId)}`);
  return data.map(mapMessageRow);
}

export async function deleteChat(chatId: string): Promise<void> {
  await api.delete(`/api/chat/${chatId}`);
}
