import { SliceCreator } from '../type';
import {
  ProductDetailResponseDto,
  ProductIngredientResponseDto,
  ProductVariantResponseDto,
} from '@/services/apis/main/generated/data-contracts';
import { generateCartItemId } from '@/helpers/cart.helper';

export { generateCartItemId };

export type CartItem = {
  id: string;
  product: ProductDetailResponseDto;
  variant?: ProductVariantResponseDto | null;
  selectedIngredients: ProductIngredientResponseDto[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type CartSlice = {
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
};

export const createCartSlice: SliceCreator<CartSlice> = (set, get) => ({
  items: [],

  addItem: ({ product, variant = null, selectedIngredients = [], quantity = 1 }) => {
    const cartItemId = generateCartItemId(product.id, variant?.id, selectedIngredients);

    // Calculate single unit price (basePrice + variant offset + toppings)
    const variantPrice = variant?.modifiedPrice || 0;
    const ingredientsPrice = selectedIngredients.reduce((sum, ing) => sum + (ing.price || 0), 0);
    const unitPrice = (product.basePrice || 0) + variantPrice + ingredientsPrice;

    set((state) => {
      const existingItem = state.items.find((item) => item.id === cartItemId);

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = unitPrice * existingItem.quantity;
      } else {
        state.items.push({
          id: cartItemId,
          product,
          variant,
          selectedIngredients,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
        });
      }
    });
  },

  removeItem: (cartItemId) => {
    set((state) => {
      state.items = state.items.filter((item) => item.id !== cartItemId);
    });
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }

    set((state) => {
      const item = state.items.find((i) => i.id === cartItemId);
      if (item) {
        item.quantity = quantity;
        item.totalPrice = item.unitPrice * quantity;
      }
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.totalPrice, 0);
  },

  getTotalCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
});
