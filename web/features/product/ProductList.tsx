'use client';

import { useMemo, FC } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CategoryBar, CategoryItem, getCategoryIcon } from '@/components/layout/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { formatVND } from '@/utils';
import { categoryToSlug } from '@/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Utensils, Search, Loader2, ShoppingBag } from 'lucide-react';
import { useProductMenu } from './hooks/useProductMenu';

export const ProductList: FC = () => {
  const { t } = useTranslation();

  const {
    categories,
    categoryGroups,
    activeCategorySlug,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    activeModalProduct,
    detailLoading,
    isLoading,
    productError,
    refetchProducts,
    cartTotalCount,
    cartTotalPrice,
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
        icon: getCategoryIcon(cat.name),
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
              {t('COMMON.LOADING', 'Đang tải thực đơn...')}
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
              {t('COMMON.ERROR', 'Không thể tải danh sách món ăn')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mb-4">
              Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.
            </p>
            <Button
              onClick={() => refetchProducts()}
              className="bg-[#ff6900] hover:bg-[#e05d00] text-white rounded-xl text-xs font-bold px-4 py-2 cursor-pointer"
            >
              {t('COMMON.RETRY', 'Thử lại')}
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
              {t('PRODUCT.EMPTY_PRODUCTS', 'Không tìm thấy món ăn nào')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-md">
              {t('PRODUCT.EMPTY_PRODUCTS_DESC', 'Vui lòng thử chọn danh mục khác hoặc thay đổi từ khóa tìm kiếm.')}
            </p>
          </div>
        )}

        {/* Product Groups */}
        {!isLoading &&
          !productError &&
          categoryGroups.map((group) => (
            <section key={group.category.id} id={group.category.slug} className="mb-14 scroll-mt-48">
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-2 ">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {group.category.name}
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
          ))}
      </main>

      {/* Floating Bottom Cart Bar for Mobile & Desktop */}
      {cartTotalCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Link
            href="/checkout"
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-900 hover:bg-black text-white shadow-2xl shadow-gray-900/40 border border-gray-800 transition-transform active:scale-[0.99] group"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-[#ff6900] flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-gray-900 text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartTotalCount}
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-300">Giỏ hàng của bạn</span>
                <span className="text-sm font-black text-white">{formatVND(cartTotalPrice)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff6900] group-hover:text-orange-400 transition-colors">
              <span>Xem đơn</span>
              <span>→</span>
            </div>
          </Link>
        </div>
      )}

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
