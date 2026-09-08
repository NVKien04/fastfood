import { COOKIE_MAX_AGE } from '@/constants/cookie';

/**
 * Lấy giá trị cookie theo tên ở phía client
 */
export const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const rawVal = parts.pop()?.split(';').shift();
    return rawVal ? decodeURIComponent(rawVal) : undefined;
  }
  return undefined;
};

/**
 * Ghi cookie ở phía client
 */
export const setCookie = (
  name: string,
  value: string,
  options?: { maxAge?: number; path?: string; sameSite?: 'Lax' | 'Strict' | 'None' },
): void => {
  if (typeof document === 'undefined') return;
  const maxAge = options?.maxAge ?? COOKIE_MAX_AGE;
  const path = options?.path ?? '/';
  const sameSite = options?.sameSite ?? 'Lax';

  document.cookie = `${name}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`;
};

/**
 * Xóa cookie ở phía client
 */
export const deleteCookie = (name: string, path = '/'): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=${path}; max-age=0; SameSite=Lax`;
};
