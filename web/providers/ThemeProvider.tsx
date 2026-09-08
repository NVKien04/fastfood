'use client';

import { useEffect, ReactNode } from 'react';
import { useStore } from '@/stores';
import { Theme } from '@/constants';

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme?: Theme;
};

export const ThemeProvider = ({ children, initialTheme }: ThemeProviderProps) => {
  const theme = useStore((s) => s.theme);
  const updateTheme = useStore((s) => s.updateTheme);

  // Đồng bộ theme từ server cookie khi khởi tạo
  useEffect(() => {
    if (initialTheme && useStore.getState().theme !== initialTheme) {
      updateTheme(initialTheme);
    }
  }, [initialTheme, updateTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const isDark =
      theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Listen to system preference changes if system theme is selected
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentTheme = useStore.getState().theme;
      if (currentTheme === 'system') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return <>{children}</>;
};
