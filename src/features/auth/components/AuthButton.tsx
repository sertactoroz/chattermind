'use client';

import React from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function AuthButton() {
    const { user, loading, signInWithGoogle, signOut } = useAuthContext();

    if (loading) {
        return (
            <Button className="w-full" disabled>
                Loading…
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
                        {/* <div className="text-xs text-slate-500">Signed in</div> */}
                    </div>
                </div>

                <Button variant="destructive" onClick={() => signOut()}>
                    Sign out
                </Button>
            </div>
        );
    }

    return (
        <Button className="w-full" onClick={() => signInWithGoogle()}>
            Sign in with Google
        </Button>
    );
}
