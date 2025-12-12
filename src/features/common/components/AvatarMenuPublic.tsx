'use client';

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
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

type Props = {
    userAvatar?: string | null;
    fullName?: string | null;
};


export default function AvatarMenuPublic({ userAvatar, fullName }: Props) {
    const t = useTranslations('Header');

    const userInitials = (fullName && fullName.slice(0, 2).toUpperCase()) ?? 'U';
    const userName = fullName || 'User';

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Open user menu"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="p-0 flex flex-col"
            >
                {/* User Info Header Section */}
                <SheetHeader className="text-left p-4 border-b border-border bg-muted">
                    <SheetTitle className="sr-only">User Menu</SheetTitle>

                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={userAvatar || '/default-avatar.png'} alt={userName} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground text-lg">{userName}</span>
                            <span className="text-sm text-muted-foreground">Profile</span>
                        </div>
                    </div>
                </SheetHeader>

                {/* Menu Items List */}
                <ul className="py-1 text-lg flex-grow overflow-y-auto">

                    <li>
                        <SheetClose asChild>
                            <Link href="/public_settings" className="block px-4 py-3 hover:bg-accent transition-colors" role="menuitem">
                                {t('settings') || 'Settings'}
                            </Link>
                        </SheetClose>
                    </li>

                    <li>
                        <SheetClose asChild>
                            <Link href="/public_help" className="block px-4 py-3 hover:bg-accent transition-colors" role="menuitem">
                                {t('help_support') || 'Help & Support'}
                            </Link>
                        </SheetClose>
                    </li>
                    <li>
                        <SheetClose asChild>
                            <div className="absolute bottom-0 right-0 p-6 flex items-center gap-2 z-10">
                                <ThemeToggle />
                                <LanguageSwitcher />
                            </div>
                        </SheetClose>
                    </li>
                    <li>
                        <SheetClose asChild>
                            <Link href="/public_about" className="block px-4 py-3 hover:bg-accent transition-colors" role="menuitem">
                                {t('about') || 'About'}
                            </Link>
                        </SheetClose>
                    </li>
                </ul>
            </SheetContent>
        </Sheet>
    );
}