import { supabaseAdmin } from '../../lib/supabaseServer';
import { Message } from '../../domain/types';

export interface ChatRow {
  id: string;
  user_id: string;
  character_id: string;
  title: string;
  last_message: string;
  created_at: string;
}

export interface MessageRow {
  id: string;
  chat_id: string;
  sender: string;
  content: string;
  metadata?: unknown;
  created_at: string;
}

export class DatabaseService {
  async createChat(userId: string, characterId: string, title: string): Promise<ChatRow> {
    const { data, error } = await supabaseAdmin
      .from('chats')
      .insert([{ user_id: userId, character_id: characterId, title: title ?? null }])
      .select()
      .single();

    if (error) {
      console.error('Failed to create chat:', error);
      throw new Error('Database operation failed');
    }

    return data as ChatRow;
  }

  async addMessage(
    chatId: string,
    sender: 'user' | 'ai',
    content: string,
    metadata?: unknown
  ): Promise<MessageRow> {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([{ chat_id: chatId, sender, content, metadata }])
      .select()
      .single();

    if (error) {
      console.error('Failed to add message:', error);
      throw new Error('Database operation failed');
    }

    supabaseAdmin
      .from('chats')
      .update({ last_message: content })
      .eq('id', chatId)
      .then(({ error: updateError }) => {
        if (updateError) console.warn('Failed to update chat.last_message', updateError);
      });

    return data as MessageRow;
  }

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

  async listChats(userId: string): Promise<ChatRow[]> {
    const { data, error } = await supabaseAdmin
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to list chats:', error);
      throw new Error('Database operation failed');
    }

    return (data ?? []) as ChatRow[];
  }

  async listMessages(chatId: string): Promise<MessageRow[]> {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to list messages:', error);
      throw new Error('Database operation failed');
    }

    return (data ?? []) as MessageRow[];
  }
}

let databaseServiceInstance: DatabaseService | null = null;

export function getDatabaseService(): DatabaseService {
  if (!databaseServiceInstance) {
    databaseServiceInstance = new DatabaseService();
  }
  return databaseServiceInstance;
}