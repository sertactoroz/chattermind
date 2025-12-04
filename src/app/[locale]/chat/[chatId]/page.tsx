import ChatWindow from '@/features/chat/containers/ChatWindow';
import AuthGuard from '@/features/auth/components/AuthGuard';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { supabaseAdmin } from '@/lib/supabaseServer';

// 1. Define the resolved types for the parameters after the promise resolves
type ChatPageResolvedParams = {
    locale: string; // Dynamic segment from /app/[locale]
    chatId: string; // Dynamic segment from /chat/[chatId]
};

type ChatPageSearchParams = {
    [key: string]: string | string[] | undefined
};

// 2. Define the Props type, declaring both params and searchParams as Promises.
// This is the CRITICAL fix to satisfy the Next.js PageProps type constraint 
// for arguments passed to an async Server Component.
type ChatPageProps = {
    params: Promise<ChatPageResolvedParams>;
    searchParams: Promise<ChatPageSearchParams>;
};

// Next.js Async Server Component
export default async function ChatIdPage({ params, searchParams }: ChatPageProps) {

    // 3. Await both props to satisfy the Next.js runtime check 
    // This resolves the runtime error: "params should be awaited before using its properties."
    const resolvedParams = await params;

    // searchParams must be awaited to resolve the Promise constraint, even if unused.
    const resolvedSearchParams = await searchParams;

    // Destructure the necessary variable from the AWAITED object
    const { chatId } = resolvedParams;

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

        console.error('chat page error', err);
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <NotFoundToast />
            </div>
        );
    }
}