import ChatWindow from '@/features/chat/containers/ChatWindow';
import AuthGuard from '@/features/auth/components/AuthGuard';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { supabaseAdmin } from '@/lib/supabaseServer';

// FIX: Added the 'locale' segment to the Props type definition.
// This resolves the Type Error caused by the path structure /app/[locale]/chat/[chatId]/page.tsx
type Props = {
    params: {
        locale: string; // Dynamic segment from /app/[locale]
        chatId: string; // Dynamic segment from /chat/[chatId]
    };
    // If you use search params, you should define them here:
    // searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ChatIdPage({ params }: Props) {
    // Destructuring both parameters to satisfy TypeScript and access the values
    const { chatId, locale } = params;

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
        // eslint-disable-next-line no-console
        console.error('chat page error', err);
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <NotFoundToast />
            </div>
        );
    }
}