import { supabase } from '@/lib/supabaseClient';

import type { ChatRow, MessageRow } from '@/features/chat/types/chat.types';

// List chats for a given user (most recent first)
export async function listChats(userId: string): Promise<ChatRow[]> {
  const res = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (res.error) {
    // bubble up error so caller can handle it
    throw res.error;
  }

  // Cast to our ChatRow[] type (safe runtime, good enough for TypeScript)
  return (res.data ?? []) as ChatRow[];
}

/**
 * Create a new chat row; returns created ChatRow
 */
export async function createChat(userId: string, characterId: string, title: string): Promise<ChatRow> {
  const res = await supabase
    .from('chats')
    .insert([{ user_id: userId, character_id: characterId, title: title ?? null }])
    .select()
    .single();

  if (res.error) throw res.error;
  return res.data as ChatRow;
}

/**
 * Add a message to a chat and update chat.last_message
 */
export async function addMessage(
  chatId: string,
  sender: 'user' | 'ai',
  content: string,
  metadata?: unknown // Using 'unknown' before conversion to Json type
): Promise<MessageRow> {
  const res = await supabase
    .from('messages')
    .insert([{ chat_id: chatId, sender, content, metadata }])
    .select()
    .single();

  if (res.error) throw res.error;

  // Best-effort update to chats.last_message; do not block returning the message
  // (we don't `await` to avoid race if update fails; but you can await if you prefer)
  supabase.from('chats').update({ last_message: content }).eq('id', chatId).then(({ error }) => {
    if (error) console.warn('Failed to update chat.last_message', error);
  });

  return res.data as MessageRow;
}

/**
 * Helper - fetch messages for a chat (ordered ascending)
 */
export async function listMessages(chatId: string): Promise<MessageRow[]> {
  const res = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (res.error) throw res.error;
  return (res.data ?? []) as MessageRow[];
}