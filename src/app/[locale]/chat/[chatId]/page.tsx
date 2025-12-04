import ChatWindow from '@/features/chat/containers/ChatWindow';
import AuthGuard from '@/features/auth/components/AuthGuard';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { supabaseAdmin } from '@/lib/supabaseServer';

// 1. Define the resolved types for the expected parameters
type ChatPageResolvedParams = {
    locale: string; // Including the [locale] segment based on the URL structure
    chatId: string;
};

type ChatPageSearchParams = {
    [key: string]: string | string[] | undefined
};

// 2. Define the Props type, declaring both params and searchParams as Promises
// This satisfies the Next.js App Router constraint for async Server Components.
type ChatPageProps = {
    params: Promise<ChatPageResolvedParams>;
    searchParams: Promise<ChatPageSearchParams>;
};

// Next.js Server Component
export default async function ChatIdPage({ params, searchParams }: ChatPageProps) {

    // 3. Await both props to satisfy the Next.js runtime check (sync dynamic APIs usage)
    const resolvedParams = await params;

    // searchParams must be awaited even if unused, to resolve the Promise constraint.
    // const resolvedSearchParams = await searchParams; 

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
        // Log the error during runtime 
        // eslint-disable-next-line no-console
        console.error('chat page error', err);
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <NotFoundToast />
            </div>
        );
    }
}