'use client';

import React, { useState } from 'react';
import characters from '../data/characters.json';
import CharacterCard from './CharacterCard';
import { useRouter } from 'next/navigation';

export default function CharacterList() {
    const [selected, setSelected] = useState<string | null>(null);
    const router = useRouter();

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleStartChat = () => {
        if (!selected) {
            alert('Please select a character first.');
            return;
        }
        // Redirect to chat/new with selected character as query param
        router.push(`/chat/new?character=${selected}`);
    };

    return (
        <div className="px-4 py-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">Choose a character</h2>
            <div className="space-y-3 mb-6">
                {characters.map((c: any) => (
                    <CharacterCard key={c.id} character={c} onSelect={handleSelect} selected={selected === c.id} />
                ))}
            </div>

            <div className="flex gap-3">
                <button onClick={handleStartChat} className="flex-1 bg-sky-600 text-white py-2 rounded-lg">
                    Start chat with selected character
                </button>
                <button onClick={() => router.push('/chat')} className="px-3 py-2 rounded-lg border">
                    Cancel
                </button>
            </div>
        </div>
    );
}
