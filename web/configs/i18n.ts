import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vi from '@/locales/vi.json';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';

import { LANGUAGES, SupportedLanguage, DEFAULT_LANGUAGE_FALLBACK } from '@/constants';
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
      fallbackLng: DEFAULT_LANGUAGE_FALLBACK,
      supportedLngs: ['vi', 'en', 'ja'],
      defaultNS: 'translation',
      fallbackNS: 'translation',
      detection: {
        order: ['localStorage', 'cookie', 'navigator'],
        lookupLocalStorage: 'i18nextLng',
        lookupCookie: 'i18next',
        caches: ['localStorage'],
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
