import { create } from "zustand";

/**
 * Theme system. Each theme name corresponds to a `[data-theme="..."]`
 * block in frontend/src/styles/globals.css that overrides the palette
 * tokens. Switching is instant — Tailwind utilities and Monaco both read
 * from the same custom properties.
 *
 * To add a new theme:
 *   1. Add a `.dark[data-theme="<name>"]` block in globals.css
 *   2. Add an entry to THEMES below (label + bg/accent for the swatch preview)
 */

export type ThemeName = "matrix" | "crimson" | "amber" | "cyan" | "mono";

export const THEMES: ReadonlyArray<{
  name: ThemeName;
  label: string;
  bg: string;
  accent: string;
}> = [
  { name: "matrix",  label: "Matrix",  bg: "#06120a", accent: "#15803d" },
  { name: "crimson", label: "Crimson", bg: "#14080a", accent: "#ff4d3d" },
  { name: "amber",   label: "Amber",   bg: "#1a0e02", accent: "#f59e0b" },
  { name: "cyan",    label: "Cyan",    bg: "#04101a", accent: "#06b6d4" },
  { name: "mono",    label: "Mono",    bg: "#0a0a0a", accent: "#d4d4d4" },
];

const STORAGE_KEY = "elitecode-theme";
const DEFAULT_THEME: ThemeName = "matrix";

function isThemeName(v: string | null): v is ThemeName {
  return !!v && THEMES.some((t) => t.name === v);
}

export function readStoredTheme(): ThemeName {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return isThemeName(v) ? v : DEFAULT_THEME;
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute("data-theme", theme);
}

interface ThemeState {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: readStoredTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    set({ theme });
  },
}));
