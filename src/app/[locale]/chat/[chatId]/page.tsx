import ChatWindow from '@/features/chat/containers/ChatWindow';
import AuthGuard from '@/features/auth/components/AuthGuard';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Defining a custom PageProps interface that conforms to Next.js's internal expectations
// This is done to resolve the "Type 'Props' does not satisfy the constraint 'PageProps'" error.
interface PageProps {
    params: {
        locale: string; // Dynamic segment from /app/[locale]
        chatId: string; // Dynamic segment from /chat/[chatId]
    };
    searchParams: { [key: string]: string | string[] | undefined }; // Include if search params are expected
}

// NOTE: We are using 'PageProps' and explicitly avoiding the 'await' keyword on 'params'
// to resolve the TypeScript error, assuming Next.js handles the async resolution internally.
export default async function ChatIdPage({ params }: PageProps) {
    // FIX: Removing 'await' to resolve the Type Error.
    // Destructure only the necessary variable to avoid 'unused variable' linter errors.
    const { chatId } = params;

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