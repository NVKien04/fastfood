'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, SupportedLanguage } from '@/constants';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/stores';

type LanguageSwitcherProps = {
  variant?: 'compact' | 'full';
  className?: string;
};

export const LanguageSwitcher = ({ variant = 'compact', className = '' }: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation();
  const updateLocale = useStore((s) => s.updateLocale);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentLang = useMemo(() => {
    const code = (i18n.language?.split('-')[0] || 'vi') as SupportedLanguage;
    return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
  }, [i18n.language]);

  const handleChangeLanguage = async (code: SupportedLanguage) => {
    updateLocale(code);
    setIsOpen(false);
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
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
        variant="outline"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('NAV.SELECT_LANGUAGE')}
        className={`h-9 px-3 gap-1.5 rounded-full border bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 font-bold shadow-xs cursor-pointer ${
          isOpen
            ? 'border-orange-500/50 ring-2 ring-orange-500/10'
            : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400 shrink-0" />
        {variant === 'full' ? (
          <span className="font-semibold text-gray-800 dark:text-zinc-200">{currentLang.name}</span>
        ) : (
          <span className="uppercase text-[11px] font-extrabold tracking-wider text-gray-800 dark:text-zinc-200">
            {currentLang.code}
          </span>
        )}
        <ChevronDown
          className={`w-3 h-3 text-gray-400 dark:text-zinc-500 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-gray-900 dark:text-white' : ''
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-black/60 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 select-none">
          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 border-b border-gray-100 dark:border-zinc-800 mb-1">
            {t('NAV.SELECT_LANGUAGE')}
          </div>
          <div className="space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = (i18n.language?.split('-')[0] || 'vi') === lang.code;
              return (
                <Button
                  key={lang.code}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleChangeLanguage(lang.code)}
                  className={`w-full h-9 flex items-center justify-between px-3 text-xs font-semibold rounded-xl cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff6900] dark:text-orange-400 font-bold hover:bg-orange-100 dark:hover:bg-orange-950/60'
                      : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#ff6900] stroke-[2.5]" />}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
