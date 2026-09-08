'use client';

import { useEffect, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/configs/i18n';
import { Language } from '@/constants';
import { useStore } from '@/stores';

type I18nProviderProps = {
  children: ReactNode;
  initialLocale?: Language;
};

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const updateLocale = useStore((s) => s.updateLocale);

  // Đồng bộ locale từ server cookie khi khởi tạo
  useEffect(() => {
    if (initialLocale) {
      if (i18n.isInitialized && i18n.language !== initialLocale) {
        i18n.changeLanguage(initialLocale);
      }
      if (useStore.getState().locale !== initialLocale) {
        updateLocale(initialLocale);
      }
    }
  }, [initialLocale, updateLocale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

