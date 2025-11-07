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
                className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
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
                className="hidden absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 overflow-hidden"
                role="menu"
                aria-labelledby="avatar-trigger"
                style={{ transformOrigin: 'top right' }}
            >
                <div className="flex items-center gap-3 px-4 py-3 border-b bg-slate-50">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={userAvatar || '/default-avatar.png'} alt={fullName || 'User'} />
                        <AvatarFallback>{(fullName && fullName.slice(0, 2).toUpperCase()) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-800 text-sm">{fullName || 'User'}</span>
                        <span className="text-xs text-slate-500">Profile</span>
                    </div>
                </div>
                <ul className="py-1 text-sm">
                    <li>
                        <Link href="/profile/edit" className="block px-3 py-2 hover:bg-slate-50" role="menuitem">
                            {t('edit_profile') || 'Edit profile'}
                        </Link>
                    </li>
                    <li>
                        <Link href="/settings" className="block px-3 py-2 hover:bg-slate-50" role="menuitem">
                            {t('settings_privacy') || 'Settings & Privacy'}
                        </Link>
                    </li>
                    <li>
                        <Link href="/help" className="block px-3 py-2 hover:bg-slate-50" role="menuitem">
                            {t('help_support') || 'Help & Support'}
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
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
