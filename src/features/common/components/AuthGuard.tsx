'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthProvider';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/'); //Redirect to login page
        }
    }, [user, loading, router]);

    if (loading || !user) {
        // You can return a loading skeleton or null
        return <div className="p-4">Loading</div>;
    }

    return <>{children}</>;
}
