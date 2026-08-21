'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, SupportedLanguage } from '@/constants';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/stores';

type LanguageSwitcherProps = {
  variant?: 'compact' | 'full';
  className?: string;
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'compact', className = '' }) => {
  const { i18n } = useTranslation();
  const updateLocale = useStore((s) => s.updateLocale);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const currentLang = React.useMemo(() => {
    const code = (i18n.language?.split('-')[0] || 'vi') as SupportedLanguage;
    return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
  }, [i18n.language]);

  const handleChangeLanguage = async (code: SupportedLanguage) => {
    updateLocale(code);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-zinc-200 shadow-xs transition-all"
      >
        <span className="text-base">{currentLang.flag}</span>
        {variant === 'full' ? (
          <span>{currentLang.name}</span>
        ) : (
          <span className="uppercase text-[11px] font-black tracking-wider text-gray-800 dark:text-zinc-200">{currentLang.code}</span>
        )}
        <Globe className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 ml-0.5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-black/60 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 border-b border-gray-50 dark:border-zinc-800 mb-1">
            Chọn ngôn ngữ
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = (i18n.language?.split('-')[0] || 'vi') === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleChangeLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  isSelected
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                    : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-red-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
