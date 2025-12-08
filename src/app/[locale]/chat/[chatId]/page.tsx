import ChatWindow from '@/features/chat/containers/ChatWindow';
import AuthGuard from '@/features/auth/components/AuthGuard';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { supabaseAdmin } from '@/lib/supabaseServer';

type Props = {
    params: Promise<{ chatId: string }>;
};

export default async function ChatIdPage({ params }: Props) {
    const { chatId } = await params;

    try {
        const { data, error } = await supabaseAdmin
            .from('chats')
            .select('id, title, character_id')
            .eq('id', chatId)
            .limit(1)
            .single();

        if (error || !data) {
            return (
                <div className="flex items-center justify-center flex-1">
                    <NotFoundToast />
                </div>
            );
        }

        const characterId = data.character_id ?? null;

        return (
            <AuthGuard>
                <ChatWindow chatId={chatId} characterId={characterId} />
            </AuthGuard>
        );
    } catch (err) {
        console.error('chat page error', err);
        return (
            <div className="flex items-center justify-center flex-1">
                <NotFoundToast />
            </div>
        );
    }
}