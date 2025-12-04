import type { MessageRow } from '@/features/chat/types/chat.types';
import { getCharacterById } from './characterService';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function buildPrompt(chatId: string, userMessage: string, characterId?: string | null, maxHistory = 10) {
  const character = characterId ? getCharacterById(characterId) : null;

  const systemPrompt = character?.systemPrompt ?? "You are a helpful assistant.";

  const { data } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
    .limit(maxHistory);

  let convoText = '';
  for (const m of (data ?? []) as MessageRow[]) {
    const sender = m.sender === 'user' ? 'User' : 'AI';
    convoText += `${sender}: ${m.content}\n`;
  }

  convoText += `User: ${userMessage}\nAI:`;

  const finalPrompt = `${systemPrompt}\n\nConversation history:\n${convoText}`;

  return { prompt: finalPrompt, character };
}
