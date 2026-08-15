import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { RootStore } from './type';
import { createAuthSlice } from './slices/auth.slice';
import { createCartSlice } from './slices/cart.slice';
import { createAppSlice } from './slices/app.slice';

export const useStore = create<RootStore>()(
  immer(
    persist(
      (...args) => ({
        ...createAuthSlice(...args),
        ...createCartSlice(...args),
        ...createAppSlice(...args),
      }),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
          locale: state.locale,
          theme: state.theme,
        }),
      },
    ),
  ),
);

export * from './type';
export * from './slices/auth.slice';
export * from './slices/cart.slice';
export * from './slices/app.slice';
