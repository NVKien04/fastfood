'use client';

import * as React from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/stores';
import { ThemeEnum, THEME } from '@/constants';

type ThemeToggleProps = {
  className?: string;
  variant?: 'dropdown' | 'toggle';
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'dropdown',
}) => {
  const theme = useStore((s) => s.theme);
  const updateTheme = useStore((s) => s.updateTheme);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

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

  const handleSelectTheme = (newTheme: THEME) => {
    updateTheme(newTheme);
    setIsOpen(false);
  };

  const handleQuickToggle = () => {
    if (theme === ThemeEnum.DARK) {
      updateTheme(ThemeEnum.LIGHT);
    } else {
      updateTheme(ThemeEnum.DARK);
    }
  };

  if (variant === 'toggle') {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={handleQuickToggle}
        aria-label="Chuyển đổi giao diện Sáng / Tối"
        className={`relative w-9 h-9 p-0 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 shadow-xs transition-all ${className}`}
      >
        <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
        <span className="sr-only">Chuyển theme</span>
      </Button>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Tùy chọn giao diện"
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 h-9 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-zinc-200 shadow-xs transition-all"
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {theme === ThemeEnum.DARK ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : theme === ThemeEnum.LIGHT ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Laptop className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
          )}
        </div>
        <span className="hidden sm:inline capitalize text-[11px] font-bold">
          {theme === ThemeEnum.DARK ? 'Tối' : theme === ThemeEnum.LIGHT ? 'Sáng' : 'Hệ thống'}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-black/50 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 border-b border-gray-50 dark:border-zinc-800/80 mb-1">
            Giao diện
          </div>

          <button
            type="button"
            onClick={() => handleSelectTheme(ThemeEnum.LIGHT)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
              theme === ThemeEnum.LIGHT
                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Sáng</span>
            </div>
            {theme === ThemeEnum.LIGHT && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectTheme(ThemeEnum.DARK)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
              theme === ThemeEnum.DARK
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tối</span>
            </div>
            {theme === ThemeEnum.DARK && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectTheme(ThemeEnum.SYSTEM)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
              theme === ThemeEnum.SYSTEM
                ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold'
                : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400" />
              <span>Hệ thống</span>
            </div>
            {theme === ThemeEnum.SYSTEM && <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
          </button>
        </div>
      )}
    </div>
  );
};
