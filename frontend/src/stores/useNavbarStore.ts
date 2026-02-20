import { create } from "zustand";

type NavbarState = {
  navbarCenter: React.ReactNode | null;
  setNavbarCenter: (node: React.ReactNode | null) => void;
};

export const useNavbarStore = create<NavbarState>((set) => ({
  navbarCenter: null,
  setNavbarCenter: (node) => set({ navbarCenter: node }),
}));