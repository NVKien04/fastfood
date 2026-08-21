'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Pizza, Flame, Sparkles, Smile, UtensilsCrossed, Drumstick, CupSoda, Leaf } from 'lucide-react';

export type CategoryItem = {
  id: number | string;
  name: string;
  icon?: React.ReactNode;
  slug?: string;
};

export const getCategoryIcon = (name: string): React.ReactNode => {
  const upper = name.toUpperCase();
  if (upper.includes('MELT')) return <Sparkles className="w-5 h-5" />;
  if (upper.includes('GIÁ ĐỈNH') || upper.includes('HOT') || upper.includes('DEAL'))
    return <Flame className="w-5 h-5" />;
  if (upper.includes('PIZZA')) return <Pizza className="w-5 h-5" />;
  if (upper.includes('KID') || upper.includes('TRẺ EM')) return <Smile className="w-5 h-5" />;
  if (upper.includes('KHAI VỊ') || upper.includes('STARTER')) return <UtensilsCrossed className="w-5 h-5" />;
  if (upper.includes('GÀ') || upper.includes('CHICKEN')) return <Drumstick className="w-5 h-5" />;
  if (upper.includes('UỐNG') || upper.includes('NƯỚC') || upper.includes('DRINK') || upper.includes('BEVERAGE'))
    return <CupSoda className="w-5 h-5" />;
  if (upper.includes('CAY') || upper.includes('SPICY')) return <Flame className="w-5 h-5" />;
  if (upper.includes('CHAY') || upper.includes('VEGAN')) return <Leaf className="w-5 h-5" />;
  return <Pizza className="w-5 h-5" />;
};

// Default category tabs matching the minimal screenshot
export const DEFAULT_CATEGORY_TABS: CategoryItem[] = [
  { id: 'pizza', name: 'Pizza' },
  { id: 'combo', name: 'Combo' },
  { id: 'roman-pizza', name: 'Roman pizza' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'coffee-and-tea', name: 'Coffee and tea' },
  { id: 'drinks', name: 'Drinks' },
];

type CategoryBarProps = {
  categories?: CategoryItem[];
  selectedCategoryId?: number | string | null;
  onSelectCategory?: (id: number | string | null) => void;
  className?: string;
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories = DEFAULT_CATEGORY_TABS,
  selectedCategoryId = 'pizza',
  onSelectCategory,
  className = '',
}) => {
  // 1. Local state & refs
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const activeTabRef = React.useRef<HTMLButtonElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = React.useState<boolean>(true);

  // 2. Memoized values (useMemo)
  const categoryList = React.useMemo(() => {
    return categories.length > 0 ? categories : DEFAULT_CATEGORY_TABS;
  }, [categories]);

  // 3. Effects (useEffect)
  const _checkScrollLimits = React.useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  React.useEffect(() => {
    _checkScrollLimits();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', _checkScrollLimits);
      return () => {
        container.removeEventListener('scroll', _checkScrollLimits);
      };
    }
  }, [_checkScrollLimits]);

  // Auto scroll active tab into horizontal view
  React.useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCategoryId]);

  // 4. Event handlers
  const _handleScroll = React.useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 240;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  const _handleCategoryClick = React.useCallback(
    (id: number | string) => {
      if (onSelectCategory) {
        onSelectCategory(id);
      }
    },
    [onSelectCategory],
  );

  // Helper to format category title nicely (e.g. "PIZZA" -> "Pizza", "THỨC UỐNG" -> "Thức uống")
  const formatCategoryName = (name: string) => {
    if (!name) return '';
    if (name === name.toUpperCase() && name.length > 2) {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }
    return name;
  };

  // 5. Return JSX
  return (
    <div
      className={`w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800/80 sticky top-[110px] z-30 transition-colors ${className}`}
    >
      <div className="max-w-[1200px] w-full mx-auto px-4 flex items-center relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => _handleScroll('left')}
            aria-label="Cuộn trái"
            className="absolute left-2 z-10 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Categories Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 overflow-x-auto scrollbar-none py-3 px-1 scroll-smooth w-full select-none"
        >
          {categoryList.map((category) => {
            const isSelected =
              selectedCategoryId !== null &&
              (selectedCategoryId === category.id ||
                String(selectedCategoryId).toLowerCase() === String(category.id).toLowerCase());

            return (
              <button
                key={category.id}
                ref={isSelected ? activeTabRef : null}
                type="button"
                onClick={() => _handleCategoryClick(category.id)}
                className={`flex items-center justify-center px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all relative shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#f0f3f6] dark:bg-zinc-800 text-gray-900 dark:text-white font-extrabold shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900/60 font-semibold'
                }`}
              >
                <span className="whitespace-nowrap">
                  {formatCategoryName(category.name)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => _handleScroll('right')}
            aria-label="Cuộn phải"
            className="absolute right-2 z-10 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
