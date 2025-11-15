'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { createChat } from '@/features/chat/services/chatService';

// Function to send the initial prompt to the AI to generate the character's opening message
const sendInitialAIPrompt = async (chatId: string, characterId: string) => {
    try {
        // We use a specific content string to signal the AI API that this is an initial message
        // and it should not be saved as a user message.
        const INIT_PROMPT_CONTENT = 'Generate the character\'s opening message to start the conversation.';

        const response = await fetch('/api/chat/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chatId,
                content: INIT_PROMPT_CONTENT,
                characterId
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to get initial AI message:', errorText);
            // Non-blocking error: Chat should still open even if initial message fails.
        }
        // AI response is saved to the 'messages' table by the API route.

    } catch (err) {
        console.error('Error during initial AI message fetch', err);
    }
};


export default function ChatNewPage() {
    const { user } = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        (async () => {
            if (!user) {
                // Redirect unauthenticated users to the home page
                router.push('/');
                return;
            }

            // Get character ID from the URL query parameter
            const characterId = searchParams.get('character');

            if (!characterId) {
                console.error('Missing character ID in URL');
                // Redirect back to character selection if ID is missing
                router.replace('/chat/select-character');
                return;
            }

            try {
                // 1. Create a new chat row in the database, including characterId
                // The title is set to a default value 'New chat'
                const chat = await createChat(user.id, characterId, 'New chat');

                // 2. Trigger the AI to send the first message.
                // We AWAIT this to ensure the character's message is saved before redirecting the user.
                await sendInitialAIPrompt(chat.id, characterId);

                // 3. Redirect the user to the newly created chat page
                router.replace(`/chat/${chat.id}`);

            } catch (err) {
                console.error('Failed to create chat or initial message:', err);
                // Redirect to the chat list page on failure
                router.replace('/chat');
            }
        })();
    }, [user, router, searchParams]); // Dependencies list ensures effect runs when these values change

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
                <p className="mb-2">Creating chat…</p>
                {/* Simple loading indicator */}
                <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse mx-auto" />
            </div>
        </div>
    );
}