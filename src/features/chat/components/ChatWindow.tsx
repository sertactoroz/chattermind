'use client';

import React, { useEffect, useRef, useState } from 'react';
import { listMessages, addMessage, MessageRow } from '../services/chatService';
import { subscribeMessages } from '../services/realtime';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { motion } from 'framer-motion';

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
     * Load initial messages and setup realtime subscription.
     * Note: messages state is NOT a dependency, so subscription does NOT recreate on every new message.
     */
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
            }
        })();

        // Setup realtime subscription for new messages
        const sub = subscribeMessages(chatId, (msg: any) => {
            if (!msg) return;

            // Update messages list (deduplicate)
            setMessages(prev => {
                if (prev.some(p => p.id === msg.id)) return prev;
                const next = [...prev, msg];
                next.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                return next;
            });

            // Stop typing indicator when AI message arrives
            if (msg.sender === 'ai') {
                setAiTyping(false);
            }

            scrollToBottom();
        });

        return () => {
            mounted = false;
            sub.unsubscribe();
        };
    }, [chatId, messages]); // ✅ Only recreate subscription when chatId changes

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
     * Handle sending a message.
     * - Optimistically append user message
     * - Trigger AI generation
     * - Manage aiTyping state
     */
    const handleSend = async () => {
        if (!text.trim() || !user) return;
        const content = text.trim();
        setText('');
        setSending(true);

        // Optimistic user message
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
            // Persist user message
            const saved = await addMessage(chatId, 'user', content);
            setMessages(prev => prev.map(m => (m.id === tempId ? saved : m)));

            // Trigger AI generation
            setAiTyping(true);

            // Optional fallback in case AI never responds (10s max)
            const aiTimeout = setTimeout(() => setAiTyping(false), 10000);

            const resp = await fetch('/api/chat/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, userId: user.id, content, characterId }),
            });

            if (!resp.ok) {
                const txt = await resp.text();
                console.error('AI API error', txt);
                setAiTyping(false);
                clearTimeout(aiTimeout);
            }
            // AI response will arrive via realtime subscription
        } catch (err) {
            console.error('send error', err);
            setAiTyping(false);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-[60vh]">
            {/* Message list */}
            <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3">
                {messages.map(m => (
                    <div
                        key={m.id}
                        className={`max-w-[80%] break-words px-3 py-2 rounded-xl ${m.sender === 'user'
                            ? 'ml-auto bg-sky-600 text-white'
                            : 'mr-auto bg-slate-100 text-slate-800'
                            }`}
                    >
                        <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                        <div className="text-[10px] mt-1 text-slate-400">
                            {new Date(m.created_at).toLocaleTimeString()}
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {aiTyping && (
                    <div className="mr-auto bg-slate-100 text-slate-800 px-3 py-2 rounded-xl inline-block">
                        <motion.div
                            initial={{ opacity: 0.6 }}
                            animate={{ opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 0.9 }}
                            className="text-sm"
                        >
                            Typing...
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-3 border-t flex items-center gap-3">
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    placeholder="Write a message..."
                    disabled={sending}
                />
                <button
                    onClick={handleSend}
                    disabled={sending || !text.trim()}
                    className="px-3 py-2 rounded bg-sky-600 text-white min-h-[44px]"
                >
                    {sending ? 'Sending…' : 'Send'}
                </button>
            </div>
        </div>
    );
}
