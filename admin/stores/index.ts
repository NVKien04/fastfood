import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { RootStore } from './type';
import { createAuthSlice } from './slices/auth.slice';
import { createAppSlice } from './slices/app.slice';

export const useStore = create<RootStore>()(
  immer(
    persist(
      (...args) => ({
        ...createAuthSlice(...args),
        ...createAppSlice(...args),
      }),
      {
        name: 'admin-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          locale: state.locale,
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      },
    ),
  ),
);

export * from './type';
export * from './slices/auth.slice';
export * from './slices/app.slice';
