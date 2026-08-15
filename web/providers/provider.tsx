'use client';

import QueryProvider from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { I18nProvider } from './I18nProvider';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </I18nProvider>
  );
}
