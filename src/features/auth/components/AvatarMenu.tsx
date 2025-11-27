'use client';

import React, { useState, useEffect, useRef } from 'react'; // useRef, useEffect, useState eklendi
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence eklendi
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { useTranslations } from 'next-intl';

type Props = {
    userAvatar?: string | null;
    fullName?: string | null;
};

export default function AvatarMenu({ userAvatar, fullName }: Props) {
    const { signOut } = useAuthContext();
    const t = useTranslations('Header');

    // 1. State to control the visibility of the menu panel
    const [isOpen, setIsOpen] = useState(false);

    // 2. Ref to detect clicks inside or outside the container
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await signOut();
    };

    // 3. Effect to handle clicks outside the menu container
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // If the menu is open and the click happened outside the menuRef element, close it.
            if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]); // Re-run effect when the menu's open state changes


    return (
        // Attach the ref to the root element of the component
        <div className="relative flex items-center" ref={menuRef}>
            {/* Trigger (Avatar) */}
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer"
                id="avatar-trigger"
                onClick={() => setIsOpen(prev => !prev)} // Toggle open state
            >
                <Avatar className="w-11 h-11">
                    <AvatarImage src={userAvatar || '/default-avatar.png'} alt={fullName || 'User'} />
                    <AvatarFallback>{(fullName && fullName.slice(0, 2).toUpperCase()) ?? 'U'}</AvatarFallback>
                </Avatar>
            </button>

            {/* Panel - Use AnimatePresence for clean mount/unmount with motion */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.12 }}
                        // Panel styles: theme-aware classes
                        className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden text-foreground"
                        role="menu"
                        aria-labelledby="avatar-trigger"
                        style={{ transformOrigin: 'top right' }}
                    >
                        {/* User Info Header Section */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={userAvatar || '/default-avatar.png'} alt={fullName || 'User'} />
                                <AvatarFallback>{(fullName && fullName.slice(0, 2).toUpperCase()) ?? 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium text-foreground text-sm">{fullName || 'User'}</span>
                                <span className="text-xs text-muted-foreground">Profile</span>
                            </div>
                        </div>

                        {/* Menu Items List */}
                        <ul className="py-1 text-sm">
                            <li>
                                {/* Click event closes the menu immediately after navigation */}
                                <Link href="/profile/edit" onClick={() => setIsOpen(false)} className="block px-3 py-2 hover:bg-accent transition-colors" role="menuitem">
                                    {t('edit_profile') || 'Edit profile'}
                                </Link>
                            </li>
                            <li>
                                <Link href="/settings" onClick={() => setIsOpen(false)} className="block px-3 py-2 hover:bg-accent transition-colors" role="menuitem">
                                    {t('settings_privacy') || 'Settings & Privacy'}
                                </Link>
                            </li>
                            <li>
                                <Link href="/help" onClick={() => setIsOpen(false)} className="block px-3 py-2 hover:bg-accent transition-colors" role="menuitem">
                                    {t('help_support') || 'Help & Support'}
                                </Link>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                    role="menuitem"
                                >
                                    {t('logout') || 'Logout'}
                                </button>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}