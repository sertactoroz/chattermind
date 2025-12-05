// src/features/common/components/Header.tsx
'use client';

import Link from 'next/link';
import LanguageSwitcher from '@/features/common/components/LanguageSwitcher';
import ThemeToggle from '@/features/common/components/ThemeToggle';
import Image from 'next/image';
import AuthDisplay from '@/features/common/components/AuthDisplay';

export default function Header() {
  return (
    // Use theme-aware background (bg-background) and border (border-border).
    // The opacity /60 will apply to the background variable, ensuring theme consistency.
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border fixed top-0 left-0 z-40">
      <div className="mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center" aria-label="ChatterMind">
            <Image
              src="/chattermind-logo.png"
              alt="ChatterMind"
              height={36} // Perfect small header size (32–40 arası idealdir)
              width={400} // Wide enough for text logo, will be scaled down
              className="h-9 w-auto object-contain" // h-9 = 36px, w-auto = keeps ratio
              priority
            />
          </Link>
        </div>

        {/* Navigation/Actions */}
        <div className="flex items-center gap-3 px-4">
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          {/* Display AvatarMenu if user is logged in */}
          <AuthDisplay />
        </div>
      </div>
    </header>
  );
}