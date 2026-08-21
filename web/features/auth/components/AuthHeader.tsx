'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';

export const AuthHeader: FC = () => {
  return (
    <header className="w-full h-16 sm:h-20 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 px-4 sm:px-8 flex items-center justify-between shadow-xs transition-colors">
      {/* Back Link */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Trang chủ</span>
      </Link>

      {/* Center Logo */}
      <Link href="/" className="flex items-center gap-2.5 group transition-transform hover:scale-105 active:scale-95">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ff6900] flex items-center justify-center shadow-md shadow-orange-500/20">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.55.45-1 1-1h14c.55 0 1 .45 1 1 0 4.41-3.59 8-8 8zm6.5-10H5.5c-.45-1.92 1.4-3.5 3.5-3.5h6c2.1 0 3.95 1.58 3.5 3.5z" />
          </svg>
        </div>
        <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
          KeiPizza
        </span>
      </Link>

      {/* Right Tools: Theme Toggle & Language */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher variant="compact" />
      </div>
    </header>
  );
};
