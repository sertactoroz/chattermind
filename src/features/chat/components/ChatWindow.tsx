'use client';
import React, { useEffect, useRef, useState } from 'react';
import { subscribeMessages } from '../services/realtime';
import { addMessage } from '../services/chatService';
import { supabase } from '@/lib/supabaseClient';

export default function ChatWindow({ chatId, userId, character }: { chatId: string; userId: string; character?: any }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState('');
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!chatId) return;
        // initial load
        const load = async () => {
            const { data } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
            setMessages(data ?? []);
            scrollToBottom();
        };
        load();

        // subscribe
        const sub = subscribeMessages(chatId, (msg) => {
            console.log('Realtime message arrived:', msg);
            setMessages(prev => [...prev, msg]);
            scrollToBottom();
        });

        return () => {
            sub.unsubscribe();
        };
    }, [chatId]);

    const scrollToBottom = () => {
        requestAnimationFrame(() => listRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }));
    };

    const handleSend = async () => {
        if (!text.trim()) return;
        const content = text.trim();
        setText('');
        await addMessage(chatId, 'user', content);
        // not waiting for LLM here
    };

    return (
        <div className="flex flex-col h-full">
            <div ref={listRef} className="overflow-auto p-4 flex-1 space-y-3">
                {messages.map(m => (
                    <div key={m.id} className={`max-w-[80%] ${m.sender === 'user' ? 'ml-auto bg-sky-600 text-white' : 'mr-auto bg-slate-100 text-slate-800'} px-3 py-2 rounded-xl`}>
                        <div className="text-sm">{m.content}</div>
                        <div className="text-xs text-slate-400 mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t flex items-center gap-3">
                <input value={text} onChange={e => setText(e.target.value)} className="flex-1 rounded-lg border px-3 py-2" placeholder="Write a message..." />
                <button onClick={handleSend} className="px-3 py-2 rounded bg-sky-600 text-white">Send</button>
            </div>
        </div>
    );
}
