'use client';

import React, { useState } from 'react';
import characters from '../data/characters.json';
import CharacterCard from './CharacterCard';
import { useRouter } from 'next/navigation';

// Import shadcn/ui Button component
import { Button } from '@/components/ui/button';

export default function CharacterList() {
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Added loading state for demonstration
    const router = useRouter();

    const handleSelect = (id: string) => {
        setSelected(id);
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
            <h2 className="text-2xl font-bold mb-6 text-center">Choose a Character</h2>

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
                    className="flex-1" // Make the button take up available space
                    disabled={!selected || loading} // Disable if no character is selected or if loading
                >
                    {loading ? 'Starting Chat...' : 'Start chat with selected character'}
                </Button>

                {/* Secondary Button */}
                <Button
                    onClick={() => router.push('/chat')}
                    variant="outline" // Use the 'outline' variant for the secondary action
                    disabled={loading}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}