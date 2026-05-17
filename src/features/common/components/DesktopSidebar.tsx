'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageSquare, Users, Plus, Settings, Shield } from 'lucide-react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';

export default function DesktopSidebar() {
    const pathname = usePathname();
    const { user } = useAuthContext();

    const navItems = [
        { key: 'chats', href: '/chat', label: 'Chats', icon: MessageSquare },
        { key: 'companions', href: '/companions', label: 'Companions', icon: Users },
        ...(user?.isAdmin ? [{ key: 'admin', href: '/admin/companions', label: 'Admin', icon: Shield }] : []),
    ];

    const isActive = (href: string) => pathname?.startsWith(href);

    return (
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                <Link href="/" className="flex items-center" aria-label="ChatterMind">
                    <Image
                        src="/chattermind-logo.png"
                        alt="ChatterMind"
                        height={28}
                        width={300}
                        style={{ width: 'auto', height: '28px' }}
                        className="object-contain"
                        priority
                    />
                </Link>
            </div>

            <div className="px-3 pt-4 pb-2">
                <Link
                    href="/companions"
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-brand text-white font-medium text-sm hover:bg-brand-600 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Chat
                </Link>
            </div>

            <nav className="flex-1 px-3 py-2 space-y-1">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                active
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 pb-3">
                <Link
                    href="/settings"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive('/settings')
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
