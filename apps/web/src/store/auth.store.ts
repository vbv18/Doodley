import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthStore = {
  user: User | null;
  accessToken: string | null;

  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,

  setUser: (user) => set({ user }),

  setAccessToken: (token) => set({ accessToken: token }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));
