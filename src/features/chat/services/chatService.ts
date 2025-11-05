import { supabase } from '@/lib/supabaseClient';

export async function createChat(userId: string, characterId?: string, title?: string) {
  const { data, error } = await supabase
    .from('chats')
    .insert([{ user_id: userId, character_id: characterId || null, title: title || null }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addMessage(chatId: string, sender: 'user' | 'ai', content: string, metadata?: any) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ chat_id: chatId, sender, content, metadata }])
    .select()
    .single();

  // Update last_message in chats
  await supabase.from('chats').update({ last_message: content }).eq('id', chatId);
  
  if (error) throw error;
  return data;
}

export async function listChats(userId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
