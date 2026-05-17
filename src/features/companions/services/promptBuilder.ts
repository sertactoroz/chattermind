import type { MessageRow } from '@/features/chat/types/chat.types';
import { getCompanionById } from './companionService';
import { getDatabaseService } from '@/services/database/DatabaseService';

export async function buildPrompt(chatId: string, userMessage: string, characterId?: string | null, maxHistory = 10) {
  const companion = characterId ? getCompanionById(characterId) : null;

  const systemPrompt = companion?.systemPrompt ?? "You are a helpful assistant.";

  const db = getDatabaseService();
  const data = await db.getMessagesForPrompt(chatId, maxHistory);

  let convoText = '';
  for (const m of data as MessageRow[]) {
    const sender = m.sender === 'user' ? 'User' : 'AI';
    convoText += `${sender}: ${m.content}\n`;
  }

  convoText += `User: ${userMessage}\nAI:`;

  const finalPrompt = `${systemPrompt}\n\nConversation history:\n${convoText}`;

  return { prompt: finalPrompt, companion };
}
