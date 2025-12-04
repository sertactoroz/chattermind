'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageSquare, Users, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const items = [
        { key: 'chats', href: '/chat', label: 'Chats', icon: MessageSquare },
        { key: 'characters', href: '/characters', label: 'Characters', icon: Users },
    ];

    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(1800px,96%)] z-40 rounded-2xl">
            <div className="bg-card border border-border rounded-3xl shadow-lg px-8 py-2 flex items-center justify-between">

                {/* LEFT: Chats */}
                <NavItem
                    item={items[0]}
                    active={pathname?.startsWith(items[0].href)}
                />

                {/* CENTER: New Chat */}
                <motion.button
                    aria-label="New chat"
                    onClick={() => router.push('/characters')}
                    whileTap={{ scale: 0.96 }}
                    className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-card -mt-6 md:w-12 md:h-12 md:border-2 md:-mt-4"
                >
                    <Plus className="w-5 h-5" />
                </motion.button>

                {/* RIGHT: Characters */}
                <NavItem
                    item={items[1]}
                    active={pathname?.startsWith(items[1].href)}
                />

            </div>
        </nav>
    );
}

function NavItem({ item, active }: {
    item: { key: string; href: string; label: string; icon: React.ElementType };
    active?: boolean;
}) {
    const Icon = item.icon;
    return (
        <div className="relative flex items-center">
            <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className="flex flex-col items-center justify-center px-3 py-2 min-w-[44px] min-h-[44px] rounded focus:outline-none"
            >
                <Icon className={`w-6 h-6 ${active ? 'text-primary' : 'text-muted-foreground'}`} />

                <span className={`text-[11px] mt-1 hidden md:block ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.label}
                </span>
            </Link>

            {active && (
                <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
            )}
        </div>
    );
}
