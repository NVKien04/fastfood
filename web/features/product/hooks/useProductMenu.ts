'use client';

import { useState, useEffect, useMemo, useRef, MouseEvent } from 'react';
import { useCategoryList } from '@/services/react-query/queries/category';
import { useProductList, useProductDetail } from '@/services/react-query/queries/product';
import { useStore } from '@/stores';
import { categoryToSlug } from '@/helpers/product.helper';
import { CategoryGroup, ProductDetailResponseDto } from '../types';

export const useProductMenu = () => {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProductFallback, setSelectedProductFallback] = useState<ProductDetailResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const isUserScrollingRef = useRef<boolean>(false);
  const hasInitializedHashRef = useRef<boolean>(false);

  // Store state
  const cartTotalCount = useStore((s) => s.getTotalCount());
  const cartTotalPrice = useStore((s) => s.getTotalPrice());
  const addItem = useStore((s) => s.addItem);

  // React Query queries
  const { data: categoriesData, isLoading: categoryLoading } = useCategoryList({ page: 1, limit: 100 });
  const {
    data: productsData,
    isLoading: productLoading,
    error: productError,
    refetch: refetchProducts,
  } = useProductList({ page: 1, limit: 200 });

  const { data: productDetail, isFetching: detailLoading } = useProductDetail(
    isModalOpen ? (selectedProductId ?? undefined) : undefined,
  );

  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);
  const products = useMemo(
    () => (productsData?.kind === 'OK' ? (productsData.data ?? []) : []),
    [productsData],
  );

  const activeModalProduct = useMemo(
    () => productDetail || selectedProductFallback,
    [productDetail, selectedProductFallback],
  );

  // Group products by category
  const categoryGroups = useMemo<CategoryGroup[]>(() => {
    if (!products.length) return [];

    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? products.filter(
          (p) =>
            p.name?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query),
        )
      : products;

    if (categories.length > 0) {
      return categories
        .map((cat) => {
          const groupProducts = filtered.filter((p) => p.categoryId === cat.id);
          return {
            category: {
              id: cat.id,
              name: cat.name,
              slug: categoryToSlug(cat.name),
            },
            products: groupProducts,
          };
        })
        .filter((g) => g.products.length > 0);
    }

    // Fallback if categories are not available
    const groups: { [key: string]: CategoryGroup } = {};
    filtered.forEach((p) => {
      const catId = p.categoryId || 'uncategorized';
      const catName = 'Danh mục';
      const slug = categoryToSlug(catName);

      if (!groups[catId]) {
        groups[catId] = {
          category: { id: catId, name: catName, slug },
          products: [],
        };
      }
      groups[catId].products.push(p);
    });

    return Object.values(groups);
  }, [products, categories, searchQuery]);

  // Set default active category
  useEffect(() => {
    if (!activeCategorySlug && categoryGroups.length > 0 && !hasInitializedHashRef.current) {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hashSlug = window.location.hash.replace('#', '');
        if (categoryGroups.some((g) => g.category.slug === hashSlug)) {
          setActiveCategorySlug(hashSlug);
          hasInitializedHashRef.current = true;
          return;
        }
      }
      setActiveCategorySlug(categoryGroups[0].category.slug);
      hasInitializedHashRef.current = true;
    }
  }, [categoryGroups, activeCategorySlug]);

  // Scroll spy for active category
  useEffect(() => {
    const handleScroll = () => {
      if (isUserScrollingRef.current) return;

      const headerOffset = 180;
      const scrollPosition = window.scrollY + headerOffset;

      for (const group of categoryGroups) {
        const el = document.getElementById(group.category.slug);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategorySlug(group.category.slug);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categoryGroups]);

  const handleCategoryClick = (slug: string) => {
    setActiveCategorySlug(slug);
    isUserScrollingRef.current = true;

    const el = document.getElementById(slug);
    if (el) {
      const headerOffset = 140;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      if (window.history.pushState) {
        window.history.pushState(null, '', `#${slug}`);
      }

      setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 800);
    } else {
      isUserScrollingRef.current = false;
    }
  };

  const handleOpenDetailModal = (product: ProductDetailResponseDto) => {
    setSelectedProductId(product.id);
    setSelectedProductFallback(product);
    setIsModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
    setSelectedProductFallback(null);
  };

  const handleQuickAdd = (product: ProductDetailResponseDto, e: MouseEvent) => {
    e.stopPropagation();

    // If product has variants or ingredients, open customization modal
    const hasVariants = product.variants && product.variants.length > 0;
    const hasIngredients = product.ingredients && product.ingredients.length > 0;

    if (hasVariants || hasIngredients) {
      handleOpenDetailModal(product);
      return;
    }

    // Direct add
    addItem({
      product,
      quantity: 1,
      selectedIngredients: [],
    });
  };

  return {
    categories,
    categoryGroups,
    activeCategorySlug,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    activeModalProduct,
    detailLoading,
    isLoading: categoryLoading || productLoading,
    productError,
    refetchProducts,
    cartTotalCount,
    cartTotalPrice,
    handleCategoryClick,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleQuickAdd,
  };
};
