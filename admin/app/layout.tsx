import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Provider from '@/providers/provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FastFood Admin - Quản Trị Hệ Thống',
  description: 'Bảng điều khiển quản trị viên cho hệ thống FastFood',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
