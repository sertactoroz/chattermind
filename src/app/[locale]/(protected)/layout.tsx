'use client';

import { usePathname } from 'next/navigation';
import AuthGuard from '@/features/auth/components/AuthGuard';
import Header from '@/features/common/components/Header';
import BottomNav from '@/features/common/components/BottomNav';
import DesktopSidebar from '@/features/common/components/DesktopSidebar';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatDetailPage = /\/chat\/[^/]+$/.test(pathname);

    return (
        <AuthGuard>
            <Header />
            <div className="flex-1 flex overflow-hidden">
                <DesktopSidebar />
                <main className="flex-1 overflow-y-auto w-full lg:max-w-none lg:mx-0">
                    {children}
                </main>
            </div>
            {!isChatDetailPage && <BottomNav />}
        </AuthGuard>
    );
}
