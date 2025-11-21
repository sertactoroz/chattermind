'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { useTranslations } from 'next-intl';

type Props = {
    userAvatar?: string | null;
    fullName?: string | null;
};

export default function AvatarMenu({ userAvatar, fullName }: Props) {
    const { signOut } = useAuthContext();
    const router = useRouter();
    const t = useTranslations('Header'); // add translation namespace

    const handleLogout = async () => {
        await signOut();
        // signOut handler in AuthProvider already redirects to '/'
    };

    return (
        <div className="relative flex items-center">
            {/* Trigger (Avatar) */}
            <button
                aria-haspopup="menu"
                aria-expanded="false"
                // Focus ring: focus:ring-primary/50 for theme consistency
                className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer"
                id="avatar-trigger"
                onClick={(e) => {
                    const panel = document.getElementById('avatar-menu-panel');
                    if (panel) panel.classList.toggle('hidden');
                }}
            >
                <Avatar className="w-11 h-11">
                    <AvatarImage src={userAvatar || '/default-avatar.png'} alt={fullName || 'User'} />
                    <AvatarFallback>{(fullName && fullName.slice(0, 2).toUpperCase()) ?? 'U'}</AvatarFallback>
                </Avatar>
            </button>

            {/* Panel */}
            <motion.div
                id="avatar-menu-panel"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.12 }}
                // Panel styles: bg-card, border-border, text-foreground
                className="hidden absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden text-foreground"
                role="menu"
                aria-labelledby="avatar-trigger"
                style={{ transformOrigin: 'top right' }}
            >
                {/* User Info Header Section */}
                {/* Background: bg-muted for a subtle header contrast */}
                {/* Border: border-border for theme-aware separator */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={userAvatar || '/default-avatar.png'} alt={fullName || 'User'} />
                        <AvatarFallback>{(fullName && fullName.slice(0, 2).toUpperCase()) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        {/* Name Text: text-foreground for standard text */}
                        <span className="font-medium text-foreground text-sm">{fullName || 'User'}</span>
                        {/* Profile Link Text: text-muted-foreground for subtle secondary text */}
                        <span className="text-xs text-muted-foreground">Profile</span>
                    </div>
                </div>

                {/* Menu Items List */}
                <ul className="py-1 text-sm">
                    <li>
                        {/* Link Hover: hover:bg-accent for theme-aware highlight */}
                        <Link href="/profile/edit" className="block px-3 py-2 hover:bg-accent transition-colors" role="menuitem">
                            {t('edit_profile') || 'Edit profile'}
                        </Link>
                    </li>
                    <li>
                        {/* Link Hover: hover:bg-accent */}
                        <Link href="/settings" className="block px-3 py-2 hover:bg-accent transition-colors" role="menuitem">
                            {t('settings_privacy') || 'Settings & Privacy'}
                        </Link>
                    </li>
                    <li>
                        {/* Link Hover: hover:bg-accent */}
                        <Link href="/help" className="block px-3 py-2 hover:bg-accent transition-colors" role="menuitem">
                            {t('help_support') || 'Help & Support'}
                        </Link>
                    </li>
                    <li>
                        {/* Logout Button: text-destructive for error/logout color, hover:bg-destructive/10 for subtle red hover */}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            role="menuitem"
                        >
                            {t('logout') || 'Logout'}
                        </button>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
}