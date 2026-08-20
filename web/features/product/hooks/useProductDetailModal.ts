'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductDetailResponseDto } from '@/services/apis/main/generated/data-contracts';
import { useStore } from '@/stores';
import {
  sortProductVariants,
  sortProductIngredients,
  calculateProductUnitPrice,
  calculateProductTotalPrice,
} from '@/helpers';

export const useProductDetailModal = (
  product: ProductDetailResponseDto | null,
  onClose: () => void,
) => {
  const addItem = useStore((s) => s.addItem);

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  const sortedVariants = useMemo(() => {
    return sortProductVariants(product?.variants);
  }, [product]);

  const sortedIngredients = useMemo(() => {
    return sortProductIngredients(product?.ingredients);
  }, [product]);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      if (sortedVariants.length > 0) {
        setSelectedVariantId(sortedVariants[0].id);
      } else {
        setSelectedVariantId(null);
      }
      setSelectedIngredientIds([]);
    }
  }, [product, sortedVariants]);

  const activeVariant = useMemo(() => {
    return sortedVariants.find((v) => v.id === selectedVariantId) || sortedVariants[0] || null;
  }, [sortedVariants, selectedVariantId]);

  const selectedIngredientsList = useMemo(() => {
    return sortedIngredients.filter((ing) => selectedIngredientIds.includes(ing.id));
  }, [sortedIngredients, selectedIngredientIds]);

  const unitPrice = useMemo(() => {
    return calculateProductUnitPrice(product, activeVariant, selectedIngredientsList);
  }, [product, activeVariant, selectedIngredientsList]);

  const totalPrice = useMemo(() => {
    return calculateProductTotalPrice(unitPrice, quantity);
  }, [unitPrice, quantity]);

  const handleToggleIngredient = useCallback((id: number) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    addItem({
      product,
      variant: activeVariant || undefined,
      selectedIngredients: selectedIngredientsList,
      quantity,
    });

    onClose();
  }, [product, activeVariant, selectedIngredientsList, quantity, addItem, onClose]);

  return {
    sortedVariants,
    sortedIngredients,
    selectedVariantId,
    setSelectedVariantId,
    selectedIngredientIds,
    handleToggleIngredient,
    quantity,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    unitPrice,
    totalPrice,
    handleAddToCart,
  };
};
