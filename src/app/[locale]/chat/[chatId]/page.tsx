import ChatWindow from '@/features/chat/containers/ChatWindow';
import AuthGuard from '@/features/auth/components/AuthGuard';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { type Metadata, type NextPage } from 'next';

// Define the shape of your dynamic parameters
type ChatIdPageParams = {
    locale: string;
    chatId: string;
};

// Use the standard Next.js PageProps type with your specific params
type ChatPageProps = {
    // Correctly reference the new params type name
    params: ChatIdPageParams;
    searchParams: { [key: string]: string | string[] | undefined };
};

// Now, update your function signature to use this derived type
export default async function ChatIdPage({ params }: ChatPageProps) {

    // FIX: Await the 'params' object before accessing its properties
    // to resolve the Next.js runtime error "params should be awaited before using its properties."
    const resolvedParams = (await params) as ChatIdPageParams;

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