import ChatWindow from '@/features/chat/containers/ChatWindow';
import AuthGuard from '@/features/auth/components/AuthGuard';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { supabaseAdmin } from '@/lib/supabaseServer';

// 1. Define the shape of your dynamic parameters (the resolved type)
type ChatIdPageParams = {
    locale: string;
    chatId: string;
};

// 2. Define the PageProps, treating 'params' as a PROMISE of your resolved type
type ChatPageProps = {
    // This is the CRITICAL change to satisfy the build constraint
    params: Promise<ChatIdPageParams>;
    searchParams: { [key: string]: string | string[] | undefined };
};

// Now, update your function signature to use this derived type
export default async function ChatIdPage({ params }: ChatPageProps) {

    // 3. Keep the AWAIT here to satisfy the Next.js runtime check
    const resolvedParams = await params;

    // Destructure the necessary variable from the AWAITED object
    const { chatId } = resolvedParams;

    // ... rest of your logic remains the same (as it was in the previous fix)

    try {
        // Fetch chat data from the server
        const { data, error } = await supabaseAdmin
            .from('chats')
            .select('id, title, character_id')
            .eq('id', chatId)
            .limit(1)
            .single();

        // Handle errors or chat not found
        if (error || !data) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center">
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
        // Log the error during runtime (console usage should be addressed by ESLint config)
        // eslint-disable-next-line no-console
        console.error('chat page error', err);
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <NotFoundToast />
            </div>
        );
    }
}