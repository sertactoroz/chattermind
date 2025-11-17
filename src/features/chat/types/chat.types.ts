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
  title: string ;
  last_message: string;
  created_at: string;
};

export type MessageRow = {
  id: string;
  chat_id: string;
  sender: 'user' | 'ai' | string;
  content: string;
  metadata?: any;
  created_at: string;
};