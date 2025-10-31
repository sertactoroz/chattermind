'use client';

import React from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { Button } from '@/components/ui/button';
import AvatarMenu from './AvatarMenu';
import { useTranslations } from 'next-intl';

export default function AuthButton() {
    const { user, loading, signInWithGoogle } = useAuthContext();
    const t = useTranslations('Auth');

    if (loading) {
        return (
            <Button disabled>
                {t('loading')}
            </Button>
        );
    }

    if (user) {
        const avatarUrl = (user.user_metadata as any)?.avatar_url ?? null;
        const fullName = (user.user_metadata as any)?.full_name ?? user.email;
        return (
            <div className="flex items-center gap-3">
                {/* <div className="hidden sm:block text-sm">
                    <div className="font-medium text-slate-800">{fullName}</div>
                </div> */}
                <AvatarMenu userAvatar={avatarUrl} fullName={fullName} />
            </div>
        );
    }

    return (
        <Button className="" onClick={() => signInWithGoogle()}>
            {t('signin_google') || 'Sign in'}
        </Button>
    );
}
