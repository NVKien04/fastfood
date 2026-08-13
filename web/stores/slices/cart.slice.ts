import { StateCreator } from 'zustand';
import {
  ProductDetailResponseDto,
  ProductIngredientResponseDto,
  ProductVariantResponseDto,
} from '@/services/apis/main/generated/data-contracts';

export interface CartItem {
  id: string;
  product: ProductDetailResponseDto;
  variant?: ProductVariantResponseDto | null;
  selectedIngredients: ProductIngredientResponseDto[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartSlice {
  items: CartItem[];
  addItem: (payload: {
    product: ProductDetailResponseDto;
    variant?: ProductVariantResponseDto | null;
    selectedIngredients?: ProductIngredientResponseDto[];
    quantity?: number;
  }) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalCount: () => number;
}

// Generate unique ID based on product ID, variant ID, and sorted ingredient IDs
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

export const createCartSlice: StateCreator<CartSlice, [], [], CartSlice> = (set, get) => ({
  items: [],

  addItem: ({ product, variant = null, selectedIngredients = [], quantity = 1 }) => {
    const cartItemId = generateCartItemId(product.id, variant?.id, selectedIngredients);

    // Calculate single unit price (basePrice + variant offset + toppings)
    const variantPrice = variant?.modifiedPrice || 0;
    const ingredientsPrice = selectedIngredients.reduce((sum, ing) => sum + (ing.price || 0), 0);
    const unitPrice = (product.basePrice || 0) + variantPrice + ingredientsPrice;

    const currentItems = get().items;
    const existingIndex = currentItems.findIndex((item) => item.id === cartItemId);

    if (existingIndex > -1) {
      const updatedItems = [...currentItems];
      const newQty = updatedItems[existingIndex].quantity + quantity;
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: newQty,
        totalPrice: unitPrice * newQty,
      };
      set({ items: updatedItems });
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        product,
        variant,
        selectedIngredients,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      };
      set({ items: [...currentItems, newItem] });
    }
  },

  removeItem: (cartItemId) => {
    set({ items: get().items.filter((item) => item.id !== cartItemId) });
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }

    set({
      items: get().items.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity,
          };
        }
        return item;
      }),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.totalPrice, 0);
  },

  getTotalCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
});
