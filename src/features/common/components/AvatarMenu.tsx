// 'use client';

import React from 'react';
import Link from 'next/link';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from '@/components/ui/sheet';

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

    const handleLogout = async () => {
        await signOut();
    };

    const userInitials = (fullName && fullName.slice(0, 2).toUpperCase()) ?? 'U';
    const userName = fullName || 'User';

    return (
        // 1. Sheet component defines the drawer context
        <Sheet>
            {/* 2. SheetTrigger: Wraps the button that opens the drawer */}
            <SheetTrigger asChild>
                <button
                    type="button"
                    className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer"
                >
                    <Avatar className="w-11 h-11">
                        <AvatarImage src={userAvatar || '/default-avatar.png'} alt={userName} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                </button>
            </SheetTrigger>

            {/* 3. SheetContent: The content that slides in from the side */}
            <SheetContent
                side="right"
                className="p-0 flex flex-col" // Remove default padding and use flex for layout control
            >
                {/* User Info Header Section (Standard SheetHeader structure) */}
                <SheetHeader className="text-left p-4 border-b border-border bg-muted">
                    <SheetTitle className="sr-only">User Menu</SheetTitle> {/* Accessible title for screen readers */}

                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={userAvatar || '/default-avatar.png'} alt={userName} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            {/* FONT SIZE ADJUSTMENT 1: Increase username size to text-lg */}
                            <span className="font-medium text-foreground text-lg">{userName}</span>
                            <span className="text-sm text-muted-foreground">Profile</span>
                        </div>
                    </div>
                </SheetHeader>

                {/* Menu Items List */}
                {/* FONT SIZE ADJUSTMENT 2: Set general list item size to text-lg for better readability */}
                <ul className="py-1 text-lg flex-grow overflow-y-auto">
                    <li>
                        {/* SheetClose: Ensures the sheet closes when the link is clicked */}
                        <SheetClose asChild>
                            <Link href="/profile" className="block px-4 py-3 hover:bg-accent transition-colors" role="menuitem">
                                {t('edit_profile') || 'Edit profile'}
                            </Link>
                        </SheetClose>
                    </li>
                    <li>
                        <SheetClose asChild>
                            <Link href="/settings" className="block px-4 py-3 hover:bg-accent transition-colors" role="menuitem">
                                {t('settings') || 'Settings'}
                            </Link>
                        </SheetClose>
                    </li>
                    <li>
                        <SheetClose asChild>
                            <Link href="/data-privacy" className="block px-4 py-3 hover:bg-accent transition-colors" role="menuitem">
                                {t('data_privacy') || 'Data & Privacy'}
                            </Link>
                        </SheetClose>
                    </li>
                    <li>
                        <SheetClose asChild>
                            <Link href="/help" className="block px-4 py-3 hover:bg-accent transition-colors" role="menuitem">
                                {t('help_support') || 'Help & Support'}
                            </Link>
                        </SheetClose>
                    </li>
                    <li>
                        <SheetClose asChild>
                            <Link href="/about" className="block px-4 py-3 hover:bg-accent transition-colors" role="menuitem">
                                {t('about') || 'About'}
                            </Link>
                        </SheetClose>
                    </li>
                </ul>

                {/* Logout Button (Fixed at the bottom of the Sheet) */}
                <div className="p-4 border-t border-border">
                    <SheetClose asChild>
                        <button
                            type="button"
                            onClick={handleLogout}
                            // FONT SIZE ADJUSTMENT 3: Increase logout button text size to text-lg
                            className="w-full text-left px-4 py-2 text-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer rounded-md"
                            role="menuitem"
                        >
                            {t('logout') || 'Logout'}
                        </button>
                    </SheetClose>
                </div>

            </SheetContent>
        </Sheet>
    );
}