// src/features/common/components/Header.tsx  (veya mevcut src/app/header.tsx yerine)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from '@/features/common/components/LanguageSwitcher';
import AuthButton from '@/features/auth/components/AuthButton';

export default function Header() {
  return (
    <header className="w-full bg-white/60 backdrop-blur-sm border-b border-slate-100 fixed top-0 left-0 z-40">
      <div className="mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Home">
            <div className="w-15 h-15 relative">
              <Image src="/chattermind-logo.svg" alt="Logo" fill className="object-contain cursor-pointer" />
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3 px-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
