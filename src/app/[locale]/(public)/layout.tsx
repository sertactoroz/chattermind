'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import AvatarMenuPublic from '@/features/common/components/AvatarMenuPublic';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    // Redirect authenticated users away from public pages
    useEffect(() => {
        if (!loading && user) {
            router.replace('/characters');
        }
    }, [user, loading, router]);

    // Don't render if user is logged in
    if (user) {
        return null;
    }

    return (
        <div className="relative min-h-screen">
            {!loading && (
                <div className="fixed top-4 right-4 z-50">
                    <AvatarMenuPublic />
                </div>
            )}
            {children}
        </div>
    );
}