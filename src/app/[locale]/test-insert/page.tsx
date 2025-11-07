'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestInsert() {
    const [chatId, setChatId] = useState('');
    const [text, setText] = useState('Hello from test page');

    const insertMessage = async () => {
        if (!chatId) {
            alert('Please enter chatId');
            return;
        }
        const { data, error } = await supabase
            .from('messages')
            .insert([{ chat_id: chatId, sender: 'ai', content: text }])
            .select()
            .single();
        if (error) {
            console.error(error);
            alert('Insert error: ' + error.message);
        } else {
            alert('Inserted message id: ' + data.id);
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center p-6">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
                <h2 className="font-semibold mb-3">Test Insert Message</h2>
                <label className="block text-xs text-slate-600">Chat ID</label>
                <input value={chatId} onChange={e => setChatId(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" placeholder="paste chat id here" />
                <label className="block text-xs text-slate-600">Message</label>
                <input value={text} onChange={e => setText(e.target.value)} className="w-full border rounded px-3 py-2 mb-4" />
                <button onClick={insertMessage} className="w-full bg-sky-600 text-white py-2 rounded">Insert message</button>
                <p className="mt-3 text-xs text-slate-400">Open chat window in another tab to see realtime arrival.</p>
            </div>
        </div>
    );
}
