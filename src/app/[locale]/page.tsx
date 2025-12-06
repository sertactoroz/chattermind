import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AuthButtons } from '@/features/auth/components/AuthButtons';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import characters from '@/features/characters/data/characters.json';

const featuredCharacters = characters.slice(0, 4);

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'vX.X.X';

export default async function Home() {

  const t = await getTranslations('Homepage');
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md mx-auto rounded-2xl shadow-md">
        <CardHeader className="mx-6 p-6 pt-8 text-center">
          <CardTitle className="flex flex-col items-center gap-6">
            <div className="w-full max-w-2xl px-4">
              <Image
                src="/chattermind-logo.png"
                alt="ChatterMind"
                height={120}
                width={1400}
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
                unoptimized={false}
              />
            </div>
          </CardTitle>
          <div className="flex justify-center space-x-4 py-6 ">
            {featuredCharacters.map((character, index) => (
              <div
                key={character.id}
                className="relative w-16 h-16 rounded-full overflow-hidden p-0.5 "
                // Animasyonlu Çerçeve Stili: 
                // index'e göre farklı delay'ler ekleyerek dalgalı bir hareket elde ediyoruz.
                style={{
                  boxShadow: '0 0 10px 2px rgba(var(--brand-rgb), 0.7)',
                  animation: `pulse-border 2s ease-in-out infinite ${index * 0.3}s`,
                }}
              >
                {/* Avatar Image */}
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
          {/* <ul className="text-sm text-foreground/80 space-y-3">
            <li className="flex items-start gap-3">
              <span className="inline-flex w-7 h-7 rounded-md bg-muted text-foreground/80 items-center justify-center text-xs">✓</span>
              <span>{t('feature_mobile')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-7 h-7 rounded-md bg-muted text-foreground/80 items-center justify-center text-xs">⚡</span>
              <span>{t('feature_animations')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-7 h-7 rounded-md bg-muted text-foreground/80 items-center justify-center text-xs">🔁</span>
              <span>{t('feature_realtime')}</span>
            </li>
          </ul> */}
          <div className="mt-6 flex justify-center">
            <AuthButtons />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 p-6">
          <div className="flex items-center justify-center gap-3 text-xs text-center text-muted-foreground">
            <span>{t('footer_note')}</span>

          </div>
          <h6 className="text-muted-foreground text-xs ">{APP_VERSION}</h6>

        </CardFooter>
      </Card>
    </div>
  );
}