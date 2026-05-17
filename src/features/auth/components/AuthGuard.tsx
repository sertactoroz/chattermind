'use client';

import React from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { LoaderPinwheel } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoaderPinwheel
          className="h-16 w-16 animate-spin text-primary"
          aria-label="Loading application content"
        />
      </div>
    );
  }

  if (!user) {
    router.replace('/');
    return null;
  }

  return <>{children}</>;
}
