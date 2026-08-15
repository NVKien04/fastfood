import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vi from '@/locales/vi.json';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';

export const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
] as const;

export type SupportedLanguage = (typeof LANGUAGES)[number]['code'];

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
      fallbackLng: 'vi',
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
