import { SliceCreator } from '../type';
import i18n from '@/configs/i18n';
import { Language, THEME, DEFAULT_LANGUAGE, DEFAULT_THEME } from '@/constants';

export type { Language, THEME };

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
  locale: DEFAULT_LANGUAGE,
  theme: DEFAULT_THEME,

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
