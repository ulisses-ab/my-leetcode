import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SoundStore {
  enabled: boolean;
  toggle: () => void;
}

export const useSoundStore = create<SoundStore>()(
  persist(
    (set) => ({
      enabled: true,
      toggle: () => set((s) => ({ enabled: !s.enabled })),
    }),
    { name: "elitecode-sound" }
  )
);
