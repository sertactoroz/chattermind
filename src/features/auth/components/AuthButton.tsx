'use client';

import React from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';

export default function AuthButton() {
    const { user, loading, signInWithGoogle, signOut } = useAuthContext();
    if (loading) {
        return (
            <button className="w-full max-w-sm h-12 rounded-lg bg-slate-200 text-slate-700 font-medium flex items-center justify-center" disabled>
                Loading…
            </button>
        );
    }

    if (user) {
        return (
            <div className="w-full max-w-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <img
                        src={(user.user_metadata as any)?.avatar_url || '/default-avatar.png'}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-sm">
                        <div className="font-medium text-slate-500">{user.user_metadata?.full_name || user.email}</div>
                        {/* <div className="text-xs text-slate-500">Signed in</div> */}
                    </div>
                </div>
                <button onClick={() => signOut()} className="px-3 py-2 rounded-md bg-red-500 text-white text-sm">
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signInWithGoogle()}
            className="w-full max-w-sm h-12 rounded-lg bg-sky-700 text-white font-semibold flex items-center justify-center min-h-[44px]"
        >
            Sign in with Google
        </button>
    );
}
