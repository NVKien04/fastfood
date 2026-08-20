'use client';

import { useMemo, FC } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CategoryBar, CategoryItem, getCategoryIcon } from '@/components/layout/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { formatVND } from '@/utils';
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
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: getCategoryIcon(cat.name),
    }));
  }, [categories]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] text-gray-900">
      {/* 1. Category Bar Header Sticky */}
      {categoryBarItems.length > 0 && (
        <CategoryBar
          categories={categoryBarItems}
          selectedCategoryId={activeCategorySlug}
          onSelectCategory={(id) => handleCategoryClick(String(id))}
        />
      )}

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {t('PRODUCT.MENU_TITLE', 'Thực Đơn Món Ăn')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {t('PRODUCT.MENU_SUBTITLE', 'Khám phá các món ăn nhanh thơm ngon, đậm đà hương vị')}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('PRODUCT.SEARCH_PLACEHOLDER', 'Tìm kiếm món ăn...')}
              className="pl-10 h-11 rounded-2xl bg-white border-gray-200 focus:border-red-500 focus:ring-red-500/20 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-3" />
            <p className="text-sm font-medium text-gray-500">
              {t('COMMON.LOADING', 'Đang tải thực đơn...')}
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && productError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {t('COMMON.ERROR', 'Không thể tải danh sách món ăn')}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mb-4">
              Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.
            </p>
            <Button
              onClick={() => refetchProducts()}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold px-4 py-2"
            >
              {t('COMMON.RETRY', 'Thử lại')}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !productError && categoryGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">
              {t('PRODUCT.EMPTY_PRODUCTS', 'Không tìm thấy món ăn nào')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md">
              {t('PRODUCT.EMPTY_PRODUCTS_DESC', 'Vui lòng thử chọn danh mục khác hoặc thay đổi từ khóa tìm kiếm.')}
            </p>
          </div>
        )}

        {/* Product Groups */}
        {!isLoading &&
          !productError &&
          categoryGroups.map((group) => (
            <section
              key={group.category.id}
              id={group.category.slug}
              className="mb-12 scroll-mt-28"
            >
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {group.category.name}
                </h2>
                <span className="text-xs font-bold text-gray-400 px-2 py-0.5 rounded-full bg-gray-100">
                  {group.products.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
              <div className="relative w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-gray-900 text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartTotalCount}
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-300">Giỏ hàng của bạn</span>
                <span className="text-sm font-black text-white">
                  {formatVND(cartTotalPrice)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 group-hover:text-red-400 transition-colors">
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
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};
