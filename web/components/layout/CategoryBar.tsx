'use client';

import { ReactNode, useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCategoryTranslationKey, formatCategoryName } from '@/helpers/product.helper';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type CategoryItem = {
  id: number | string;
  name: string;
  icon?: ReactNode;
  slug?: string;
  txKey?: string;
};

export const DEFAULT_CATEGORY_TABS: CategoryItem[] = [
  { id: 'pizza', name: 'Pizza', txKey: 'CATEGORY.PIZZA' },
  { id: 'combo', name: 'Combo', txKey: 'CATEGORY.COMBO' },
  { id: 'khai-vi', name: 'Khai vị', txKey: 'CATEGORY.APPETIZERS' },
  { id: 'do-uong', name: 'Đồ uống', txKey: 'CATEGORY.DRINKS' },
  { id: 'ca-phe', name: 'Cà phê', txKey: 'CATEGORY.COFFEE' },
  { id: 'my-y', name: 'Mỳ Ý', txKey: 'CATEGORY.PASTA' },
];

type CategoryBarProps = {
  categories?: CategoryItem[];
  selectedCategoryId?: number | string | null;
  onSelectCategory?: (id: number | string | null) => void;
  className?: string;
};

export const CategoryBar = ({
  categories = DEFAULT_CATEGORY_TABS,
  selectedCategoryId = 'pizza',
  onSelectCategory,
  className = '',
}: CategoryBarProps) => {
  const { t, i18n } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const categoryList = useMemo(() => (categories.length > 0 ? categories : DEFAULT_CATEGORY_TABS), [categories]);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll]);

  // Auto scroll active tab into view
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedCategoryId]);

  const handleScroll = (direction: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({
      left: direction === 'left' ? -240 : 240,
      behavior: 'smooth',
    });
  };

  const getCategoryTitle = (category: CategoryItem) => {
    if (category.txKey) return t(category.txKey);
    const key = getCategoryTranslationKey(category.name || String(category.id));
    if (key && i18n.exists(key)) return t(key);
    return formatCategoryName(category.name);
  };

  return (
    <div
      className={cn(
        'sticky top-27.5 z-30 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800/80 transition-colors',
        className,
      )}
    >
      <div className="max-w-300 w-full mx-auto px-4 flex items-center relative">
        {/* Scroll Left */}
        {canScrollLeft && (
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            onClick={() => handleScroll('left')}
            aria-label={t('CART.SCROLL_LEFT')}
            className="absolute left-2 z-10 size-8 rounded-full bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 shadow-md text-gray-700 dark:text-zinc-300 cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </Button>
        )}

        {/* Categories List */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 overflow-x-auto scrollbar-none py-3 px-1 scroll-smooth w-full select-none"
        >
          {categoryList.map((category) => {
            const isSelected =
              selectedCategoryId !== null &&
              String(selectedCategoryId).toLowerCase() === String(category.id).toLowerCase();

            return (
              <Button
                key={category.id}
                ref={isSelected ? activeTabRef : null}
                type="button"
                variant="ghost"
                onClick={() => onSelectCategory?.(category.id)}
                className={cn(
                  'h-auto px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold shrink-0 cursor-pointer transition-all',
                  isSelected
                    ? 'bg-[#f0f3f6] dark:bg-zinc-800 text-gray-900 dark:text-white font-extrabold shadow-xs hover:bg-[#e4e8ec] dark:hover:bg-zinc-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900/60 font-semibold',
                )}
              >
                <span className="whitespace-nowrap">{getCategoryTitle(category)}</span>
              </Button>
            );
          })}
        </div>

        {/* Scroll Right */}
        {canScrollRight && (
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            onClick={() => handleScroll('right')}
            aria-label={t('CART.SCROLL_RIGHT')}
            className="absolute right-2 z-10 size-8 rounded-full bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 shadow-md text-gray-700 dark:text-zinc-300 cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
