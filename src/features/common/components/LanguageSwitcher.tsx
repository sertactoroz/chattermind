'use client';

import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
const LOCALES = [
    { code: 'tr', label: 'TR', name: 'Türkçe' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'de', label: 'DE', name: 'Deutsch' },
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = async (newLocale: string) => {
        if (newLocale === locale) return;
        // replace keeps same path but changes locale; refresh to load new messages
        await router.replace(pathname, { locale: newLocale });
        router.refresh();
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button
                    aria-label="Change language"
                    className="min-w-[px] h-8 w-8 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center cursor-pointer"
                >
                    {locale?.toUpperCase() || 'EN'}
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 min-w-[160px] rounded-lg border bg-white p-2 shadow-lg"
                >
                    {LOCALES.map(l => {
                        const active = l.code === locale;
                        return (
                            <DropdownMenu.Item
                                key={l.code}
                                onSelect={e => {
                                    e.preventDefault();
                                    switchLocale(l.code);
                                }}
                                className={`group flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors ${active ? 'bg-slate-100 font-medium' : 'hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-7 text-xs/4 font-semibold">{l.label}</span>
                                    <span className="text-slate-600 text-sm">{l.name}</span>
                                </div>
                                {/* check icon for active locale */}
                                <div className="w-6 h-6 flex items-center justify-center">
                                    {active ? <Check className="w-4 h-4 text-sky-600" /> : null}
                                </div>
                            </DropdownMenu.Item>
                        );
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
