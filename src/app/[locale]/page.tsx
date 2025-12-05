import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';


const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'vX.X.X';

export default async function Home() {

  const t = await getTranslations('Homepage');
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md mx-auto rounded-2xl shadow-md">
        <CardHeader className="p-6 pt-8 text-center">
          <CardTitle
            className="text-xl sm:text-2xl font-bold bg-chart-3 bg-clip-text text-transparent p-6"
          >
            ChatterMind
          </CardTitle>
          <h6 className="text-muted-foreground">v{APP_VERSION}</h6>
          {/* <div className="mx-auto w-28 h-28 relative mb-4">
            <Image src="/chattermind-logo5.svg" alt="Logo" fill className="object-contain" priority />
          </div> */}
          <CardDescription className="text-sm text-muted-foreground mt-1">
            {t('subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <ul className="text-sm text-foreground/80 space-y-3">
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
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-6">
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>{t('footer_note')}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}