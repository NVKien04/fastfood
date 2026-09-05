'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

type MainLayoutProps = {
  children: ReactNode;
  showCategoryBar?: boolean;
  className?: string;
};

export const MainLayout = ({ children, className = '' }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans transition-colors">
      {/* 1. Header (72px) */}
      <Header />

      {/* 2. Main Content Area */}
      <main className={`flex-1 w-full ${className}`}>{children}</main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};
