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
import companions from '@/features/companions/data/companions.json';

const featuredCompanions = companions.slice(0, 4);

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
            <div
              className="mb-6 flex justify-center gap-3 sm:gap-4"
              aria-label="Featured AI companions"
            >
              {featuredCompanions.map((companion, index) => (
                <div
                  key={companion.id}
                  className="relative h-14 w-14 overflow-hidden rounded-full p-0.5 sm:h-16 sm:w-16"
                  style={{
                    animation: `pulse-border 2s ease-in-out infinite ${index * 0.3}s`,
                  }}
                >
                  <Image
                    src={companion.avatar}
                    alt={companion.name}
                    fill
                    sizes="(min-width: 640px) 64px, 56px"
                    className="rounded-full border-2 border-background object-cover"
                    style={{ objectPosition: '50% 20%' }}
                  />
                </div>
              ))}
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
