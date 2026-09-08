import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vi from '@/locales/vi.json';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';

import { LANGUAGES, SupportedLanguage, DEFAULT_LANGUAGE_FALLBACK, COOKIE_KEYS } from '@/constants';
export { LANGUAGES, type SupportedLanguage };

export const resources = {
  vi: {
    translation: vi,
  },
  en: {
    translation: en,
  },
  ja: {
    translation: ja,
  },
} as const;

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: typeof window === 'undefined' ? DEFAULT_LANGUAGE_FALLBACK : undefined,
      fallbackLng: DEFAULT_LANGUAGE_FALLBACK,
      supportedLngs: ['vi', 'en', 'ja'],
      defaultNS: 'translation',
      fallbackNS: 'translation',
      detection: {
        order: ['cookie', 'localStorage', 'navigator'],
        lookupCookie: COOKIE_KEYS.LOCALE,
        lookupLocalStorage: 'i18nextLng',
        caches: ['cookie', 'localStorage'],
        cookieMinutes: 60 * 24 * 365,
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
        bindI18n: 'languageChanged loaded',
        bindI18nStore: 'added removed',
      },
    });
}

export default i18n;
