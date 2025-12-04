import ChatWindow from '@/features/chat/containers/ChatWindow';
import AuthGuard from '@/features/auth/components/AuthGuard';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Define the expected props structure for a Next.js App Router page
type Props = {
    params: { chatId: string };
    // If you use search params, you should define them here:
    // searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ChatIdPage({ params }: Props) {
    // FIX: Removed 'await'. 'params' is an object provided directly by Next.js, not a Promise.
    const { chatId } = params;

    try {
        const { data, error } = await supabaseAdmin
            .from('chats')
            .select('id, title, character_id')
            .eq('id', chatId)
            .limit(1)
            .single();

        if (error || !data) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center">
                    {/* Render NotFoundToast if chat is not found or error occurs */}
                    <NotFoundToast />
                </div>
            );
        }

        const characterId = data.character_id ?? null;

        return (
            <AuthGuard>
                <div className="min-h-screen bg-background">
                    <div className="max-w-md mx-auto h-[80vh]">
                        <ChatWindow chatId={chatId} characterId={characterId} />
                    </div>
                </div>
            </AuthGuard>
        );
    } catch (err) {
        // WARNING: This console statement might still trigger the 'no-console' linter warning
        // unless globally disabled or locally suppressed.
        console.error('chat page error', err);
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <NotFoundToast />
            </div>
        );
    }
}