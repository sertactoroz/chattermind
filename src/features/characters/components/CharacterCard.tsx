'use client';

import Image from 'next/image';
import React from 'react';

type Character = {
    id: string;
    name: string;
    avatar?: string;
    description?: string;
};

export default function CharacterCard({
    character,
    onSelect,
    selected,
}: {
    character: Character;
    onSelect?: (id: string) => void;
    selected?: boolean;
}) {
    return (
        <button
            onClick={() => onSelect?.(character.id)}
            className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-4 ${selected ? 'ring-2 ring-sky-500 bg-sky-50' : 'hover:shadow-sm'
                }`}
        >
            <div className="w-20 h-30 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                {character.avatar ? (
                    <Image
                        src={character.avatar}
                        alt={character.name}
                        width={80}
                        height={80}
                        className="object-cover"
                    />
                ) : (
                    <div className="text-base font-semibold">
                        {character.name.slice(0, 2).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="font-semibold text-base">{character.name}</div>
                <div className="text-sm text-slate-500 truncate">
                    {character.description}
                </div>
            </div>
        </button>
    );
}
