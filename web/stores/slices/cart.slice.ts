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
  updateCartItem: (
    oldCartItemId: string,
    payload: {
      product: ProductDetailResponseDto;
      variant?: ProductVariantResponseDto | null;
      selectedIngredients?: ProductIngredientResponseDto[];
      quantity?: number;
    },
  ) => void;
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

  updateCartItem: (oldCartItemId, { product, variant = null, selectedIngredients = [], quantity = 1 }) => {
    const newCartItemId = generateCartItemId(product.id, variant?.id, selectedIngredients);
    const variantPrice = variant?.modifiedPrice || 0;
    const ingredientsPrice = selectedIngredients.reduce((sum, ing) => sum + (ing.price || 0), 0);
    const unitPrice = (product.basePrice || 0) + variantPrice + ingredientsPrice;

    set((state) => {
      const oldIndex = state.items.findIndex((item) => item.id === oldCartItemId);
      if (oldIndex !== -1) {
        state.items.splice(oldIndex, 1);
      }

      const existingItem = state.items.find((item) => item.id === newCartItemId);
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = unitPrice * existingItem.quantity;
      } else {
        state.items.splice(oldIndex !== -1 ? oldIndex : state.items.length, 0, {
          id: newCartItemId,
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
