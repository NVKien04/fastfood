'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CategoryBar, CategoryItem } from '@/components/layout/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { categoryToSlug, getCategoryTranslationKey, formatCategoryName } from '@/helpers';
import { Button } from '@/components/ui/button';
import { Utensils, Loader2 } from 'lucide-react';
import { useProductMenu } from './hooks/useProductMenu';

export const ProductList = () => {
  const { t, i18n } = useTranslation();

  const {
    categories,
    categoryGroups,
    activeCategorySlug,
    isModalOpen,
    activeModalProduct,
    detailLoading,
    isLoading,
    productError,
    refetchProducts,
    handleCategoryClick,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleQuickAdd,
  } = useProductMenu();

  const categoryBarItems: CategoryItem[] = useMemo(() => {
    return categories.map((cat) => {
      const slug = categoryToSlug(cat.name);
      return {
        id: slug,
        name: cat.name,
        slug,
      };
    });
  }, [categories]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors">
      {/* 1. Category Bar Header Sticky */}
      {categoryBarItems.length > 0 && (
        <CategoryBar
          categories={categoryBarItems}
          selectedCategoryId={activeCategorySlug}
          onSelectCategory={(id) => handleCategoryClick(String(id))}
        />
      )}

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-6 sm:py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-3" />
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
              {t('COMMON.LOADING')}
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && productError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              {t('PRODUCT.CANT_LOAD_MENU')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mb-4">
              {t('PRODUCT.CHECK_CONNECTION')}
            </p>
            <Button
              onClick={() => refetchProducts()}
              className="bg-[#ff6900] hover:bg-[#e05d00] text-white rounded-xl text-xs font-bold px-4 py-2 cursor-pointer"
            >
              {t('COMMON.RETRY')}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !productError && categoryGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 flex items-center justify-center mb-4">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
              {t('PRODUCT.EMPTY_PRODUCTS')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-md">
              {t('PRODUCT.EMPTY_PRODUCTS_DESC')}
            </p>
          </div>
        )}

        {/* Product Groups */}
        {!isLoading &&
          !productError &&
          categoryGroups.map((group) => {
            const categoryKey = getCategoryTranslationKey(group.category.name);
            const categoryHeading =
              categoryKey && i18n.exists(categoryKey) ? t(categoryKey) : formatCategoryName(group.category.name);

            return (
              <section key={group.category.id} id={group.category.slug} className="mb-14 scroll-mt-48">
                <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-2 ">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {categoryHeading}
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                  {group.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetail={handleOpenDetailModal}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>
              </section>
            );
          })}
      </main>

      {/* Product Detail Customization Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        isOpen={isModalOpen}
        isLoading={detailLoading}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};
