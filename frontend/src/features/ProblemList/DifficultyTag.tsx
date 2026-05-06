// All colors here resolve to tokens in globals.css (--bb-easy, --bb-medium, etc.).
// Do not hardcode rose/cyan/etc — change the palette in globals.css instead.

const STYLES = {
  easy:   "border-bb-easy/60   bg-bb-easy/10   text-bb-easy",
  medium: "border-bb-medium/60 bg-bb-medium/10 text-bb-medium",
  hard:   "border-bb-hard/60   bg-bb-hard/10   text-bb-hard",
  expert: "border-bb-expert/60 bg-bb-expert/10 text-bb-expert",
} as const;

const DOT = {
  easy:   "bg-bb-easy",
  medium: "bg-bb-medium",
  hard:   "bg-bb-hard",
  expert: "bg-bb-expert",
} as const;

type Difficulty = keyof typeof STYLES;

export function DifficultyTag({ difficulty }: { difficulty: string }) {
  const key = difficulty.toLowerCase() as Difficulty;
  if (!(key in STYLES)) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${STYLES[key]}`}
    >
      <span className={`h-1.5 w-1.5 ${DOT[key]}`} />
      {difficulty}
    </span>
  );
}
