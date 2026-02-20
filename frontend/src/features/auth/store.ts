import { create } from 'zustand';
import { persist } from "zustand/middleware";
import type { User } from "@/types/User";

type AuthStore = {
  user: User | null;
  accessToken: string | null;

  setUser: (user: User | null) => void;
  login: (user: User | null, access: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setUser: (user) => set({ user }),

      login: (user, access) => {
        set({ user, accessToken: access });
      },

      logout: () => {
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: "auth-store",
    }
  )
);
