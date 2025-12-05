'use client';

import React, { useState } from 'react';
import characters from '../data/characters.json';
import CharacterCard from './CharacterCard';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function CharacterList() {
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const handleSelect = (id: string) => {
        setSelected(id);
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    };

    const handleStartChat = () => {
        if (!selected) {
            alert('Please select a character first.');
            return;
        }

        setLoading(true);
        // Simulate an asynchronous operation before navigating
        setTimeout(() => {
            // Redirect to chat/new with selected character as query param
            router.push(`/chat/new?character=${selected}`);
        }, 500);
    };

    return (
        <div className="px-4 py-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Choose a Character</h2>

            {/* Character List */}
            <div className="space-y-3 mb-6">
                {characters.map((c: any) => (
                    <CharacterCard
                        key={c.id}
                        character={c}
                        onSelect={handleSelect}
                        selected={selected === c.id}
                    />
                ))}
            </div>

            {/* Action Buttons using shadcn/ui Button */}
            <div className="flex gap-3">
                <Button
                    onClick={handleStartChat}
                    className="flex-1 bg-brand-500 text-foreground dark:bg-brand-500 dark:text-gray-100 
                                h-8 w-8 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center cursor-pointer 
                                transition-colors hover:bg-brand-600 dark:hover:bg-brand-400"
                    disabled={!selected || loading}
                >
                    {loading ? 'Starting Chat...' : 'Start chat with selected character'}
                </Button>
            </div>
        </div >
    );
}