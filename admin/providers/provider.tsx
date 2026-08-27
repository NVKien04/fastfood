'use client';

import { ReactNode } from 'react';
import QueryProvider from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { I18nProvider } from './I18nProvider';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </QueryProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

