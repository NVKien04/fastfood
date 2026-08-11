import { create } from 'zustand';

type User = {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  roles: string[];
};

type AuthState = {
  accessToken: string | null;
  user: User | null;

  isInitializing: boolean;

  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setInitializing: (value: boolean) => void;

  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
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
}));
