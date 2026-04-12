export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  userId: string;
  characterId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  sender: 'user' | 'ai';
  content: string;
  createdAt: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  promptKey: string;
  language?: string;
  avatar?: string;
}

export interface AIRequest {
  chatId: string;
  userId?: string;
  content: string;
  characterId?: string | null;
}

export interface AIResponse {
  ai: string;
  warning?: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  characterId?: string | null;
}