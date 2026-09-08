import { SliceCreator } from '../type';
import i18n from '@/configs/i18n';
import {
  Language,
  THEME,
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  ThemeEnum,
  LanguageEnum,
  COOKIE_KEYS,
} from '@/constants';
import { getCookie, setCookie } from '@/utils/cookie';
import { setThemeCookie, setLocaleCookie } from '@/actions/cookie';

export type { Language, THEME };

export type AppSlice = {
  locale: Language;
  theme: THEME;
  deliveryAddress: string;
  updateTheme: (payload: AppSlice['theme']) => void;
  updateLocale: (payload: AppSlice['locale']) => void;
  setDeliveryAddress: (address: string) => void;
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

const getInitialTheme = (): THEME => {
  if (typeof document !== 'undefined') {
    const cookieTheme = getCookie(COOKIE_KEYS.THEME);
    if (cookieTheme && Object.values(ThemeEnum).includes(cookieTheme as ThemeEnum)) {
      return cookieTheme as THEME;
    }
  }
  return DEFAULT_THEME;
};

const getInitialLocale = (): Language => {
  if (typeof document !== 'undefined') {
    const cookieLocale = getCookie(COOKIE_KEYS.LOCALE);
    if (cookieLocale && Object.values(LanguageEnum).includes(cookieLocale as LanguageEnum)) {
      return cookieLocale as Language;
    }
  }
  return DEFAULT_LANGUAGE;
};

export const createAppSlice: SliceCreator<AppSlice> = (set) => ({
  locale: getInitialLocale(),
  theme: getInitialTheme(),
  deliveryAddress: 'Đường Trương Định/Ngõ 58 Tổ 10D, Tương Mai, Hoàng Mai, Hà Nội',

  updateTheme: (payload: AppSlice['theme']) => {
    applyThemeToDOM(payload);
    setCookie(COOKIE_KEYS.THEME, payload);
    setThemeCookie(payload).catch(() => {});
    set((state) => {
      state.theme = payload;
    });
  },

  updateLocale: (payload: AppSlice['locale']) => {
    setCookie(COOKIE_KEYS.LOCALE, payload);
    setLocaleCookie(payload).catch(() => {});
    if (typeof window !== 'undefined' && i18n.isInitialized) {
      i18n.changeLanguage(payload);
    }
    set((state) => {
      state.locale = payload;
    });
  },

  setDeliveryAddress: (address: string) => {
    set((state) => {
      state.deliveryAddress = address;
    });
  },
});

