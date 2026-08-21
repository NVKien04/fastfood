'use client';

import { useState, useEffect, useMemo, useRef, MouseEvent } from 'react';
import { useCategoryList } from '@/services/react-query/queries/category';
import { useProductList, useProductDetail } from '@/services/react-query/queries/product';
import { useStore } from '@/stores';
import { categoryToSlug, isCustomizableProduct } from '@/helpers/product.helper';
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
  const products = useMemo(() => (productsData?.kind === 'OK' ? (productsData.data ?? []) : []), [productsData]);

  const activeModalProduct = useMemo(
    () => productDetail || selectedProductFallback,
    [productDetail, selectedProductFallback],
  );

  // Group products by category
  const categoryGroups = useMemo<CategoryGroup[]>(() => {
    if (!products.length) return [];

    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? products.filter((p) => p.name?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query))
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

  // Set default active category and scroll to hash on load
  useEffect(() => {
    if (categoryGroups.length > 0 && !hasInitializedHashRef.current) {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hashSlug = window.location.hash.replace('#', '');
        if (categoryGroups.some((g) => g.category.slug === hashSlug)) {
          setActiveCategorySlug(hashSlug);
          hasInitializedHashRef.current = true;

          // Scroll to matching section
          setTimeout(() => {
            const el = document.getElementById(hashSlug);
            if (el) {
              const headerOffset = 180;
              const elementPosition = el.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth',
              });
            }
          }, 150);
          return;
        }
      }
      setActiveCategorySlug(categoryGroups[0].category.slug);
      hasInitializedHashRef.current = true;
    }
  }, [categoryGroups]);

  // Scroll spy for active category and sync with URL hash
  useEffect(() => {
    const handleScroll = () => {
      if (isUserScrollingRef.current) return;

      const headerOffset = 180;
      const scrollPosition = window.scrollY + headerOffset;

      for (let i = categoryGroups.length - 1; i >= 0; i--) {
        const group = categoryGroups[i];
        const el = document.getElementById(group.category.slug);
        if (el && scrollPosition >= el.offsetTop) {
          if (activeCategorySlug !== group.category.slug) {
            setActiveCategorySlug(group.category.slug);
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', `#${group.category.slug}`);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categoryGroups, activeCategorySlug]);

  const handleCategoryClick = (slug: string) => {
    setActiveCategorySlug(slug);
    isUserScrollingRef.current = true;

    // Update URL hash immediately
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${slug}`);
    }

    const el = document.getElementById(slug);
    if (el) {
      const headerOffset = 180;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });

      setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 800);
    } else {
      isUserScrollingRef.current = false;
    }
  };

  const handleOpenDetailModal = (product: ProductDetailResponseDto) => {
    const hasOptions = isCustomizableProduct(product);

    if (hasOptions) {
      setSelectedProductId(product.id);
      setSelectedProductFallback(product);
      setIsModalOpen(true);
    } else {
      addItem({
        product,
        variant: product.variants?.[0] || null,
        selectedIngredients: [],
        quantity: 1,
      });
    }
  };

  const handleCloseDetailModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
    setSelectedProductFallback(null);
  };

  const handleQuickAdd = (product: ProductDetailResponseDto, e: MouseEvent) => {
    e.stopPropagation();
    const hasOptions = isCustomizableProduct(product);

    if (hasOptions) {
      handleOpenDetailModal(product);
    } else {
      addItem({
        product,
        variant: product.variants?.[0] || null,
        selectedIngredients: [],
        quantity: 1,
      });
    }
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
