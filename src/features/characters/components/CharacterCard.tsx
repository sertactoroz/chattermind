'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import { Character } from '@/features/characters/types/character.types';

export default function CharacterCard({
    character,
    onSelect,
    selected,
}: {
    // ✅ Tipi merkezi CharacterData olarak güncelledik
    character: Character;
    onSelect?: (id: string) => void;
    selected?: boolean;
}) {
    // Determine card classes based on selection status
    const cardClasses = cn(
        'w-full text-left transition-all cursor-pointer py-0',
        selected
            ? 'ring-2 ring-sky-500 bg-sky-50 shadow-md' // Appearance when selected
            : 'hover:shadow-lg', // Appearance on hover
    );

    return (
        <Card
            onClick={() => onSelect?.(character.id)}
            className={cardClasses}
        >
            <CardContent className="p-4 flex items-start gap-4">

                {/* Avatar Section: w-20 h-auto self-stretch ensures the avatar fills the CardContent height */}
                <Avatar className="w-20 h-auto self-stretch rounded-xl overflow-hidden shrink-0">
                    {character.avatar ? (
                        <AvatarImage
                            src={character.avatar}
                            alt={character.name}
                            // object-cover ensures the image fills the space without distortion
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        // AvatarFallback will automatically stretch to fill the Avatar container height
                        <AvatarFallback className="text-base font-semibold rounded-xl flex items-center justify-center h-full">
                            {character.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>

                {/* Content Section: Flex-1 allows the content to take up the remaining space */}
                <div className="min-w-0 flex-1">
                    <div className="font-semibold text-base">{character.name}</div>

                    {/* ✅ YENİ: Merkezi tipten gelen 'role' bilgisini kullanıyoruz */}
                    <span className='text-muted-foreground'>{character.role || 'AI Assistant'}</span>

                    {/* Description Section: Allows the description to wrap and take up multiple lines */}
                    <div className="text-sm text-slate-500 mt-1">
                        {character.description}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}