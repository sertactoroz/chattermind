'use client';

import React, { useState } from 'react';
import characters from '../data/characters.json';
import CharacterCard from './CharacterCard';
import { useRouter } from 'next/navigation';

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
            // Using a theme-friendly alert or toast is recommended in a real app
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
            {/* Header text color: text-foreground ensures the text adapts to the theme. */}
            <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Choose a Character</h2>

            {/* Character List */}
            <div className="space-y-3 mb-6">
                {/* CharacterCard components should handle their own theme styling (bg-card, border-border, active state) */}
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
                // Default Button variant uses bg-primary and text-primary-foreground, which should be theme-aware.
                >
                    {loading ? 'Starting Chat...' : 'Start chat with selected character'}
                </Button>

                {/* Secondary Button */}
                {/* Button variant="outline" is theme-aware (uses border-input, text-foreground, hover:bg-accent) */}
                {/* <Button
                    onClick={() => router.push('/chat')}
                    variant="outline" // Use the 'outline' variant for the secondary action
                    disabled={loading}
                >
                    Cancel
                </Button> */}
            </div>
        </div>
    );
}