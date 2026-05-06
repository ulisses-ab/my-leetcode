import { Palette, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEMES, useThemeStore, type ThemeName } from "@/stores/useThemeStore";
import { playClick } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

export function ThemeSwitcher() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Change theme"
          onClick={() => { if (useSoundStore.getState().enabled) playClick(); }}
          className="inline-flex h-9 w-9 items-center justify-center border-2 border-bb-border/55 bg-bb-surface/72 text-bb-muted-strong hover:text-bb-accent hover:border-bb-accent transition-colors"
        >
          <Palette className="size-[18px]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 p-1">
        <p className="px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bb-muted-strong">
          Theme
        </p>
        {THEMES.map((t) => (
          <ThemeRow
            key={t.name}
            name={t.name}
            label={t.label}
            bg={t.bg}
            accent={t.accent}
            active={theme === t.name}
            onSelect={() => setTheme(t.name)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeRow({
  label,
  bg,
  accent,
  active,
  onSelect,
}: {
  name: ThemeName;
  label: string;
  bg: string;
  accent: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => { if (useSoundStore.getState().enabled) playClick(); onSelect(); }}
      className={`group flex w-full items-center gap-2.5 px-2.5 py-2 font-sans text-xs uppercase tracking-wide outline-none transition-colors border-2 ${
        active
          ? "border-bb-accent bg-bb-accent/15 text-bb-accent"
          : "border-transparent text-bb-ink hover:bg-bb-accent/10 hover:text-bb-accent"
      }`}
    >
      <Swatch bg={bg} accent={accent} />
      <span className="flex-1 text-left">{label}</span>
      {active && <Check size={12} className="shrink-0" />}
    </button>
  );
}

function Swatch({ bg, accent }: { bg: string; accent: string }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-5 w-5 shrink-0 border-2 border-bb-border/40 overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      <span
        className="absolute right-0 bottom-0 h-2.5 w-2.5"
        style={{ backgroundColor: accent }}
      />
    </span>
  );
}
