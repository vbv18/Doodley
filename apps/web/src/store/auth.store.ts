import { create } from "zustand";
import type { GlobalRole } from "@repo/types";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  globalRole?: GlobalRole;
  avatar_url?: string | null;
};

type AuthStore = {
  user: AuthUser | null;
  accessToken: string | null;
  isInitialized: boolean;

  setUser: (user: AuthUser) => void;
  setAccessToken: (token: string) => void;
  setInitialized: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isInitialized: false,

  setUser: (user) => set({ user }),

  setAccessToken: (token) => set({ accessToken: token }),

  setInitialized: () => set({ isInitialized: true }),

  logout: () => set({ user: null, accessToken: null }),
}));
