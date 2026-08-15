import { CartItem } from '@/stores/slices/cart.slice';

/**
 * Chuyển đổi danh sách CartItem sang Payload tạo Order cho Backend
 */
export const transformCartItemsToOrderPayload = (items: CartItem[]) => {
  return items.map((item) => ({
    productId: item.product.id,
    productVariantId: item.variant?.id,
    ingredients: item.selectedIngredients.map((ing) => ({
      ingredientId: ing.id,
      quantity: 1,
    })),
    quantity: item.quantity,
  }));
};
