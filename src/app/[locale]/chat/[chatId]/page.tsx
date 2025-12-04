import ChatWindow from '@/features/chat/containers/ChatWindow';
import AuthGuard from '@/features/auth/components/AuthGuard';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Define the expected props structure for a Next.js App Router page
type Props = {
    params: {
        locale: string; // Dynamic segment from /app/[locale]
        chatId: string; // Dynamic segment from /chat/[chatId]
    };
    // If you use search params, you should define them here:
    // searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ChatIdPage({ params }: Props) {
    // FIX 1: Removed 'locale' from destructuring to avoid 'unused variable' error.
    // We only destructure 'chatId' since 'locale' is not used in the function body.
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
        console.error('chat page error', err);
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <NotFoundToast />
            </div>
        );
    }
}