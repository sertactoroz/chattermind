export type ChatItem = {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt?: string;
};

export type ChatRow = {
  id: string;
  user_id: string;
  character_id: string;
  title: string;
  last_message: string;
  created_at: string;
};

// Generic type for Supabase jsonb columns
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MessageRow = {
  id: string;
  chat_id: string;
  sender: 'user' | 'ai' | string;
  content: string;
  metadata?: Json; 
  created_at: string;
};