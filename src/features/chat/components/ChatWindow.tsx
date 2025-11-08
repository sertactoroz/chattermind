'use client';

import React, { useEffect, useRef, useState } from 'react';
import { listMessages, addMessage, MessageRow } from '../services/chatService';
import { subscribeMessages } from '../services/realtime'; // senin realtime util
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

    useEffect(() => {
        if (!chatId) return;
        let mounted = true;

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

        const sub = subscribeMessages(chatId, (msg: any) => {
            // supabase payload shape may be payload.new
            const m = (msg.record ?? msg) as MessageRow;
            // avoid duplicates (very simple dedupe)
            setMessages(prev => {
                if (prev.find(p => p.id === m.id)) return prev;
                return [...prev, m];
            });
            scrollToBottom();
        });

        return () => {
            mounted = false;
            sub.unsubscribe();
        };
    }, [chatId]);

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            if (!listRef.current) return;
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
        });
    };

    const handleSend = async () => {
        if (!text.trim() || !user) return;
        const content = text.trim();
        setText('');
        setSending(true);

        // optimistic local add (temporary id)
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
            // persist user message
            const saved = await addMessage(chatId, 'user', content);
            // replace temp message id with saved id
            setMessages(prev => prev.map(m => (m.id === tempId ? saved : m)));

            // trigger AI response via server API (non-blocking)
            setAiTyping(true);
            await fetch('/api/chat/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, userId: user.id, content, characterId }),
            });
            // server will write AI message; realtime subscription will append it
        } catch (err) {
            console.error('send error', err);
            // show inline error (simplest)
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    chat_id: chatId,
                    sender: 'ai',
                    content: 'Failed to send message. Please try again.',
                    created_at: new Date().toISOString(),
                } as MessageRow,
            ]);
        } finally {
            setSending(false);
            // aiTyping will be cleared when AI message arrives; fallback timeout:
            setTimeout(() => setAiTyping(false), 5000);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-[60vh]">
            <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3">
                {messages.map(m => (
                    <div key={m.id} className={`max-w-[80%] break-words ${m.sender === 'user' ? 'ml-auto bg-sky-600 text-white' : 'mr-auto bg-slate-100 text-slate-800'} px-3 py-2 rounded-xl`}>
                        <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                        <div className="text-[10px] mt-1 text-slate-400">{new Date(m.created_at).toLocaleTimeString()}</div>
                    </div>
                ))}

                {aiTyping && (
                    <div className="mr-auto bg-slate-100 text-slate-800 px-3 py-2 rounded-xl inline-block">
                        <motion.div initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 0.9 }} className="text-sm">
                            Typing...
                        </motion.div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t flex items-center gap-3">
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
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
