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
        console.log('user.user_metadata:', user.user_metadata)
        // Note: Supabase user_metadata is a Record<string, any>, so 'as any' is used here for property access.
        const avatarUrl = (user.user_metadata as any)?.avatar_url ?? null;
        const fullName = (user.user_metadata as any)?.full_name ?? user.email;
        return (
            <div className="flex items-center gap-3">
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