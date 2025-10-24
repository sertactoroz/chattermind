import '../styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'ChatterMind',
  description: 'A modern AI-powered chat experience that brings unique characters to life through natural, real-time conversations.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        {/* AuthProvider MUST be a client component; it'll be imported */}
        {/* <AuthProvider> */}
        {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
