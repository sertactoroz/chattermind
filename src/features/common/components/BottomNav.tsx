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
            className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(1800px,96%)] z-40 rounded-2xl "
        >
            {/* Background: bg-card ensures white/light-gray in light mode and dark background in dark mode. */}
            {/* border ensures the border color adapts (border-border). */}
            <div className="bg-card border border-border rounded-3xl shadow-lg px-8 py-2 flex items-center justify-between">
                {/* Left group (mobile: first item) */}
                <div className="flex items-center gap-2">
                    {items.slice(0, 1).map(it => (
                        <NavItem key={it.key} item={it} active={pathname?.startsWith(it.href || '')} />
                    ))}
                </div>

                {/* Center CTA - New Chat Button */}
                <div className="flex-1 flex items-center justify-center -mt-6 md:-mt-4">
                    <motion.button
                        aria-label="New chat"
                        onClick={() => router.push('/characters')}
                        whileTap={{ scale: 0.96 }}
                        // Background: bg-primary (central theme color)
                        // Border: border-card (ensures a contrasting border against the button/nav background)
                        className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-card md:w-12 md:h-12 md:border-2"
                    >
                        <Plus className="w-5 h-5 cursor-pointer" />
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

// NavItem component is now theme-aware
function NavItem({ item, active }: { item: { key: string; href: string; label: string; icon: React.ReactNode }; active?: boolean }) {
    // Determine active and inactive text classes using theme colors
    const activeClasses = 'text-primary'; // Uses the central theme color
    const inactiveClasses = 'text-muted-foreground'; // Uses muted text color

    return (
        <div className="relative flex items-center">
            <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                // Focus ring also uses a theme color (ring-primary or a lighter version)
                className="flex flex-col items-center justify-center px-3 py-2 min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            >
                {/* Icon color changes based on active state */}
                <div className={`flex items-center justify-center ${active ? activeClasses : inactiveClasses}`}>{item.icon}</div>

                {/* Label color changes based on active state */}
                <span className={`text-[11px] mt-1 ${active ? activeClasses : inactiveClasses} md:block hidden`}>{item.label}</span>
            </Link>

            {/* Active indicator */}
            {active && (
                <motion.div
                    layoutId="bottom-nav-indicator"
                    // Indicator color uses the central theme color
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
            )}
        </div>
    );
}