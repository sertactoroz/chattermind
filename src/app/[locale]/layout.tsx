import '../../styles/globals.css';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Header from '@/features/common/components/Header';
import ThemeProviderWrapper from '@/features/common/components/ThemeProviderClient';
import { Toaster } from 'sonner';
import ConditionalBottomNav from '@/features/common/components/ConditionalBottomNav';

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
      <body className="antialiased bg-background text-foreground">
        <ThemeProviderWrapper>
          <NextIntlClientProvider>
            <AuthProvider>
              <Header />
              <main className="min-h-[calc(100vh-64px)] pt-16 pb-16 relative">
                {children}
              </main>
              <ConditionalBottomNav />
              <Toaster position="bottom-right" richColors />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}