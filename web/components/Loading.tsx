'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export type LoadingProps = {
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeConfig = {
  sm: {
    container: 'w-10 h-10 rounded-xl',
    icon: 'w-5 h-5',
    spinner: '-inset-1 rounded-xl border-2',
    text: 'text-[11px]',
    gap: 'gap-2.5',
  },
  md: {
    container: 'w-12 h-12 rounded-2xl',
    icon: 'w-7 h-7',
    spinner: '-inset-1.5 rounded-2xl border-2',
    text: 'text-xs',
    gap: 'gap-3.5',
  },
  lg: {
    container: 'w-14 h-14 rounded-2xl',
    icon: 'w-8 h-8',
    spinner: '-inset-1.5 rounded-2xl border-2',
    text: 'text-xs sm:text-sm',
    gap: 'gap-4',
  },
};

export const Loading = ({
  text,
  fullScreen = false,
  size = 'md',
  className = '',
}: LoadingProps) => {
  const { t } = useTranslation();
  const currentSize = sizeConfig[size];
  const displayText = text ?? t('COMMON.LOADING');

  const content = (
    <div className={cn('flex flex-col items-center justify-center', currentSize.gap)}>
      {/* Brand logo badge with spinner ring */}
      <div className="relative flex items-center justify-center select-none">
        <div
          className={cn(
            'bg-[#ff6900] flex items-center justify-center text-white shadow-lg shadow-orange-500/25',
            currentSize.container,
          )}
        >
          <svg viewBox="0 0 24 24" className={cn('fill-white', currentSize.icon)} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.55.45-1 1-1h14c.55 0 1 .45 1 1 0 4.41-3.59 8-8 8zm6.5-10H5.5c-.45-1.92 1.4-3.5 3.5-3.5h6c2.1 0 3.95 1.58 3.5 3.5z" />
          </svg>
        </div>
        <div
          className={cn(
            'absolute border-orange-500/20 border-t-[#ff6900] animate-spin pointer-events-none',
            currentSize.spinner,
          )}
        />
      </div>

      {/* Loading text label */}
      {displayText && (
        <p
          suppressHydrationWarning
          className={cn(
            'font-semibold tracking-wide text-gray-500 dark:text-zinc-400 animate-pulse text-center select-none',
            currentSize.text,
          )}
        >
          {displayText}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors',
          className,
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 sm:py-20 w-full transition-colors', className)}>
      {content}
    </div>
  );
};
