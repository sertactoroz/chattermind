import { sql } from '@/lib/neon';
import { Message } from '../../domain/types';

export interface ChatRow {
  id: string;
  user_id: string;
  companion_id: string;
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
    const rows = await sql`
      INSERT INTO chats (user_id, companion_id, title)
      VALUES (${userId}, ${characterId}, ${title ?? null})
      RETURNING id, user_id, companion_id, title, last_message, created_at
    `;
    if (!rows || rows.length === 0) {
      throw new Error('Database operation failed');
    }
    return rows[0] as ChatRow;
  }

  async addMessage(
    chatId: string,
    sender: 'user' | 'ai',
    content: string,
    metadata?: unknown
  ): Promise<MessageRow> {
    const rows = await sql`
      INSERT INTO messages (chat_id, sender, content, metadata)
      VALUES (${chatId}, ${sender}, ${content}, ${metadata ? JSON.stringify(metadata) : null})
      RETURNING id, chat_id, sender, content, metadata, created_at
    `;
    if (!rows || rows.length === 0) {
      throw new Error('Database operation failed');
    }

    sql`UPDATE chats SET last_message = ${content} WHERE id = ${chatId}`.catch((err) => {
      console.warn('Failed to update chat.last_message', err);
    });

    return rows[0] as MessageRow;
  }

  async saveMessage(chatId: string, sender: 'user' | 'ai', content: string): Promise<void> {
    await sql`
      INSERT INTO messages (chat_id, sender, content)
      VALUES (${chatId}, ${sender}, ${content})
    `;
  }

  async getRecentMessages(
    chatId: string,
    limit: number = 50,
    contextLimit: number = 20
  ): Promise<Message[]> {
    const rows = await sql`
      SELECT sender, content, created_at
      FROM messages
      WHERE chat_id = ${chatId}
      ORDER BY created_at ASC
      LIMIT ${limit}
    `;

    if (!rows || rows.length === 0) {
      return [];
    }

    const lastMessages = rows.slice(-contextLimit);

    return lastMessages.map((msg: Record<string, unknown>) => ({
      id: '',
      chatId,
      sender: msg.sender as 'user' | 'ai',
      content: msg.content as string,
      createdAt: msg.created_at as string,
    }));
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
    const rows = await sql`
      SELECT id, chat_id, sender, content, created_at
      FROM messages
      WHERE chat_id = ${chatId}
      ORDER BY created_at ASC
    `;

    if (!rows || !Array.isArray(rows)) {
      return [];
    }

    return rows.map((msg: Record<string, unknown>) => ({
      id: msg.id as string,
      chatId: msg.chat_id as string,
      sender: msg.sender as 'user' | 'ai',
      content: msg.content as string,
      createdAt: msg.created_at as string,
    }));
  }

  async listChats(userId: string): Promise<ChatRow[]> {
    const rows = await sql`
      SELECT id, user_id, companion_id, title, last_message, created_at
      FROM chats
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return (rows ?? []) as ChatRow[];
  }

  async listMessages(chatId: string): Promise<MessageRow[]> {
    const rows = await sql`
      SELECT id, chat_id, sender, content, metadata, created_at
      FROM messages
      WHERE chat_id = ${chatId}
      ORDER BY created_at ASC
    `;
    return (rows ?? []) as MessageRow[];
  }

  async getChatById(chatId: string): Promise<ChatRow | null> {
    const rows = await sql`
      SELECT id, user_id, companion_id, title, last_message, created_at
      FROM chats
      WHERE id = ${chatId}
      LIMIT 1
    `;
    if (!rows || rows.length === 0) return null;
    return rows[0] as ChatRow;
  }

  async getMessagesForPrompt(chatId: string, maxHistory: number = 10): Promise<MessageRow[]> {
    const rows = await sql`
      SELECT id, chat_id, sender, content, metadata, created_at
      FROM messages
      WHERE chat_id = ${chatId}
      ORDER BY created_at ASC
      LIMIT ${maxHistory}
    `;
    return (rows ?? []) as MessageRow[];
  }
}

let databaseServiceInstance: DatabaseService | null = null;

export function getDatabaseService(): DatabaseService {
  if (!databaseServiceInstance) {
    databaseServiceInstance = new DatabaseService();
  }
  return databaseServiceInstance;
}
