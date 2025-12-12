'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { createChat } from '@/features/chat/services/chatService';
import Image from 'next/image';
import { toast } from 'sonner';

import characters from '@/features/characters/data/characters.json';
import type { Character } from '@/features/characters/types/character.types';

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

            // Show toast for initial AI message failure
            toast.warning('The character\'s initial message could not be loaded.', {
                description: 'Please send your first message to start the conversation.',
                duration: 5000
            });

            // Non-blocking error: Chat should still open even if initial message fails.
        }
        // AI response is saved to the 'messages' table by the API route.

    } catch (err) {
        console.error('Error during initial AI message fetch', err);

        // Show toast for network/unexpected error during AI call
        toast.warning('An unexpected error occurred while loading the character\'s message.', {
            description: 'The chat was created, but the character may not have sent a greeting yet.',
            duration: 5000
        });
    }
};


export default function ChatNewPage() {
    const { user } = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();

    // State to store the selected character's data using the imported Character type
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    // Solution: Use a reference to track if the chat creation logic has already run.
    // This prevents double execution in React Strict Mode (Development environment).
    const hasCreatedChat = useRef(false);

    useEffect(() => {
        const characterId = searchParams.get('character');

        // Find character data immediately when searchParams is available to update the UI
        if (characterId) {
            // Assert the type of the characters array to Character[] for correct type checking in find()
            const char = (characters as Character[]).find(
                (c) => c.id === characterId
            );

            if (char) {
                // Since 'avatar' is optional in the type, we check if it exists before setting the state.
                // NOTE: If 'avatar' is missing, the image will just show a broken icon.
                setSelectedCharacter(char);
            }
        }

        // Check 1: If the flag is already true (meaning creation has started), prevent running again.
        if (hasCreatedChat.current) {
            return;
        }

        (async () => {
            if (!user) {
                // Redirect unauthenticated users to the home page
                router.push('/');
                return;
            }

            if (!characterId) {
                console.error('Missing character ID in URL');
                // Show error toast before redirect
                toast.error('Character selection failed.', {
                    description: 'The character to start the chat with could not be found.',
                });
                // Redirect back to character selection if ID is missing
                router.replace('/chat/characters');
                return;
            }

            try {
                // Set flag to true before starting the chat creation process.
                hasCreatedChat.current = true;

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

                // Show a critical error toast for chat creation failure
                toast.error('Failed to create chat.', {
                    description: 'An error occurred while setting up the new conversation. Please try again.',
                    duration: 7000
                });

                // Reset the flag on failure to allow re-running if the user tries again.
                hasCreatedChat.current = false;

                // Redirect to the chat list page on failure
                router.replace('/chat');
            }
        })();
    }, [user, router, searchParams]); // Dependencies list ensures effect runs when these values change

    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center flex flex-col items-center">
                {/* Character Image Display and Custom Message */}
                {selectedCharacter ? (
                    <>
                        <div className="relative h-24 w-24 mb-4 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                            {selectedCharacter.avatar && (
                                <Image
                                    src={selectedCharacter.avatar}
                                    alt={selectedCharacter.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="animate-pulse"
                                />
                            )}
                        </div>
                        <h1 className="text-xl font-semibold text-foreground">
                            Creating chat with {selectedCharacter.name}...
                        </h1>
                    </>
                ) : (
                    <>
                        <div className="h-24 w-24 rounded-full bg-secondary animate-pulse mb-4" />
                        <p className="text-foreground">Creating chat...</p>
                    </>
                )}
            </div>
        </div>
    );
}