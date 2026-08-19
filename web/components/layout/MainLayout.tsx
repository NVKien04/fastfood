'use client';

import * as React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

type MainLayoutProps = {
  children: React.ReactNode;
  showCategoryBar?: boolean;
  className?: string;
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-gray-900 font-sans">
      {/* 1. Header (72px) */}
      <Header />

      {/* 2. Main Content Area */}
      <main className={`flex-1 w-full ${className}`}>
        {children}
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};
