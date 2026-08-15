'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ProductDetailResponseDto,
  ProductFilterDto,
  ProductIngredientResponseDto,
  ProductVariantResponseDto,
} from '@/services/apis/main/generated/data-contracts';
import { useCategoryList } from '@/services/react-query/queries/category';
import { useProductList, useProductDetail } from '@/services/react-query/queries/product';
import { ProductDetailModal } from './ProductDetailModal';
import { formatVND } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, ChevronLeft, ChevronRight, Search, Loader2, Plus, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useStore } from '@/stores';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);

  // Cart state from Zustand
  const cartTotalCount = useStore((s) => s.getTotalCount());
  const cartTotalPrice = useStore((s) => s.getTotalPrice());

  // Filter State
  const [page, setPage] = React.useState<number>(1);
  const [limit] = React.useState<number>(8);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Selected Detail Modal State
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);
  const [selectedProductFallback, setSelectedProductFallback] = React.useState<ProductDetailResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  // Categories Query
  const { data: categoriesData, isLoading: categoryLoading } = useCategoryList({ page: 1, limit: 100 });
  const categories = React.useMemo(() => categoriesData ?? [], [categoriesData]);

  // Products Query
  const productFilter: ProductFilterDto = React.useMemo(
    () => ({
      page,
      limit,
      ...(selectedCategoryId ? { categoryId: selectedCategoryId } : {}),
    }),
    [page, limit, selectedCategoryId],
  );

  const {
    data: productsData,
    isLoading: loading,
    error: productError,
    refetch: refetchProducts,
  } = useProductList(productFilter);

  const products = React.useMemo(() => (productsData?.kind === 'OK' ? (productsData.data ?? []) : []), [productsData]);
  const pagination = productsData?.kind === 'OK' ? (productsData.pagination ?? null) : null;

  // Product detail query for selected product in modal
  const { data: productDetail, isFetching: detailLoading } = useProductDetail(
    isModalOpen ? (selectedProductId ?? undefined) : undefined,
  );

  const activeModalProduct = productDetail || selectedProductFallback;

  // Map categoryId to name for fast lookup
  const categoryMap = React.useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => {
      map.set(cat.id, cat.name);
    });
    return map;
  }, [categories]);

  // Handle category change
  const handleSelectCategory = (id: number | null) => {
    setSelectedCategoryId(id);
    setPage(1);
  };

  // Client-side search filtering
  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  // Open modal with detail
  const handleOpenDetail = (product: ProductDetailResponseDto) => {
    setSelectedProductId(product.id);
    setSelectedProductFallback(product);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
    setSelectedProductFallback(null);
  };

  const handleAddToCartFromModal = (item: {
    product: ProductDetailResponseDto;
    variant?: ProductVariantResponseDto | null;
    selectedIngredients?: ProductIngredientResponseDto[];
    quantity: number;
    totalPrice: number;
  }) => {
    useStore.getState().addItem({
      product: item.product,
      variant: item.variant,
      selectedIngredients: item.selectedIngredients,
      quantity: item.quantity,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>{t('PRODUCT.MENU_TITLE')}</span>
            <span className="text-red-600">🍕</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t('PRODUCT.MENU_SUBTITLE')}</p>
        </div>

        {/* Search Input, Language Switcher & Cart Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={t('PRODUCT.SEARCH_PLACEHOLDER', 'Tìm kiếm món ăn theo tên...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500/20 bg-white"
            />
          </div>

          <LanguageSwitcher />

          <Link
            href="/checkout"
            className="relative p-2.5 rounded-xl bg-white border border-gray-200 hover:border-red-500 text-gray-700 hover:text-red-600 transition-all flex items-center justify-center shrink-0 shadow-sm"
            title="Xem giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartTotalCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleSelectCategory(null)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border whitespace-nowrap ${
              selectedCategoryId === null
                ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20 scale-[1.02]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>{t('PRODUCT.ALL_CATEGORIES', 'Tất cả món')}</span>
          </button>

          {categoryLoading ? (
            <div className="flex items-center gap-2 text-xs text-gray-400 pl-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
              <span>Đang tải danh mục...</span>
            </div>
          ) : (
            categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border whitespace-nowrap ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20 scale-[1.02]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <p className="text-sm font-medium">{t('COMMON.LOADING', 'Đang tải...')}</p>
        </div>
      ) : productError ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
          <p className="text-red-600 font-semibold mb-3">
            {productError.message || t('COMMON.ERROR', 'Khởi tạo danh sách sản phẩm thất bại')}
          </p>
          <Button
            onClick={() => refetchProducts()}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-100"
          >
            {t('COMMON.RETRY', 'Thử lại')}
          </Button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
          <Utensils className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">
            {t('PRODUCT.EMPTY_PRODUCTS_DESC', 'Không tìm thấy món ăn nào phù hợp trong danh mục này')}
          </p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex flex-col items-center justify-center p-6 border-b border-gray-50 group-hover:from-orange-100 group-hover:to-red-100 transition-colors">
                    <div className="w-28 h-28 rounded-full bg-white/90 shadow-sm border border-orange-100 flex flex-col items-center justify-center gap-1.5 p-3 text-center transition-transform group-hover:scale-105">
                      <Utensils className="w-8 h-8 text-red-500/80" />
                      <span className="text-[10px] font-medium text-gray-400 leading-tight">Chưa có ảnh</span>
                    </div>

                    {/* Featured Badge */}
                    {product.isFeatured === 1 && (
                      <Badge className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 shadow-sm">
                        Nổi bật
                      </Badge>
                    )}

                    {/* Category Pill Tag */}
                    {categoryMap.get(product.categoryId) && (
                      <Badge
                        variant="outline"
                        className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm border-orange-200 text-orange-800 text-[10px] font-bold px-2 py-0.5 shadow-sm"
                      >
                        {categoryMap.get(product.categoryId)}
                      </Badge>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-1 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
                      {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                    </p>
                  </div>
                </div>

                {/* Footer: Price & Action */}
                <div className="p-5 pt-0 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wider">
                      {t('PRODUCT.PRICE_FROM', 'Giá từ')}
                    </span>
                    <span className="text-lg font-black text-gray-900">{formatVND(product.basePrice || 0)}</span>
                  </div>

                  <Button
                    onClick={() => handleOpenDetail(product)}
                    disabled={detailLoading}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-md shadow-red-600/20 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>{t('PRODUCT.ORDER_NOW', 'Chọn món')}</span>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-6 flex-wrap gap-4">
              <span className="text-sm text-gray-500 font-medium">
                Hiển thị trang <strong className="text-gray-900">{pagination.currentPage}</strong> /{' '}
                <strong className="text-gray-900">{pagination.totalPages}</strong> (Tổng {pagination.totalItems} sản
                phẩm)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trang trước</span>
                </Button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        pageNum === page
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold gap-1"
                >
                  <span>Trang sau</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Floating Cart Pill Button */}
      {cartTotalCount > 0 && (
        <Link
          href="/checkout"
          className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl shadow-red-600/40 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-900 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-600">
              {cartTotalCount}
            </span>
          </div>
          <span className="text-sm">{t('NAV.CART', 'Xem giỏ hàng')}</span>
          <span className="bg-red-700/80 text-white text-xs font-black px-2.5 py-1 rounded-full">
            {formatVND(cartTotalPrice)}
          </span>
        </Link>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        onAddToCart={handleAddToCartFromModal}
      />
    </div>
  );
};
