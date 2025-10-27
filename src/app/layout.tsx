import '../styles/globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/context/AuthProvider';

export const metadata = {
  title: 'ChatterMind',
  description:
    'A modern AI-powered chat experience that brings unique characters to life through natural, real-time conversations.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <AuthProvider>
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
