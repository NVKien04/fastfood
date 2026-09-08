import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import Provider from '@/providers/provider';
import {
  COOKIE_KEYS,
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  ThemeEnum,
  LanguageEnum,
  type Theme,
  type Language,
} from '@/constants';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FastFood - Đặt Món Nhanh Chóng & Tiện Lợi',
  description: 'Thưởng thức ẩm thực fast food thơm ngon, giao hàng tận nơi nhanh chóng',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get(COOKIE_KEYS.THEME)?.value as Theme | undefined;
  const rawLocale = (cookieStore.get(COOKIE_KEYS.LOCALE)?.value ||
    cookieStore.get('i18next')?.value) as Language | undefined;

  const theme: Theme =
    rawTheme && Object.values(ThemeEnum).includes(rawTheme as ThemeEnum) ? rawTheme : DEFAULT_THEME;

  const locale: Language =
    rawLocale && Object.values(LanguageEnum).includes(rawLocale as LanguageEnum)
      ? rawLocale
      : DEFAULT_LANGUAGE;

  const isDark = theme === ThemeEnum.DARK;

  return (
    <html
      lang={locale}
      className={`${inter.variable} h-full antialiased ${isDark ? 'dark' : ''}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const cookieTheme = document.cookie.match(/(?:^|; )theme=([^;]*)/)?.[1];
                const isDark = cookieTheme === 'dark' || ((!cookieTheme || cookieTheme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Provider initialLocale={locale} initialTheme={theme}>
          {children}
        </Provider>
      </body>
    </html>
  );
}

