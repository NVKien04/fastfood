'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ProductDetailResponseDto,
  ProductVariantResponseDto,
} from '@/services/apis/main/generated/data-contracts';
import { CartItem, useStore } from '@/stores';
import {
  sortProductVariants,
  sortProductIngredients,
  calculateProductUnitPrice,
  calculateProductTotalPrice,
} from '@/helpers';

export const useProductDetailModal = (
  product: ProductDetailResponseDto | null,
  onClose: () => void,
  cartItem?: CartItem | null,
) => {
  const addItem = useStore((s) => s.addItem);
  const updateCartItem = useStore((s) => s.updateCartItem);

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  // Track product ID and cartItem ID to avoid resetting state on re-renders
  const prevTrackingKeyRef = useRef<string | null>(null);

  const sortedVariants = useMemo(() => {
    return sortProductVariants(product?.variants);
  }, [product?.variants]);

  const sortedIngredients = useMemo(() => {
    return sortProductIngredients(product?.ingredients);
  }, [product?.ingredients]);

  // Reset/populate state when opening modal (either fresh product or editing cart item)
  useEffect(() => {
    if (product?.id) {
      const trackingKey = cartItem ? `edit-${cartItem.id}` : `new-${product.id}`;

      if (prevTrackingKeyRef.current !== trackingKey) {
        prevTrackingKeyRef.current = trackingKey;

        if (cartItem) {
          // Populate from existing cart item
          setQuantity(cartItem.quantity);
          setSelectedIngredientIds(cartItem.selectedIngredients.map((i) => Number(i.id)));
          setSelectedVariantId(cartItem.variant ? Number(cartItem.variant.id) : (sortedVariants[0]?.id ? Number(sortedVariants[0].id) : null));
        } else {
          // Default fresh product state
          setQuantity(1);
          setSelectedIngredientIds([]);
          if (sortedVariants.length > 0) {
            setSelectedVariantId(Number(sortedVariants[0].id));
          } else {
            setSelectedVariantId(null);
          }
        }
      }
    } else {
      prevTrackingKeyRef.current = null;
    }
  }, [product?.id, cartItem, sortedVariants]);

  // If variants arrived or changed and current variant is not valid
  useEffect(() => {
    if (sortedVariants.length > 0) {
      if (selectedVariantId === null || !sortedVariants.some((v) => Number(v.id) === Number(selectedVariantId))) {
        setSelectedVariantId(Number(sortedVariants[0].id));
      }
    }
  }, [sortedVariants, selectedVariantId]);

  const activeVariant = useMemo<ProductVariantResponseDto | null>(() => {
    if (selectedVariantId === null || selectedVariantId === undefined) {
      return sortedVariants[0] || null;
    }
    return (
      sortedVariants.find((v) => Number(v.id) === Number(selectedVariantId)) ||
      sortedVariants[0] ||
      null
    );
  }, [sortedVariants, selectedVariantId]);

  const selectedIngredientsList = useMemo(() => {
    return sortedIngredients.filter((ing) =>
      selectedIngredientIds.some((id) => Number(id) === Number(ing.id)),
    );
  }, [sortedIngredients, selectedIngredientIds]);

  const unitPrice = useMemo(() => {
    return calculateProductUnitPrice(product, activeVariant, selectedIngredientsList);
  }, [product, activeVariant, selectedIngredientsList]);

  const totalPrice = useMemo(() => {
    return calculateProductTotalPrice(unitPrice, quantity);
  }, [unitPrice, quantity]);

  // Calculate dynamic scale for the pizza image showcase (Dodo Pizza animation effect)
  const imageScale = useMemo(() => {
    if (!activeVariant) return 1;
    const size = (activeVariant.size || '').toLowerCase();
    const name = (activeVariant.name || '').toLowerCase();

    if (size.includes('20') || name.includes('nhỏ') || name.includes('small') || name.includes('20cm')) {
      return 0.85;
    }
    if (size.includes('25') || name.includes('vừa') || name.includes('medium') || name.includes('25cm')) {
      return 0.95;
    }
    if (size.includes('30') || name.includes('lớn') || name.includes('large') || name.includes('30cm')) {
      return 1.05;
    }
    if (size.includes('35') || name.includes('35cm')) {
      return 1.15;
    }
    return 1;
  }, [activeVariant]);

  // Generate subtitle specs like "30 cm, đế truyền thống"
  const productSpecsText = useMemo(() => {
    const parts: string[] = [];
    if (activeVariant?.size) parts.push(activeVariant.size);
    if (activeVariant?.type) parts.push(`Đế ${activeVariant.type}`);
    if (!parts.length && activeVariant?.name) parts.push(activeVariant.name);
    return parts.join(', ');
  }, [activeVariant]);

  const handleToggleIngredient = useCallback((id: number | string) => {
    const numId = Number(id);
    setSelectedIngredientIds((prev) =>
      prev.includes(numId) ? prev.filter((item) => item !== numId) : [...prev, numId],
    );
  }, []);

  const handleSelectVariant = useCallback((id: number | string) => {
    setSelectedVariantId(Number(id));
  }, []);

  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    if (cartItem) {
      // Update existing cart item
      updateCartItem(cartItem.id, {
        product,
        variant: activeVariant || undefined,
        selectedIngredients: selectedIngredientsList,
        quantity,
      });
    } else {
      // Add new item to cart
      addItem({
        product,
        variant: activeVariant || undefined,
        selectedIngredients: selectedIngredientsList,
        quantity,
      });
    }

    onClose();
  }, [product, cartItem, activeVariant, selectedIngredientsList, quantity, addItem, updateCartItem, onClose]);

  return {
    isEditMode: !!cartItem,
    sortedVariants,
    sortedIngredients,
    selectedVariantId,
    activeVariant,
    imageScale,
    productSpecsText,
    setSelectedVariantId: handleSelectVariant,
    selectedIngredientIds,
    selectedIngredientsList,
    handleToggleIngredient,
    quantity,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    unitPrice,
    totalPrice,
    handleAddToCart,
  };
};
