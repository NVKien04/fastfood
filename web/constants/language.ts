export enum LanguageEnum {
  VI = 'vi',
  EN = 'en',
  JA = 'ja',
}

export const LANGUAGES = [
  { code: LanguageEnum.VI, name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: LanguageEnum.EN, name: 'English', flag: '🇬🇧' },
  { code: LanguageEnum.JA, name: '日本語', flag: '🇯🇵' },
] as const;

export type SupportedLanguage = (typeof LANGUAGES)[number]['code'];
export type Language = SupportedLanguage;

export const DEFAULT_LANGUAGE: Language = LanguageEnum.VI;
export const DEFAULT_LANGUAGE_FALLBACK: Language = LanguageEnum.VI;
