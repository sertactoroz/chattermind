'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { AuthButtons } from '@/features/auth/components/AuthButtons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import AvatarMenuPublic from '@/features/common/components/AvatarMenuPublic';
import { LoaderPinwheel } from 'lucide-react';
import LanguageSwitcher from '@/features/common/components/LanguageSwitcher';
import ThemeToggle from '@/features/common/components/ThemeToggle';

export default function Home() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const t = useTranslations('Homepage');

  useEffect(() => {
    if (!loading && user) {
      router.replace('/companions');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoaderPinwheel className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <div className="fixed top-4 right-4 z-50">
        <AvatarMenuPublic />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center mb-10">
            <div className="mb-6">
              <Image
                src="/chattermind-logo.png"
                alt="ChatterMind"
                height={32}
                width={300}
                style={{ width: 'auto', height: '32px' }}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              {t('subtitle')}
            </p>
          </div>

          <AuthButtons />

          <p className="text-center text-xs text-muted-foreground/60 mt-8">
            {t('footer_note')}
          </p>
        </div>
      </div>
    </div>
  );
}
