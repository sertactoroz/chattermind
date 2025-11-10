import ChatWindow from '@/features/chat/components/ChatWindow';
import AuthGuard from '@/features/common/components/AuthGuard'; // varsa; yoksa kaldır
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseServer';

type Props = {
    params: { chatId: string };
};

export default async function ChatIdPage({ params }: Props) {
    const { chatId } = params;

    // optional: validate that chat exists and belongs to current user
    // (server-side safety; you can adjust to allow public chats)
    try {
        const { data, error } = await supabaseAdmin
            .from('chats')
            .select('id, title, character_id')
            .eq('id', params.chatId)
            .limit(1)
            .single();

        if (error || !data) {
            // chat bulunamazsa 404
            return notFound();
        }

        const characterId = data.character_id ?? null;

        // render the client ChatWindow; pass chatId and characterId as props
        return (
            // wrap in AuthGuard if you use client-side guard; if AuthGuard is a client component,
            // put it INSIDE ChatWindow or use different approach.
            <AuthGuard>
                <div className="min-h-screen bg-slate-50">
                    <div className="max-w-md mx-auto h-[80vh]">
                        <ChatWindow chatId={chatId} characterId={characterId} />
                    </div>
                </div>
            </AuthGuard>
        );
    } catch (err) {
        console.error('chat page error', err);
        return notFound();
    }
}
