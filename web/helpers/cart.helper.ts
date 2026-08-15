import { ProductIngredientResponseDto } from '@/services/apis/main/generated/data-contracts';

/**
 * Tạo unique ID cho CartItem dựa trên Product ID, Variant ID và danh sách Topping
 */
export const generateCartItemId = (
  productId: string,
  variantId?: number | null,
  ingredients: ProductIngredientResponseDto[] = [],
): string => {
  const sortedIngIds = ingredients
    .map((i) => i.id)
    .sort((a, b) => a - b)
    .join('-');
  return `${productId}_${variantId || 'base'}_${sortedIngIds}`;
};
