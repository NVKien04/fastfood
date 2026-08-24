export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export type Theme = `${ThemeEnum}`;
export type THEME = Theme;

export const DEFAULT_THEME: Theme = ThemeEnum.LIGHT;
