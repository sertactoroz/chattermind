'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { Companion } from '@/features/companions/types/companion.types';

export default function CompanionCard({
    companion,
    onSelect,
    selected,
}: {
    companion: Companion;
    onSelect?: (id: string) => void;
    selected?: boolean;
}) {
    const t = useTranslations('Companions');
    const fallbackRole = useTranslations('CompanionCard')('fallbackRole');

    const roleKey = `${companion.id}_role`;
    const descriptionKey = `${companion.id}_description`;
    const translatedRole = t.has(roleKey) ? t(roleKey) : companion.role;
    const translatedDescription = t.has(descriptionKey) ? t(descriptionKey) : companion.description;

    return (
        <button
            type="button"
            onClick={() => onSelect?.(companion.id)}
            className={cn(
                'relative group cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden',
                'hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30',
                selected
                    ? 'border-primary ring-2 ring-primary/30 shadow-md bg-primary/5'
                    : 'border-border bg-card hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent'
            )}
        >
            {selected && (
                <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
            )}

            <div className="flex flex-col items-center p-4 pt-5">
                <div className="relative w-16 h-16 mb-3">
                    {companion.avatar ? (
                        <Image
                            src={companion.avatar}
                            alt={companion.name}
                            fill
                            sizes="64px"
                            className="rounded-full object-cover ring-2 ring-border group-hover:ring-primary/30 transition-all"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary ring-2 ring-border">
                            {companion.name.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                </div>

                <h3 className="text-sm font-semibold text-foreground text-center truncate w-full">
                    {companion.name}
                </h3>
                <p className="text-xs text-muted-foreground text-center mt-0.5 truncate w-full">
                    {translatedRole || fallbackRole}
                </p>
            </div>

            <div className="px-3 pb-3">
                <p className="text-xs text-muted-foreground line-clamp-2 text-center leading-relaxed">
                    {translatedDescription}
                </p>
            </div>
        </button>
    );
}
