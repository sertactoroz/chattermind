import { supabase } from '@/lib/supabaseClient';

export function subscribeMessages(chatId: string, cb: (msg: any) => void) {
     console.log('[realtime] subscribing to chatId:', chatId);
  const channel = supabase.channel(`public:messages:chat_id=eq.${chatId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, (payload) => {
      cb(payload.new);
    })
    .subscribe();

  return {
    unsubscribe: () => channel.unsubscribe(),
  };
}
