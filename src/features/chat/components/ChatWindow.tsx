'use client';

import React, { useEffect, useRef, useState } from 'react';
import { listMessages, addMessage } from '../services/chatService';
import { subscribeMessages } from '../services/realtime';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import type { MessageRow } from '../types/chat.types';

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
    // Realtime is kept for incoming messages from other sources (e.g., if we turn this into a multi-user chat later) 
    // but we rely on the API response for our own AI replies.

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
            }
        })();

        // Setup realtime subscription for new messages
        // This subscription is now secondary, used for general updates or unexpected insertions.
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
    }, [chatId]); // Dependency array: ONLY chatId is needed here

    // Handle sending a message.
    // We now rely fully on the API response to deliver the AI message object.

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
            // 1. Persist user message to DB
            const savedUserMsg = await addMessage(chatId, 'user', content);
            // Replace temporary message with the saved user message from DB
            setMessages(prev => prev.map(m => (m.id === tempId ? savedUserMsg : m)));

            // 2. Trigger AI generation and wait for the response (which now contains the full AI message object)
            setAiTyping(true);
            // Scroll again to ensure the "Typing..." indicator is visible at the bottom.
            scrollToBottom();

            const resp = await fetch('/api/chat/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, userId: user.id, content, characterId }),
            });

            if (!resp.ok) {
                const txt = await resp.text();
                console.error('AI API error', txt);
                setAiTyping(false);
                return;
            }

            // 3. Process the AI API response
            const responseData: AIMessageResponse = await resp.json();

            // ❗ Debugging log to see the API response structure
            console.log("AI API Response Data:", responseData);

            let aiMessage = responseData.aiMessage;

            // --- Fallback Mechanism: If the API returns raw text as {ai: "..."} instead of MessageRow ---
            if (!aiMessage && (responseData as any).ai) {
                console.warn("Fallback used: API returned raw text under the 'ai' key instead of the MessageRow object. Manually creating message.");

                // Manually create the message object using the raw text
                aiMessage = {
                    // Use a temporary ID since this message didn't come from the DB .select()
                    id: `fallback-ai-${Date.now()}`,
                    chat_id: chatId,
                    sender: 'ai',
                    content: (responseData as any).ai,
                    created_at: new Date().toISOString(),
                } as MessageRow;
            }
            // --- End of Fallback Mechanism ---

            if (aiMessage) {
                // --- FULL OPTIMISTIC UPDATE FOR AI MESSAGE ---
                // Add the received AI message object directly to the state
                setMessages(prev => [...prev, aiMessage]);
                // Clear the typing indicator immediately
                setAiTyping(false);
                // Scroll to see the new message
                scrollToBottom();
                // --- END OPTIMISTIC UPDATE ---
            } else {
                console.error('AI API response missing aiMessage object. Check API logs for database insertion failure.');
                setAiTyping(false);
            }

        } catch (err) {
            console.error('send error (DB or Network)', err);
            setAiTyping(false);
        } finally {
            setSending(false);
        }
    };

    return (
        // Chat container. The main background is typically set by the body/parent wrapper (bg-background).
        <div className="flex flex-col h-full min-h-[60vh]">
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
            <div className="p-3 border-t border-t-border flex items-center gap-3 ">
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
                <button
                    onClick={handleSend}
                    disabled={sending || aiTyping || !text.trim()} // Disable button while AI is typing
                    // Button styles: bg-primary and text-primary-foreground (central theme color)
                    className="px-3 py-2 rounded bg-primary text-primary-foreground min-h-[44px] hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    {sending ? 'Sending…' : 'Send'}
                </button>
            </div>
        </div>
    );
}