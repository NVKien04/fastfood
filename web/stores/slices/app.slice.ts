import { SliceCreator } from '../type';
import i18n, { SupportedLanguage } from '@/configs/i18n';

export type Language = SupportedLanguage;

export type THEME = 'light' | 'dark' | 'system';

export type AppSlice = {
  locale: Language;
  theme: THEME;
  updateTheme: (payload: AppSlice['theme']) => void;
  updateLocale: (payload: AppSlice['locale']) => void;
};

const applyThemeToDOM = (theme: THEME) => {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const createAppSlice: SliceCreator<AppSlice> = (set) => ({
  locale: 'vi',
  theme: 'light',

  updateTheme: (payload: AppSlice['theme']) => {
    applyThemeToDOM(payload);
    set((state) => {
      state.theme = payload;
    });
  },

  updateLocale: (payload: AppSlice['locale']) => {
    if (typeof window !== 'undefined' && i18n.isInitialized) {
      i18n.changeLanguage(payload);
    }
    set((state) => {
      state.locale = payload;
    });
  },
});
