import { supabaseAdmin } from '../../lib/supabaseServer';
import { Message } from '../../domain/types';

export class DatabaseService {
  async saveMessage(chatId: string, sender: 'user' | 'ai', content: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('messages')
      .insert([{ chat_id: chatId, sender, content }]);

    if (error) {
      console.error('Failed to save message:', error);
      throw new Error('Database operation failed');
    }
  }

  async getRecentMessages(
    chatId: string,
    limit: number = 50,
    contextLimit: number = 20
  ): Promise<Message[]> {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('sender, content, created_at')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch recent messages:', error);
      return [];
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const lastMessages = data.slice(-contextLimit);

    return lastMessages.map((msg) => ({
      id: '',
      chatId,
      sender: msg.sender,
      content: msg.content,
      createdAt: msg.created_at,
    }));
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch chat messages:', error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((msg) => ({
      id: msg.id,
      chatId: msg.chat_id,
      sender: msg.sender,
      content: msg.content,
      createdAt: msg.created_at,
    }));
  }
}

let databaseServiceInstance: DatabaseService | null = null;

export function getDatabaseService(): DatabaseService {
  if (!databaseServiceInstance) {
    databaseServiceInstance = new DatabaseService();
  }
  return databaseServiceInstance;
}