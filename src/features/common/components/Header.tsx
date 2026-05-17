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
    <header className="w-full bg-background/70 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
      <div className="mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center lg:hidden" aria-label="ChatterMind">
            <Image
              src="/chattermind-logo.png"
              alt="ChatterMind"
              height={36}
              width={400}
              style={{ width: 'auto', height: '36px' }}
              className="object-contain"
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