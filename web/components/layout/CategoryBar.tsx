'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Pizza,
  Sparkles,
  Smile,
  UtensilsCrossed,
  Drumstick,
  CupSoda,
  Leaf,
} from 'lucide-react';

export type CategoryItem = {
  id: number | string;
  name: string;
  icon?: React.ReactNode;
  slug?: string;
};

export const getCategoryIcon = (name: string): React.ReactNode => {
  const upper = name.toUpperCase();
  if (upper.includes('MELT')) return <Sparkles className="w-5 h-5" />;
  if (upper.includes('GIÁ ĐỈNH') || upper.includes('HOT') || upper.includes('DEAL')) return <Flame className="w-5 h-5" />;
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

// Default category tabs matching the image
export const DEFAULT_CATEGORY_TABS: CategoryItem[] = [
  { id: 'the-melts', name: 'THE MELTS', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'pizza-gia-dinh', name: 'PIZZA GIÁ ĐỈNH', icon: <Flame className="w-5 h-5" /> },
  { id: 'pizza', name: 'PIZZA', icon: <Pizza className="w-5 h-5" /> },
  { id: 'kids-menu', name: 'KIDS MENU', icon: <Smile className="w-5 h-5" /> },
  { id: 'mon-khai-vi', name: 'MÓN KHAI VỊ', icon: <UtensilsCrossed className="w-5 h-5" /> },
  { id: 'ghien-ga', name: 'GHIỀN GÀ', icon: <Drumstick className="w-5 h-5" /> },
  { id: 'thuc-uong', name: 'THỨC UỐNG', icon: <CupSoda className="w-5 h-5" /> },
  { id: 'cay', name: 'CAY', icon: <Flame className="w-5 h-5" /> },
  { id: 'chay', name: 'CHAY', icon: <Leaf className="w-5 h-5" /> },
];

type CategoryBarProps = {
  categories?: CategoryItem[];
  selectedCategoryId?: number | string | null;
  onSelectCategory?: (id: number | string | null) => void;
  className?: string;
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories = DEFAULT_CATEGORY_TABS,
  selectedCategoryId = 'thuc-uong',
  onSelectCategory,
  className = '',
}) => {
  // 1. Next.js Router & navigation hooks (none needed)

  // 2. Translation hook (none needed)

  // 3. Local state & refs
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const activeTabRef = React.useRef<HTMLButtonElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = React.useState<boolean>(true);

  // 4. Zustand global state (none needed)

  // 5. React Query hooks (none needed)

  // 6. Memoized values (useMemo)
  const categoryList = React.useMemo(() => {
    return categories.length > 0 ? categories : DEFAULT_CATEGORY_TABS;
  }, [categories]);

  // 7. Effects (useEffect)
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

  // 8. Event handlers & internal functions (useCallback)
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

  // 9. Return JSX
  return (
    <div className={`w-full bg-white border-b border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] sticky top-[72px] z-30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => _handleScroll('left')}
            aria-label="Cuộn trái"
            className="absolute left-2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-500 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Categories Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 sm:gap-4 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth w-full select-none"
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
                className={`flex flex-col items-center justify-center gap-1.5 px-4 py-2 min-w-[90px] sm:min-w-[105px] rounded-lg transition-all relative shrink-0 cursor-pointer ${
                  isSelected
                    ? 'text-red-600 font-extrabold'
                    : 'text-gray-700 hover:text-gray-900 font-bold opacity-80 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center transition-transform ${
                    isSelected ? 'scale-110 text-red-600' : 'text-gray-600'
                  }`}
                >
                  {category.icon || getCategoryIcon(category.name)}
                </div>
                <span className="text-[11px] sm:text-xs tracking-tight whitespace-nowrap text-center">
                  {category.name}
                </span>

                {/* Red Underline Indicator */}
                {isSelected && (
                  <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-red-600 rounded-full" />
                )}
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
            className="absolute right-2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-500 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
