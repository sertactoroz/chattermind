'use client';

import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import AuthButton from '@/features/auth/components/AuthButton';

export default function Header() {
  return (
    // <header className="w-full max-w-md mx-auto px-4 py-3 flex items-center justify-between">
    <header className="w-full bg-white/60 backdrop-blur-sm border-b border-slate-100 mx-auto px-4 py-3 flex items-center justify-between">

      <div className="flex items-center px-4">
        <Link href="/">
          <div className="w-10 h-10 relative gap-3">
            <Image src="/chattermind-logo.svg" alt="Logo" fill className="object-contain" />
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 px-4">
        <LanguageSwitcher />
        <div className="hidden sm:block">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
