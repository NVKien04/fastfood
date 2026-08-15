import { StateCreator } from 'zustand';
import { AuthSlice } from './slices/auth.slice';
import { CartSlice } from './slices/cart.slice';
import { AppSlice } from './slices/app.slice';

/**
 * RootStore: Gộp tất cả các Slice theo cấu trúc phẳng (Flat Store)
 */
export type RootStore = AuthSlice & CartSlice & AppSlice;

/**
 * Helper type cho StateCreator của từng slice khi kết hợp immer và persist
 */
export type SliceCreator<T> = StateCreator<
  RootStore,
  [['zustand/immer', never], ['zustand/persist', unknown]],
  [],
  T
>;
