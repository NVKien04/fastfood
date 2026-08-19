'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ProductDetailResponseDto,
  ProductIngredientResponseDto,
  ProductVariantResponseDto,
} from '@/services/apis/main/generated/data-contracts';
import { useCategoryList } from '@/services/react-query/queries/category';
import { useProductList, useProductDetail } from '@/services/react-query/queries/product';
import { ProductDetailModal } from './ProductDetailModal';
import { CategoryBar, CategoryItem, getCategoryIcon } from '@/components/layout/CategoryBar';
import { formatVND } from '@/utils';
import { categoryToSlug } from '@/helpers/product.helper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Search, Loader2, Plus, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useStore } from '@/stores';
import { useTranslation } from 'react-i18next';

type CategoryGroup = {
  category: {
    id: number | string;
    name: string;
    slug: string;
  };
  products: ProductDetailResponseDto[];
};

export const ProductList: React.FC = () => {
  // 1. Next.js Router & navigation hooks (none needed)

  // 2. Translation hook
  const { t } = useTranslation();

  // 3. Local state & refs
  const [activeCategorySlug, setActiveCategorySlug] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);
  const [selectedProductFallback, setSelectedProductFallback] = React.useState<ProductDetailResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const isUserScrollingRef = React.useRef<boolean>(false);
  const hasInitializedHashRef = React.useRef<boolean>(false);

  // 4. Zustand global state
  const cartTotalCount = useStore((s) => s.getTotalCount());
  const cartTotalPrice = useStore((s) => s.getTotalPrice());
  const addItem = useStore((s) => s.addItem);

  // 5. React Query hooks (queries & mutations)
  const { data: categoriesData, isLoading: categoryLoading } = useCategoryList({ page: 1, limit: 100 });

  const {
    data: productsData,
    isLoading: loading,
    error: productError,
    refetch: refetchProducts,
  } = useProductList({ page: 1, limit: 200 });

  const { data: productDetail, isFetching: detailLoading } = useProductDetail(
    isModalOpen ? (selectedProductId ?? undefined) : undefined,
  );

  // 6. Memoized values (useMemo)
  const categories = React.useMemo(() => categoriesData ?? [], [categoriesData]);
  const products = React.useMemo(() => (productsData?.kind === 'OK' ? (productsData.data ?? []) : []), [productsData]);
  const activeModalProduct = React.useMemo(() => productDetail || selectedProductFallback, [productDetail, selectedProductFallback]);

  // Group products by category with URL slugs
  const categoryGroups = React.useMemo<CategoryGroup[]>(() => {
    if (!products.length) return [];

    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? products.filter((p) => p.name?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query))
      : products;

    if (categories.length > 0) {
      const groups: CategoryGroup[] = [];

      categories.forEach((cat) => {
        const catProducts = filtered.filter((p) => p.categoryId === cat.id);
        if (catProducts.length > 0) {
          groups.push({
            category: {
              id: cat.id,
              name: cat.name,
              slug: categoryToSlug(cat.name) || String(cat.id),
            },
            products: catProducts,
          });
        }
      });

      // Catch products without category or not matched
      const unmatched = filtered.filter((p) => !categories.some((c) => c.id === p.categoryId));
      if (unmatched.length > 0) {
        groups.push({
          category: {
            id: 'other',
            name: 'MÓN KHÁC',
            slug: 'mon-khac',
          },
          products: unmatched,
        });
      }

      return groups;
    }

    // Fallback if no categories from API: group all into one
    return [
      {
        category: {
          id: 'all',
          name: 'THỰC ĐƠN MÓN ĂN',
          slug: 'thuc-don',
        },
        products: filtered,
      },
    ];
  }, [categories, products, searchQuery]);

  // CategoryBar items mapping
  const categoryBarItems = React.useMemo<CategoryItem[]>(() => {
    if (categoryGroups.length > 0) {
      return categoryGroups.map((g) => ({
        id: g.category.slug,
        name: g.category.name.toUpperCase(),
        icon: getCategoryIcon(g.category.name),
        slug: g.category.slug,
      }));
    }
    if (categories.length > 0) {
      return categories.map((c) => ({
        id: categoryToSlug(c.name) || String(c.id),
        name: c.name.toUpperCase(),
        icon: getCategoryIcon(c.name),
        slug: categoryToSlug(c.name) || String(c.id),
      }));
    }
    return [];
  }, [categoryGroups, categories]);

  // 7. Effects (useEffect)
  // Check initial URL hash on mount and scroll to it
  React.useEffect(() => {
    if (hasInitializedHashRef.current || categoryGroups.length === 0) return;

    const hash = window.location.hash.replace('#', '').trim();
    if (hash) {
      const targetGroup = categoryGroups.find(
        (g) => g.category.slug === hash || String(g.category.id) === hash,
      );

      if (targetGroup) {
        setActiveCategorySlug(targetGroup.category.slug);
        hasInitializedHashRef.current = true;
        setTimeout(() => {
          const el = document.getElementById(targetGroup.category.slug);
          if (el) {
            const headerOffset = 140;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        }, 150);
        return;
      }
    }

    if (categoryGroups.length > 0 && !activeCategorySlug) {
      setActiveCategorySlug(categoryGroups[0].category.slug);
    }
    hasInitializedHashRef.current = true;
  }, [categoryGroups, activeCategorySlug]);

  // ScrollSpy to update active category tab & URL hash as user scrolls down the page
  React.useEffect(() => {
    const _handleWindowScroll = () => {
      if (isUserScrollingRef.current) return;
      const headerOffset = 160;
      const scrollPosition = window.scrollY + headerOffset;

      for (let i = categoryGroups.length - 1; i >= 0; i--) {
        const group = categoryGroups[i];
        const el = document.getElementById(group.category.slug);
        if (el && el.offsetTop <= scrollPosition) {
          if (activeCategorySlug !== group.category.slug) {
            setActiveCategorySlug(group.category.slug);
            // Update URL hash smoothly without polluting browser navigation stack
            window.history.replaceState(null, '', `#${group.category.slug}`);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', _handleWindowScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', _handleWindowScroll);
    };
  }, [categoryGroups, activeCategorySlug]);

  // 8. Event handlers & internal functions (useCallback)
  const _handleScrollToCategory = React.useCallback((slugOrId: number | string | null) => {
    if (!slugOrId) return;
    const slug = String(slugOrId);
    setActiveCategorySlug(slug);
    isUserScrollingRef.current = true;

    // Update URL hash immediately
    window.history.replaceState(null, '', `#${slug}`);

    const element = document.getElementById(slug);
    if (element) {
      const headerOffset = 140; // 72px header + 56px category bar + 12px margin
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 600);
  }, []);

  const _handleOpenDetail = React.useCallback((product: ProductDetailResponseDto) => {
    setSelectedProductId(product.id);
    setSelectedProductFallback(product);
    setIsModalOpen(true);
  }, []);

  const _handleCloseDetail = React.useCallback(() => {
    setIsModalOpen(false);
    setSelectedProductId(null);
    setSelectedProductFallback(null);
  }, []);

  const _handleQuickAddToCart = React.useCallback(
    (product: ProductDetailResponseDto, e: React.MouseEvent) => {
      e.stopPropagation();
      if (product.variants && product.variants.length > 0) {
        _handleOpenDetail(product);
        return;
      }
      addItem({
        product,
        variant: null,
        selectedIngredients: [],
        quantity: 1,
      });
    },
    [addItem, _handleOpenDetail],
  );

  const _handleAddToCartFromModal = React.useCallback(
    (item: {
      product: ProductDetailResponseDto;
      variant?: ProductVariantResponseDto | null;
      selectedIngredients?: ProductIngredientResponseDto[];
      quantity: number;
      totalPrice: number;
    }) => {
      addItem({
        product: item.product,
        variant: item.variant,
        selectedIngredients: item.selectedIngredients,
        quantity: item.quantity,
      });
    },
    [addItem],
  );

  // 9. Return JSX
  return (
    <div className="w-full">
      {/* 1. Category Bar (Sub-header) */}
      <CategoryBar
        categories={categoryBarItems}
        selectedCategoryId={activeCategorySlug}
        onSelectCategory={_handleScrollToCategory}
      />

      {/* 2. Main Menu Container */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 relative">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>{t('PRODUCT.MENU_TITLE', 'Thực Đơn Món Ăn')}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {t('PRODUCT.MENU_SUBTITLE', 'Khám phá các món ăn nhanh thơm ngon, đậm đà hương vị')}
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={t('PRODUCT.SEARCH_PLACEHOLDER', 'Tìm kiếm món ăn theo tên...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-full border-gray-200 focus:border-red-500 focus:ring-red-500/20 bg-white"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading || categoryLoading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <p className="text-sm font-medium">{t('COMMON.LOADING', 'Đang tải thực đơn...')}</p>
          </div>
        ) : productError ? (
          <div className="min-h-[250px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
            <p className="text-red-600 font-semibold mb-3">
              {productError.message || t('COMMON.ERROR', 'Khởi tạo danh sách sản phẩm thất bại')}
            </p>
            <Button
              onClick={() => refetchProducts()}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-100 rounded-xl"
            >
              {t('COMMON.RETRY', 'Thử lại')}
            </Button>
          </div>
        ) : categoryGroups.length === 0 ? (
          <div className="min-h-[250px] flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
            <Utensils className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-600 font-medium">
              {t('PRODUCT.EMPTY_PRODUCTS_DESC', 'Không tìm thấy món ăn nào phù hợp với tìm kiếm của bạn')}
            </p>
          </div>
        ) : (
          /* Grouped Product Sections */
          <div className="flex flex-col gap-12 sm:gap-16">
            {categoryGroups.map((group) => (
              <section
                key={group.category.slug}
                id={group.category.slug}
                className="scroll-mt-36"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                      {getCategoryIcon(group.category.name)}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      {group.category.name.toUpperCase()}
                    </h2>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1">
                    {group.products.length} món
                  </Badge>
                </div>

                {/* Section Product Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => _handleOpenDetail(product)}
                      className="group bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer hover:border-red-300"
                    >
                      {/* Left: Product Image */}
                      <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shrink-0 overflow-hidden relative border border-gray-100">
                        <Utensils className="w-8 h-8 text-gray-300 group-hover:scale-110 transition-transform" />

                        {product.isFeatured === 1 && (
                          <Badge className="absolute top-2 left-2 bg-red-600 text-white font-bold text-[9px] uppercase px-1.5 py-0.5">
                            HOT
                          </Badge>
                        )}
                      </div>

                      {/* Right: Info & Price & Plus Button */}
                      <div className="flex-1 flex flex-col justify-between h-full min-h-[110px]">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug line-clamp-1 group-hover:text-red-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {product.description || product.name}
                          </p>
                        </div>

                        <div className="flex items-end justify-between gap-2 mt-4">
                          <div>
                            <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                              {formatVND(product.basePrice || 0)}
                            </span>
                          </div>

                          {/* Red Circular Plus Button */}
                          <button
                            type="button"
                            onClick={(e) => _handleQuickAddToCart(product, e)}
                            aria-label="Thêm vào giỏ hàng"
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-600/30 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                          >
                            <Plus className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
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
          onClose={_handleCloseDetail}
          onAddToCart={_handleAddToCartFromModal}
        />
      </div>
    </div>
  );
};
