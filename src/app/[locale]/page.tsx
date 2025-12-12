'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthButtons } from '@/features/auth/components/AuthButtons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import characters from '@/features/characters/data/characters.json';
import AvatarMenuPublic from '@/features/common/components/AvatarMenuPublic';
import { LoaderPinwheel } from 'lucide-react';

const featuredCharacters = characters.slice(0, 4);
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'vX.X.X';

export default function Home() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const t = useTranslations('Homepage');

  // Redirect authenticated users to characters page
  useEffect(() => {
    if (!loading && user) {
      router.replace('/characters');
    }
  }, [user, loading, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoaderPinwheel className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If user exists, don't render login page (redirect is happening)
  if (user) {
    return null;
  }

  // Show login page for non-authenticated users only
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <AvatarMenuPublic />
      </div>

      <div className="min-h-full flex items-center justify-center p-6">
        <Card className="w-full max-w-md mx-auto rounded-2xl shadow-md relative">
          <CardHeader className="mx-6 p-6 pt-8 text-center">
            <CardTitle className="flex flex-col items-center gap-6">
              <div className="w-full max-w-2xl px-4">
                <Image
                  src="/chattermind-animation.svg"
                  alt="ChatterMind"
                  height={120}
                  width={1400}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  priority
                  unoptimized={false}
                />
              </div>
            </CardTitle>
            <div className="flex justify-center -space-x-3 py-6">
              {featuredCharacters.map((character, index) => (
                <div
                  key={character.id}
                  className="relative w-16 h-16 rounded-full overflow-hidden p-0.5"
                  style={{
                    boxShadow: '0 0 10px 2px rgba(var(--brand-rgb), 0.7)',
                    animation: `pulse-border 2s ease-in-out infinite ${index * 0.3}s`,
                  }}
                >
                  <Image
                    src={character.avatar}
                    alt={character.name}
                    fill
                    style={{ objectFit: 'cover', objectPosition: '50% 20%' }}
                    className="rounded-full border-2 border-foreground"
                    sizes="64px"
                  />
                </div>
              ))}
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {t('subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 py-0">
            <div className="mt-6 flex justify-center">
              <AuthButtons />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-6 py-4">
            <div className="flex items-center justify-center gap-3 text-xs text-center text-muted-foreground">
              <span>{t('footer_note')}</span>
            </div>
            <h6 className="text-muted-foreground text-xs">{APP_VERSION}</h6>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}