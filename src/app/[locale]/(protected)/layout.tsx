'use client';

import { usePathname } from 'next/navigation';
import AuthGuard from '@/features/auth/components/AuthGuard';
import Header from '@/features/common/components/Header';
import BottomNav from '@/features/common/components/BottomNav';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatDetailPage = /\/chat\/[^/]+$/.test(pathname);

    return (
        <AuthGuard>
            <Header />
            <main className="flex-1 overflow-y-auto max-w-md mx-auto w-full">
                {children}
            </main>
            {!isChatDetailPage && <BottomNav />}
        </AuthGuard>
    );
}