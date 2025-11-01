// src/features/common/components/BottomNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageSquare, Users, User, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const items = [
        { key: 'chats', href: '/chat', label: 'Chats', icon: <MessageSquare className="w-6 h-6" aria-hidden /> },
        { key: 'characters', href: '/characters', label: 'Characters', icon: <Users className="w-6 h-6" aria-hidden /> },
    ];

    return (
        <nav
            aria-label="Primary navigation"
            className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(1100px,96%)] max-w-3xl z-40"
        >
            <div className="bg-white dark:bg-slate-900 border rounded-3xl shadow-lg px-8 py-2 flex items-center justify-between">
                {/* Left group (mobile: first item) */}
                <div className="flex items-center gap-2">
                    {items.slice(0, 1).map(it => (
                        <NavItem key={it.key} item={it} active={pathname?.startsWith(it.href || '')} />
                    ))}
                </div>

                {/* Center CTA */}
                <div className="flex-1 flex items-center justify-center -mt-6 md:-mt-4">
                    <motion.button
                        aria-label="New chat"
                        onClick={() => router.push('/chat/new')}
                        whileTap={{ scale: 0.96 }}
                        className="bg-sky-900 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-900 md:w-12 md:h-12 md:border-2"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Right group (mobile: second item + avatar) */}
                <div className="flex items-center gap-2">
                    {items.slice(1).map(it => (
                        <NavItem key={it.key} item={it} active={pathname?.startsWith(it.href || '')} />
                    ))}
                </div>
            </div>
        </nav>
    );
}

function NavItem({ item, active }: { item: { key: string; href: string; label: string; icon: React.ReactNode }; active?: boolean }) {
    return (
        <div className="relative flex items-center">
            <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className="flex flex-col items-center justify-center px-3 py-2 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-300 rounded"
            >
                <div className={`flex items-center justify-center ${active ? 'text-sky-600' : 'text-slate-500'}`}>{item.icon}</div>
                <span className={`text-[11px] mt-1 ${active ? 'text-sky-600' : 'text-slate-500'} md:block hidden`}>{item.label}</span>
            </Link>

            {/* Active indicator */}
            {active && (
                <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-sky-600"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
            )}
        </div>
    );
}
