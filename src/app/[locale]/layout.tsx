import '../../styles/globals.css';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import ThemeProviderWrapper from '@/features/common/components/ThemeProviderClient';
import { Toaster } from 'sonner';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: 'ChatterMind',
  description:
    'A modern AI-powered chat experience that brings unique characters to life through natural, real-time conversations.',
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground flex flex-col h-screen">
        <ThemeProviderWrapper>
          <NextIntlClientProvider>
            <AuthProvider>
              {children}
              <Toaster position="bottom-right" richColors />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}