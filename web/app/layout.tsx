import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Provider from '@/providers/provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FastFood - Đặt Món Nhanh Chóng & Tiện Lợi',
  description: 'Thưởng thức ẩm thực fast food thơm ngon, giao hàng tận nơi nhanh chóng',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

