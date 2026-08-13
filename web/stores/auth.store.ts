import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './slices/auth.slice';

export const useAuthStore = create<AuthSlice>()((...a) => createAuthSlice(...a));

export * from './slices/auth.slice';
