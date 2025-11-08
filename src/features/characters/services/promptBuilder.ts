import characters from '../data/characters.json';
import { supabaseAdmin } from '@/lib/supabaseServer'; // server-side only
import type { MessageRow } from '@/features/chat/services/chatService';

type Character = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  description?: string;
  systemPrompt: string;
};

export async function getCharacterById(id: string): Promise<Character | null> {
  const find = (characters as Character[]).find(c => c.id === id);
  return find ?? null;
}

/**
 * Build a prompt string for the LLM.
 * - Loads character systemPrompt if characterId present
 * - Fetches last N messages from DB for context
 * - Returns the final prompt string
 */
export async function buildPrompt(chatId: string, userMessage: string, characterId?: string | null, maxHistory = 10) {
  const character = characterId ? await getCharacterById(characterId) : null;
  const systemPrompt = character?.systemPrompt ?? 'You are a helpful assistant.';

  // fetch recent messages (server-side)
  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
    .limit(maxHistory);

  // fallback: if error, continue with only userMessage
  const history = (data ?? []) as MessageRow[];

  // Build conversation chunk
  // Simple format: "User: ...\nAI: ...\n"
  let convoText = '';
  for (const m of history) {
    const role = m.sender === 'user' ? 'User' : 'AI';
    // sanitize content if needed
    convoText += `${role}: ${m.content}\n`;
  }
  // append the new user message
  convoText += `User: ${userMessage}\nAI:`;

  // final prompt: system + conversation
  const finalPrompt = `${systemPrompt}\n\nConversation history:\n${convoText}`;

  return {
    prompt: finalPrompt,
    character,
  };
}