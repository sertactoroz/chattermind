'use client';

import React, { useEffect, useRef, useState } from 'react';
import { listMessages, addMessage } from '../services/chatService';
import { subscribeMessages } from '../services/realtime';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import MessageItem from '../components/MessageItem';
import TypingIndicator from '../components/TypingIndicator';
import type { MessageRow } from '../types/chat.types';
import { toast } from 'sonner';
import { SendButton } from '../components/SendButton';

// Define the structure expected from the AI API response
type AIMessageResponse = {
    aiMessage: MessageRow;
};

type Props = {
    chatId: string;
    characterId?: string | null;
};

export default function ChatWindow({ chatId, characterId }: Props) {
    const { user } = useAuthContext();
    const [messages, setMessages] = useState<MessageRow[]>([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [aiTyping, setAiTyping] = useState(false);
    const listRef = useRef<HTMLDivElement | null>(null);

    /**
     * Smooth scroll to the bottom of the chat list.
     */
    const scrollToBottom = () => {
        // Use requestAnimationFrame for smooth and non-blocking scrolling
        requestAnimationFrame(() => {
            if (!listRef.current) return;
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
        });
    };

    // Load initial messages and setup realtime subscription.
    useEffect(() => {
        if (!chatId) return;
        let mounted = true;

        // Load initial messages
        (async () => {
            try {
                const rows = await listMessages(chatId);
                if (!mounted) return;
                setMessages(rows);
                // Scroll after initial load
                scrollToBottom();
            } catch (err) {
                console.error('listMessages error', err);
                // Show error toast on failure to load messages
                toast.error('Failed to load chat history.', {
                    description: 'The messages for this conversation could not be retrieved.',
                });
            }
        })();

        // Setup realtime subscription for new messages
        const sub = subscribeMessages(chatId, (msg: MessageRow) => {
            if (!msg) return;

            // Update messages list: add new message and ensure correct sorting/deduplication
            setMessages(prev => {
                // Ensure message is not already present (crucial for deduplicating API response vs Realtime)
                if (prev.some(p => p.id === msg.id)) return prev;

                const next = [...prev, msg];
                next.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                return next;
            });

            // If the AI message arrives via Realtime, it's a good safety check, but API handles the primary flow.
            if (msg.sender === 'ai') {
                setAiTyping(false);
            }

            scrollToBottom();
        });

        return () => {
            mounted = false;
            sub.unsubscribe();
        };
    }, [chatId]);

    // Handle sending a message.
    const handleSend = async () => {
        if (!text.trim() || !user) return;
        const content = text.trim();
        setText('');
        setSending(true);

        // --- Optimistic Update for User Message (TEMP ID) ---
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: MessageRow = {
            id: tempId,
            chat_id: chatId,
            sender: 'user',
            content,
            created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMsg]);
        scrollToBottom(); // Scroll after the user message is added

        try {
            let savedUserMsg: MessageRow;
            try {
                // 1. Persist user message to DB
                savedUserMsg = await addMessage(chatId, 'user', content);
                // Replace temporary message with the saved user message from DB
                setMessages(prev => prev.map(m => (m.id === tempId ? savedUserMsg : m)));
            } catch (dbErr) {
                console.error('DB save user message error', dbErr);
                // Remove the optimistic message on DB error
                setMessages(prev => prev.filter(m => m.id !== tempId));
                // Show error toast for message sending failure
                toast.error('Failed to send message.', {
                    description: 'Your message could not be saved to the database.',
                });
                setSending(false);
                return; // Stop the process here
            }

            // 2. Trigger AI generation and wait for the response
            setAiTyping(true);
            scrollToBottom(); // Scroll again to ensure the "Typing..." indicator is visible at the bottom.

            const resp = await fetch('/api/chat/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, userId: user.id, content, characterId }),
            });
            console.log('RESPONSE', resp);

            if (!resp.ok) {
                const txt = await resp.text();
                console.error('AI API error', txt);
                // Show error toast for AI response failure
                toast.error('AI response failed.', {
                    description: 'The character could not generate a reply. Please try again.',
                });
                setAiTyping(false);
                return;
            }

            // 3. Process the AI API response
            const responseData: AIMessageResponse = await resp.json();
            let aiMessage = responseData.aiMessage;

            // --- Fallback Mechanism & Error Check ---
            if (!aiMessage && (responseData as any).ai) {
                console.warn("Fallback used: API returned raw text. Manually creating message.");
                // Manually create the message object using the raw text
                aiMessage = {
                    id: `fallback-ai-${Date.now()}`,
                    chat_id: chatId,
                    sender: 'ai',
                    content: (responseData as any).ai,
                    created_at: new Date().toISOString(),
                } as MessageRow;
            } else if (!aiMessage) {
                console.error('AI API response missing aiMessage object. Check API logs.');
                // Show warning toast for missing AI message object
                toast.warning('AI response delivered, but message failed to save.', {
                    description: 'You may need to refresh the chat.',
                });
                setAiTyping(false);
                return;
            }
            // --- End of Fallback Mechanism & Error Check ---

            // --- FULL OPTIMISTIC UPDATE FOR AI MESSAGE ---
            setMessages(prev => [...prev, aiMessage]);
            setAiTyping(false);
            scrollToBottom();
            // --- END OPTIMISTIC UPDATE ---

        } catch (err) {
            console.error('send error (Network)', err);
            // Show generic network error toast
            toast.error('Network Error.', {
                description: 'Could not communicate with the server. Check your connection.',
            });
            setAiTyping(false);
        } finally {
            setSending(false);
        }
    };

    return (
        // Chat container 
        <div className="flex flex-col h-full">
            {/* Message list */}
            <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3">
                {messages.map(m => (
                    // MessageItem handles its own theme styling (bg-primary/bg-muted)
                    <MessageItem key={m.id} message={m} />
                ))}
                {aiTyping && <TypingIndicator />}
            </div>
            {/* Input Section - Theme-aware border and background */}
            {/* border-t -> border-t-border; bg-background ensures the input area matches the page theme */}
            <div className="p-3 border-t border-t-border flex items-center gap-3 bg-background">
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    // Input styles: border-input, bg-background, text-foreground, focus-visible:ring-ring for theme consistency
                    className="flex-1 rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm 
                                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Write a message..."
                    disabled={sending || aiTyping} // Disable input while sending or AI is typing
                />
                <SendButton
                    onSend={handleSend}
                    isEmpty={!text.trim()}
                    aiTyping={aiTyping}
                    loading={sending}
                />
            </div>
        </div>
    );
}