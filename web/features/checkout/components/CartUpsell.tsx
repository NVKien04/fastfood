'use client';

import { useMemo, useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useProductList } from '@/services/react-query/queries/product';
import { useCategoryList } from '@/services/react-query/queries/category';
import { useStore } from '@/stores';
import { formatVND } from '@/utils';
import { Plus, Utensils, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductDetailResponseDto } from '@/services/apis/main/generated/data-contracts';

export const CartUpsell = () => {
  const { t } = useTranslation();
  const addItem = useStore((s) => s.addItem);
  const { data: categoriesData } = useCategoryList();
  const { data: productsData } = useProductList({ page: 1, limit: 100 });
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 1. Identify category IDs that belong to drinks or coffee
  const drinkCategoryIds = useMemo(() => {
    if (!categoriesData) return [];
    return categoriesData
      .filter((c) => {
        const name = c.name.toLowerCase();
        const slug = (c.slug || '').toLowerCase();
        return (
          name.includes('uống') ||
          name.includes('nước') ||
          name.includes('drink') ||
          name.includes('cà phê') ||
          name.includes('cafe') ||
          name.includes('coffee') ||
          slug.includes('drink') ||
          slug.includes('cafe') ||
          slug.includes('coffee') ||
          slug.includes('uong')
        );
      })
      .map((c) => c.id);
  }, [categoriesData]);

  // 2. Filter products belonging to those drink categories
  const upsellProducts = useMemo(() => {
    if (!productsData || productsData.kind !== 'OK' || !productsData.data) return [];

    const list = productsData.data;

    // Filter by categoryId match
    const drinkProducts = list.filter((p) => drinkCategoryIds.includes(p.categoryId));

    if (drinkProducts.length > 0) return drinkProducts;

    // Fallback: Filter by keyword in product names (if category data is loading or empty)
    const keywordDrinkProducts = list.filter((p) => {
      const name = p.name.toLowerCase();
      const slug = p.slug.toLowerCase();

      // Exclude main pizza courses
      if (name.includes('pizza') || name.includes('combo') || slug.includes('pizza') || slug.includes('combo')) {
        return false;
      }

      return (
        name.includes('trà') ||
        name.includes('nước') ||
        name.includes('tea') ||
        name.includes('drink') ||
        name.includes('coca') ||
        name.includes('pepsi') ||
        name.includes('sprite') ||
        name.includes('fanta') ||
        name.includes('cà phê') ||
        name.includes('cafe') ||
        name.includes('coffee') ||
        name.includes('soda')
      );
    });

    if (keywordDrinkProducts.length > 0) return keywordDrinkProducts;

    // Second fallback: Show appetizers/snacks instead of pizzas
    const nonPizzaProducts = list.filter((p) => {
      const name = p.name.toLowerCase();
      return !name.includes('pizza') && !name.includes('combo');
    });

    if (nonPizzaProducts.length > 0) return nonPizzaProducts;

    // Third fallback: Return products from list
    return list;
  }, [productsData, drinkCategoryIds]);

  const handleQuickAdd = (product: ProductDetailResponseDto) => {
    addItem({
      product,
      variant: product.variants?.[0] || null,
      selectedIngredients: [],
      quantity: 1,
    });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 320; // Scroll width of roughly one card + gap
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (upsellProducts.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
          {t('CART.YOU_MIGHT_LIKE')}
        </h3>
      </div>

      {/* Relative Wrapper for Slider & Navigation Buttons */}
      <div className="relative group/slider">
        {/* Left Scroll Button */}
        {upsellProducts.length > 2 && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all opacity-0 group-hover/slider:opacity-100"
            title={t('CART.SCROLL_LEFT')}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Horizontal Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-3 pt-0.5 -mx-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          {upsellProducts.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-5 rounded-3xl bg-gray-50/70 dark:bg-zinc-950/70 border border-gray-100 dark:border-zinc-800/80 hover:border-orange-200 dark:hover:border-zinc-700 transition-all group w-[380px] sm:w-[440px] shrink-0 select-none"
            >
              <div className="flex items-center gap-4.5 min-w-0">
                <div className="relative w-24 h-24 rounded-2xl bg-white dark:bg-zinc-800 p-2 shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-700 shadow-xs">
                  {product.img ? (
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Utensils className="w-10 h-10 text-gray-400 dark:text-zinc-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-black text-gray-900 dark:text-white truncate">{product.name}</h4>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 truncate mt-1 max-w-[200px] line-clamp-2">
                    {product.description || t('CART.SIDE_DISH')}
                  </p>
                  <div className="text-base font-black text-[#ff6900] mt-2">{formatVND(product.basePrice || 0)}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickAdd(product)}
                className="w-11 h-11 rounded-full bg-[#ff6900] hover:bg-[#e05d00] text-white flex items-center justify-center shadow-md shadow-orange-500/20 active:scale-95 transition-transform cursor-pointer shrink-0 ml-3 animate-in fade-in duration-100"
                title={t('CART.ADD_TO_CART_QUICK')}
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        {upsellProducts.length > 2 && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95 transition-all opacity-0 group-hover/slider:opacity-100"
            title={t('CART.SCROLL_RIGHT')}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
