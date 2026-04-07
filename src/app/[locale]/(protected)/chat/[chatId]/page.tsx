import ChatWindow from '@/features/chat/containers/ChatWindow';
import NotFoundToast from '@/features/common/components/NotFoundToast';
import { supabaseAdmin } from '@/lib/supabaseServer';
import type { Character } from '@/features/characters/types/character.types';

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

        let character: Character | null = null;
        if (characterId) {
            const { data: charData, error: charError } = await supabaseAdmin
                .from('characters')
                .select('*')
                .eq('id', characterId)
                .maybeSingle();

            if (charError) console.error('Character fetch error:', charError);
            character = charData as Character ?? null;
        }

        return (
            <ChatWindow
                chatId={chatId}
                characterId={characterId}
                character={character}
            />
        );

    } catch (err) {
        console.error('Chat page error:', err);
        return (
            <div className="flex items-center justify-center flex-1">
                <NotFoundToast />
            </div>
        );
    }
}