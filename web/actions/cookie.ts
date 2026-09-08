'use server';

import { cookies } from 'next/headers';
import { COOKIE_KEYS, COOKIE_MAX_AGE, Theme, Language } from '@/constants';

/**
 * Ghi cookie Theme trên server (Server Action)
 */
export async function setThemeCookie(theme: Theme): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_KEYS.THEME, theme, {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
}

/**
 * Ghi cookie Locale trên server (Server Action)
 */
export async function setLocaleCookie(locale: Language): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_KEYS.LOCALE, locale, {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
}
