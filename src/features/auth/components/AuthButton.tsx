'use client';

import React from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTranslations } from 'next-intl';

export default function AuthButton() {
    const { user, loading, signInWithGoogle, signOut } = useAuthContext();
    const t = useTranslations('Auth');

    if (loading) {
        return (
            <Button className="w-full" disabled>
                {t('loading')}
            </Button>
        );
    }

    if (user) {
        return (
            <div className="w-full flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={(user.user_metadata as any)?.avatar_url || '/default-avatar.png'} alt="avatar" />
                        <AvatarFallback>{(user.user_metadata as any)?.full_name?.slice?.(0, 2) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <div className="font-medium text-slate-800">{user.user_metadata?.full_name || user.email}</div>
                    </div>
                </div>

                <Button variant="destructive" onClick={() => signOut()}>
                    {t('signout')}
                </Button>
            </div>
        );
    }

    return (
        <Button className="w-full" onClick={() => signInWithGoogle()}>
            {t('signin_google')}
        </Button>
    );
}