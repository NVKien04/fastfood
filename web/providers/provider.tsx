'use client';

import { ReactNode } from 'react';
import QueryProvider from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { I18nProvider } from './I18nProvider';
import { ThemeProvider } from './ThemeProvider';
import { Theme, Language } from '@/constants';

type ProviderProps = {
  children: ReactNode;
  initialLocale?: Language;
  initialTheme?: Theme;
};

export default function Provider({ children, initialLocale, initialTheme }: ProviderProps) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <I18nProvider initialLocale={initialLocale}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

