import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartSlice, createCartSlice } from './slices/cart.slice';

export const useCartStore = create<CartSlice>()(
  persist(
    (...a) => createCartSlice(...a),
    {
      name: 'fastfood-cart-storage',
    },
  ),
);

export * from './slices/cart.slice';
