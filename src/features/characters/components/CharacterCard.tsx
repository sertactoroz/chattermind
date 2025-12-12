'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

import { Character } from '@/features/characters/types/character.types';

export default function CharacterCard({
    character,
    onSelect,
    selected,
}: {
    character: Character;
    onSelect?: (id: string) => void;
    selected?: boolean;
}) {
    // We use the 'Characters' namespace to pull translated role and description
    const t = useTranslations('Characters');
    const fallbackRole = useTranslations('CharacterCard')('fallbackRole');

    // Determine card classes based on selection status
    const cardClasses = cn(
        'w-full text-left transition-all cursor-pointer py-0',
        selected
            ? // Appearance when selected: Use a subtle accent background and a sky-ring
            'ring-2 ring-sky-500 bg-accent/30 shadow-md'
            : // Appearance on hover: Use hover:bg-muted to make the card visibly lift/change color
            'hover:bg-accent hover:shadow-lg bg-card',
    );

    // Translation keys for dynamic content
    const roleKey = `${character.id}_role`;
    const descriptionKey = `${character.id}_description`;

    // Fetch translated text. If the key doesn't exist, it defaults to the original text in the JSON (or an empty string).
    // The role/description texts were added to 'Characters' namespace in the previous step.
    const translatedRole = t.raw(roleKey) ? t(roleKey) : character.role;
    const translatedDescription = t.raw(descriptionKey) ? t(descriptionKey) : character.description;


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
                    <div className="font-semibold text-base text-foreground">{character.name}</div>
                    <span className='text-muted-foreground'>{translatedRole || fallbackRole}</span>
                    <div className="text-sm text-muted-foreground mt-1"> {translatedDescription}</div>
                </div>
            </CardContent>
        </Card>
    );
}