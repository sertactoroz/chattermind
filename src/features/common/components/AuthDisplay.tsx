'use client';

import React from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import AvatarMenu from '@/features/common/components/AvatarMenu';

export default function AuthDisplay() {
    const { user, loading } = useAuthContext();

    if (loading || !user) {
        // Do not show anything in the header while loading or if the user is not logged in
        return null;
    }

    // If user is logged in, display the Avatar Menu
    const avatarUrl = (user.user_metadata as any)?.avatar_url ?? null;
    const fullName = (user.user_metadata as any)?.full_name ?? user.email;

    return (
        <div className="flex items-center gap-3 ring-2 ring-brand/40 border-1 border-background hover:ring-brand/50 rounded-full">
            <AvatarMenu userAvatar={avatarUrl} fullName={fullName} />
        </div>
    );
}