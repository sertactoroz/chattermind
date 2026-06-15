'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { createChat } from '@/features/chat/services/chatService';
import { api } from '@/lib/api';
import Image from 'next/image';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import type { Companion } from '@/features/companions/types/companion.types';

const sendInitialAIPrompt = async (chatId: string, characterId: string, userId: string) => {
    try {
        await api.post('/api/chat/ai', {
            chatId,
            content: 'Generate the character\'s opening message to start the conversation.',
            characterId,
            userId
        });
    } catch (err) {
        console.error('Error during initial AI message fetch', err);
        toast.warning('An unexpected error occurred while loading the companion\'s message.', {
            description: 'The chat was created, but the companion may not have sent a greeting yet.',
            duration: 5000
        });
    }
};

async function fetchCompanion(characterId: string): Promise<Companion | null> {
    try {
        const data = await api.get<{ companion: { id: string; name: string; description: string; language: string } }>(`/api/companion/${characterId}`);
        return {
            id: data.companion.id,
            name: data.companion.name,
            description: data.companion.description,
            language: data.companion.language,
            promptKey: data.companion.id.toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_PROMPT',
        };
    } catch {
        return null;
    }
}

export default function ChatNewPage() {
    const { user } = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('ChatNew');

    const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
    const hasCreatedChat = useRef(false);

    useEffect(() => {
        const characterId = searchParams.get('character');

        if (characterId) {
            fetchCompanion(characterId).then(comp => {
                if (comp) setSelectedCompanion(comp);
            });
        }

        if (hasCreatedChat.current) return;

        (async () => {
            if (!user) {
                router.push('/');
                return;
            }

            if (!characterId) {
                toast.error('Companion selection failed.', {
                    description: 'The companion to start the chat with could not be found.',
                });
                router.replace('/companions');
                return;
            }

            try {
                hasCreatedChat.current = true;
                const chat = await createChat(user.id, characterId, 'New chat');
                await sendInitialAIPrompt(chat.id, characterId, user.id);
                router.replace(`/chat/${chat.id}`);
            } catch (err) {
                console.error('Failed to create chat or initial message:', err);
                toast.error('Failed to create chat.', {
                    description: 'An error occurred while setting up the new conversation. Please try again.',
                    duration: 7000
                });
                hasCreatedChat.current = false;
                router.replace('/chat');
            }
        })();
    }, [user, router, searchParams]);

    return (
        <div className="flex items-center justify-center h-full animate-in fade-in duration-500">
            <div className="text-center flex flex-col items-center">
                {selectedCompanion ? (
                    <>
                        <div className="relative mb-6">
                            <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-primary/30 shadow-xl">
                                {selectedCompanion.avatar && (
                                    <Image
                                        src={selectedCompanion.avatar}
                                        alt={selectedCompanion.name}
                                        fill
                                        sizes="112px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center animate-spin [animation-duration:2s]">
                                <svg className="w-3.5 h-3.5 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-lg font-semibold text-foreground mb-1">
                            {selectedCompanion.name}
                        </h1>
                        <p className="text-sm text-muted-foreground mb-6">
                            {selectedCompanion.role}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="flex gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                            </div>
                            <span>{t('preparing_conversation')}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="h-28 w-28 rounded-full bg-secondary animate-pulse mb-6" />
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <div className="flex gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                            </div>
                            <span>{t('loading')}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
