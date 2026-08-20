'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const AuthHeader: FC = () => {
  return (
    <header className="w-full h-16 sm:h-20 bg-white border-b border-gray-100 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      {/* Back Link */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Trang chủ</span>
      </Link>

      {/* Center Logo */}
      <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 flex items-center justify-center shadow-md shadow-red-600/20">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.55.45-1 1-1h14c.55 0 1 .45 1 1 0 4.41-3.59 8-8 8zm6.5-10H5.5c-.45-1.92 1.4-3.5 3.5-3.5h6c2.1 0 3.95 1.58 3.5 3.5z" />
          </svg>
        </div>
        <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-gray-900 leading-none">
          Pizza<span className="text-red-600 font-black">Hut</span>
        </span>
      </Link>

      {/* Language Switcher */}
      <div className="flex items-center">
        <LanguageSwitcher variant="compact" />
      </div>
    </header>
  );
};
