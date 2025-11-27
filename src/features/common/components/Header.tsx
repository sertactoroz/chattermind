'use client';

import Link from 'next/link';
import LanguageSwitcher from '@/features/common/components/LanguageSwitcher';
import AuthButton from '@/features/auth/components/AuthButton';
import ThemeToggle from '@/features/chat/components/ThemeToggle';

export default function Header() {
  return (
    // Use theme-aware background (bg-background) and border (border-border).
    // The opacity /60 will apply to the background variable, ensuring theme consistency.
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border fixed top-0 left-0 z-40">
      <div className="mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3" aria-label="ChatterMind">
            {/* <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex-shrink-0">
              <Image src="/chattermind-logo5.svg" alt="" fill className="object-contain" />
            </div> */}

            <span className="text-xl sm:text-2xl font-bold bg-chart-3 bg-clip-text text-transparent ps-3">
              ChatterMind
            </span>
          </Link>
        </div>

        {/* Navigation/Actions */}
        <div className="flex items-center gap-3 px-4">
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}