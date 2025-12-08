'use client';

import React, { useState, useRef } from 'react';
import characters from '../data/characters.json';
import CharacterCard from './CharacterCard';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function CharacterList() {
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const buttonRef = useRef<HTMLDivElement>(null);

    const handleSelect = (id: string) => {
        setSelected(id);

        // Scroll to button with extra space below
        setTimeout(() => {
            if (buttonRef.current) {
                const scrollableParent = document.querySelector('main');
                if (scrollableParent) {
                    const buttonPosition = buttonRef.current.offsetTop;
                    const extraSpace = 100; // Ekstra boşluk (piksel cinsinden)

                    scrollableParent.scrollTo({
                        top: buttonPosition + extraSpace,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback
                    buttonRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center' // veya 'end'
                    });
                }
            }
        }, 100);
    };

    const handleStartChat = () => {
        if (!selected) {
            alert('Please select a character first.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            router.push(`/chat/new?character=${selected}`);
        }, 500);
    };

    return (
        <div className="p-4 max-w-md mx-auto">
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
            <div ref={buttonRef} className="flex gap-3">
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
        </div>
    );
}