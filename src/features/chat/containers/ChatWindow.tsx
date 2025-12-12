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
import { useTranslations } from 'next-intl'; // Import useTranslations

type AIMessageResponse = {
    aiMessage: MessageRow;
};

type Props = {
    chatId: string;
    characterId?: string | null;
};

export default function ChatWindow({ chatId, characterId }: Props) {
    const t = useTranslations('ChatWindow'); // Initialize translations
    const { user } = useAuthContext();
    const [messages, setMessages] = useState<MessageRow[]>([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [aiTyping, setAiTyping] = useState(false);
    const listRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // State to track if the user is currently scrolled to the bottom (for smart scrolling).
    const [isAtBottom, setIsAtBottom] = useState(true);

    /**
     * Smooth scroll to the bottom of the chat list.
     */
    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            if (!listRef.current) return;
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
        });
    };

    /**
     * Checks if the user is currently scrolled to the bottom.
     * @returns {boolean} True if scrolled to bottom (with a small tolerance), false otherwise.
     */
    const checkScrollPosition = (): boolean => {
        if (!listRef.current) return false;
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        // Use a small tolerance (e.g., 5 pixels) for better UX
        const tolerance = 5;
        return scrollHeight - clientHeight - scrollTop <= tolerance;
    };

    /**
     * Auto resize textarea height based on content, up to the CSS max-height limit.
     * Ensures the internal scroll remains at the bottom to show the latest input line 
     * when the max height is reached.
     */
    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;

        // 1. Reset height to calculate the correct scrollHeight
        el.style.height = "auto";

        // 2. Apply calculated height (CSS max-height will limit this if scrollHeight is too big)
        el.style.height = `${el.scrollHeight}px`;

        // 3. CRITICAL: If the textarea content exceeds the visible area (max-height hit), 
        // scroll its internal content to the bottom so the user sees the latest line typed.
        if (el.scrollHeight > el.clientHeight) {
            el.scrollTop = el.scrollHeight;
        }
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
                scrollToBottom();
            } catch (err) {
                console.error('listMessages error', err);
                toast.error(t('toast_loadHistoryFailed_title'), {
                    description: t('toast_loadHistoryFailed_desc'),
                });
            }
        })();

        // Setup realtime subscription for new messages
        const sub = subscribeMessages(chatId, (msg: MessageRow) => {
            if (!msg) return;

            setMessages(prev => {
                if (prev.some(p => p.id === msg.id)) return prev;
                const next = [...prev, msg];
                next.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                return next;
            });

            if (msg.sender === 'ai') {
                setAiTyping(false);
            }

            // Smart Scroll: Only scroll if the user was already at the bottom when the message arrived.
            if (checkScrollPosition()) {
                scrollToBottom();
            }
        });

        return () => {
            mounted = false;
            sub.unsubscribe();
        };
    }, [chatId, t]); // Added t to dependency array

    // Handle sending a message.
    const handleSend = async () => {
        if (!text.trim() || !user) return;
        const content = text.trim();
        setText('');
        autoResize();
        // Unconditional scroll after sending to ensure user sees their sent message (which is added optimistically)
        scrollToBottom();
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
        scrollToBottom();

        try {
            let savedUserMsg: MessageRow;
            try {
                // 1. Persist user message to DB
                savedUserMsg = await addMessage(chatId, 'user', content);
                setMessages(prev => prev.map(m => (m.id === tempId ? savedUserMsg : m)));
            } catch (dbErr) {
                console.error('DB save user message error', dbErr);
                setMessages(prev => prev.filter(m => m.id !== tempId));
                toast.error(t('toast_sendFailed_title'), { description: t('toast_sendFailed_desc') });
                setSending(false);
                return;
            }

            // 2. Trigger AI generation and wait for the response
            setAiTyping(true);
            scrollToBottom();

            const resp = await fetch('/api/chat/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, userId: user.id, content, characterId }),
            });

            if (!resp.ok) {
                const txt = await resp.text();
                console.error('AI API error', txt);
                toast.error(t('toast_aiFailed_title'), { description: t('toast_aiFailed_desc') });
                setAiTyping(false);
                return;
            }

            // 3. Process the AI API response
            const responseData: any = await resp.json();
            let aiMessage = responseData.aiMessage;

            // --- Fallback Mechanism & Error Check ---
            if (!aiMessage && (responseData as any).ai) {
                console.warn("Fallback used: API returned raw text. Manually creating message.");
                aiMessage = {
                    id: `fallback-ai-${Date.now()}`,
                    chat_id: chatId,
                    sender: 'ai',
                    content: (responseData as any).ai,
                    created_at: new Date().toISOString(),
                } as MessageRow;
            } else if (!aiMessage) {
                console.error('AI API response missing aiMessage object. Check API logs.');
                toast.warning(t('toast_aiPartial_title'), { description: t('toast_aiPartial_desc') });
                setAiTyping(false);
                return;
            }

            // --- FULL OPTIMISTIC UPDATE FOR AI MESSAGE ---
            setMessages(prev => [...prev, aiMessage]);
            setAiTyping(false);
            scrollToBottom();

        } catch (err) {
            console.error('send error (Network)', err);
            toast.error(t('toast_networkError_title'), { description: t('toast_networkError_desc') });
            setAiTyping(false);
        } finally {
            setSending(false);
        }
    };

    return (
        // Chat container (Flex Container: Ensures full height and column layout)
        <div className="flex flex-col h-full pb-4">

            {/* Message list (Flex Item: Shrinks as input grows, allows scrolling) */}
            <div
                ref={listRef}
                // flex-1: Allows it to take available space and shrink.
                // min-h-0: CRITICAL for Flexbox to allow shrinking below content height.
                className="flex-1 overflow-auto p-4 space-y-3 min-h-0"
                // Listen for scroll events to update smart scrolling state
                onScroll={() => setIsAtBottom(checkScrollPosition())}
            >
                {messages.map(m => (
                    <MessageItem key={m.id} message={m} />
                ))}
                {aiTyping && <TypingIndicator />}
            </div>

            {/* Input Section (Flex Item: Fixed height determined by content/textarea) */}
            <div className="p-3 border-t border-t-border flex items-center gap-3 bg-background">

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={e => {
                        setText(e.target.value);
                        autoResize();

                        // Smart scroll: Only scroll to bottom if the user was already at the bottom (`isAtBottom`).
                        if (isAtBottom) {
                            scrollToBottom();
                        }
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    rows={1}
                    // max-h-52 (e.g., ~8 lines) limits growth. 
                    // overflow-y-auto ensures internal scroll when max height is hit.
                    className="flex-1 resize-none overflow-y-auto rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm 
                                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring max-h-52"
                    placeholder={t('placeholder')}
                    disabled={sending || aiTyping}
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