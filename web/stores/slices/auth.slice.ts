import { SliceCreator } from '../type';

export type User = {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  roles: string[];
};

export type AuthSlice = {
  accessToken: string | null;
  user: User | null;
  isInitializing: boolean;

  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setInitializing: (value: boolean) => void;
  clearAuth: () => void;
};

export const createAuthSlice: SliceCreator<AuthSlice> = (set) => ({
  accessToken: null,
  user: null,
  isInitializing: true,

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  setUser: (user) => {
    set({ user });
  },

  setInitializing: (value) => {
    set({ isInitializing: value });
  },

  clearAuth: () => {
    set({ accessToken: null, user: null });
  },
});
