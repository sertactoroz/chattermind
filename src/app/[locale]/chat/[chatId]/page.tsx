import ChatWindow from '@/features/chat/components/ChatWindow';
import AuthGuard from '@/features/common/components/AuthGuard'; // (if exists, keep it)
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseServer';

type Props = {
    params: { chatId: string };
};

export default async function ChatIdPage({ params }: Props) {
    const { chatId } = await params;

    // optional: validate that chat exists and belongs to current user
    // (server-side safety; you can adjust to allow public chats)
    try {
        const { data, error } = await supabaseAdmin
            .from('chats')
            .select('id, title, character_id')
            .eq('id', chatId)
            .limit(1)
            .single();

        if (error || !data) {
            // If chat is not found, return 404
            return notFound();
        }

        const characterId = data.character_id ?? null;

        // Render the client ChatWindow; pass chatId and characterId as props
        return (
            // wrap in AuthGuard if you use client-side guard; if AuthGuard is a client component,
            // put it INSIDE ChatWindow or use different approach.
            <AuthGuard>
                <div className="min-h-screen bg-background">
                    <div className="max-w-md mx-auto h-[80vh]">
                        <ChatWindow chatId={chatId} characterId={characterId} />
                    </div>
                </div>
            </AuthGuard>
        );
    } catch (err) {
        // Log chat page error and return 404
        console.error('chat page error', err);
        return notFound();
    }
}