export enum LanguageEnum {
  VI = 'vi',
  EN = 'en',
  JA = 'ja',
}

export const LANGUAGES = [
  { code: LanguageEnum.EN, name: 'English' },
  { code: LanguageEnum.VI, name: 'Tiếng Việt' },
  { code: LanguageEnum.JA, name: '日本語' },
] as const;

export type SupportedLanguage = (typeof LANGUAGES)[number]['code'];
export type Language = SupportedLanguage;

export const DEFAULT_LANGUAGE: Language = LanguageEnum.VI;
export const DEFAULT_LANGUAGE_FALLBACK: Language = LanguageEnum.VI;
