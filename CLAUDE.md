# EliteCode — Project Guide

## Frontend UI Style

### Design Philosophy
Retro-brutalist Matrix terminal. Hard-edged rectangles, thick 2px borders, hard offset shadows (`Nx Nx 0`), CRT scanlines, near-black green-tinted background, and dark green as the single dominant accent. Inspired by 90s arcade UI, brutalist chrome, and CRT terminal phosphor. **No rounded corners. No soft drop-shadows. No glass blur as a design element.**

### Color System
Tailwind v4 with CSS custom properties on `:root` / `.dark`. **All colors live in `frontend/src/styles/globals.css`** under the clearly-marked `PALETTE` block. To re-skin the entire app, change the values there and nothing else — every other file consumes them via `var(--bb-*)` or the matching Tailwind utility class (`bg-bb-accent`, `text-bb-error`, `border-bb-easy/60`, etc.).

Each color is defined as a **pair**:
- `--bb-foo: #hex` — solid value, also exposed as a Tailwind utility
- `--bb-foo-rgb: R, G, B` — for `rgba(var(--bb-foo-rgb), 0.4)` in pure-CSS files (markdown.css, the `.bb-grid` background, etc.)

The Monaco theme reads tokens from `:root` at mount time (see `CodeEditor.tsx`'s `readToken`/`rgba` helpers), so it stays in sync automatically — **don't add hex literals there**.

**Dark only** (`class="dark"` on `<html>`). Light tokens point at the same dark palette.

### Themes
Multiple palettes ship out-of-the-box and the user picks one via the palette button in the navbar (top-right). Each theme is a `[data-theme="<name>"]` block in `globals.css` that overrides the `:root` tokens. The selection persists in `localStorage` (`elitecode-theme`) and is applied pre-render in `main.tsx` to avoid a flash.

Built-in themes:
- `matrix` (default) — dark green Matrix terminal
- `crimson` — original red Beat-Battle palette
- `amber` — CRT amber phosphor
- `cyan` — cyber-blue terminal
- `mono` — pure monochrome

To add a new theme:
1. Add a `.dark[data-theme="<name>"] { … }` block in `globals.css`. Override only the tokens that change — anything you omit inherits from the matrix default. Always include both the hex (`--bb-foo`) and the RGB triplet (`--bb-foo-rgb`).
2. Append a row to `THEMES` in `frontend/src/stores/useThemeStore.ts` with the swatch preview colors. The dropdown picker rebuilds itself.

The theme store (`useThemeStore`) is the only place that touches `localStorage` and the `data-theme` attribute. Don't read/write either directly elsewhere.

| Token                | Value      | Role                                                  |
|----------------------|------------|-------------------------------------------------------|
| `--bb-bg`            | `#06120a`  | Page background (near-black, green-tinted)            |
| `--bb-bg-deep`       | `#030806`  | Deeper recess — file explorer, code blocks            |
| `--bb-surface`       | `#0a1c10`  | Panel / dialog / popover                              |
| `--bb-surface-2`     | `#102818`  | Subtle fills, secondary buttons                       |
| `--bb-ink`           | `#d4f5dc`  | Primary text — green-cream, never pure white          |
| `--bb-muted`         | `#5d7d63`  | Tertiary text                                         |
| `--bb-muted-strong`  | `#9bc4a3`  | Secondary text                                        |
| `--bb-accent`        | `#15803d`  | THE accent — dark green-700. Hover, active, focus     |
| `--bb-accent-deep`   | `#052e16`  | Hard shadows, scrollbar thumb                         |
| `--bb-accent-soft`   | `#22c55e`  | Light accent — em, links on hover, Monaco cursor      |
| `--bb-border`        | `rgba(21,128,61,0.6)`  | Default 2px borders                       |
| `--bb-border-soft`   | `rgba(21,128,61,0.32)` | Subtle dividers                           |
| `--bb-shadow`        | `#03200d`  | Hard offset shadow color                              |
| `--bb-selection-ink` | `#d4f5dc`  | Text color over `bb-accent` selection                 |

**Semantic status tokens** — never hardcode `text-rose-400`, `bg-emerald-500/15`, etc. Use:

| Token            | Meaning                                            | Used by                                          |
|------------------|----------------------------------------------------|--------------------------------------------------|
| `bb-success`     | ACCEPTED, "saved" feedback, submit-ok button      | Submit button, accepted test cells               |
| `bb-error`       | REJECTED, destructive, error messages, Delete menu | Wrong-answer dot, error toasts, destructive btn  |
| `bb-warning`     | TLE / runtime errors, reset button, leaderboard #1 | Test failures, leaderboard rank gold             |
| `bb-info`        | PENDING / loading                                  | Pending submission spinner/dot                   |
| `bb-special`     | Expert difficulty                                  | (alias of `bb-expert`)                           |

**Difficulty tokens** — semantic aliases over the status tokens:

| Token       | Resolves to     | Used in                         |
|-------------|-----------------|---------------------------------|
| `bb-easy`   | cyan-400         | (distinct from accent on purpose) |
| `bb-medium` | `--bb-warning`   | (amber)                         |
| `bb-hard`   | `--bb-error`     | (rose)                          |
| `bb-expert` | `--bb-special`   | (violet)                        |

So a difficulty badge is just `border-bb-hard/60 bg-bb-hard/10 text-bb-hard`. Switching e.g. Easy from cyan to lime means changing one line in globals.css.

All radii are `0px`. The `--radius*` tokens are stubbed but resolve to zero so existing `rounded-*` Tailwind classes are harmless no-ops.

### Typography
- **Display** (`font-display`): `Silkscreen` — pixel-style, used for headings, page titles, dialog titles, tab section labels. ALWAYS uppercase + `tracking-tight`.
- **Sans** (`font-sans`): `Inter` — body, UI labels, button text. Buttons/menu items use `uppercase tracking-wide`.
- **Mono** (`font-mono`): `JetBrains Mono` — IDs, timestamps, code, stat labels, tag chips, "00 / 12" counters. Tag-style mono labels usually `text-[10px] uppercase tracking-[0.14em]`.
- **Pixel fallback** (`font-pixel`): `Press Start 2P` — reserve for hero badges; almost never as body.

Loaded in `frontend/index.html` from Google Fonts.

### Effects (utility classes)
- `bb-scanlines` — CRT scanline overlay (`::after` pseudo-element with horizontal repeating gradient). Apply to a positioned ancestor; uses `mix-blend-mode: multiply` and z-index 60.
- `bb-grid` — subtle green grid background pattern (32px) with a soft accent top-glow. Use on page roots instead of plain `bg-bb-bg`. (`bb-red-grid` is kept as a back-compat alias.)
- `bb-shadow-hard` / `bb-shadow-hard-sm` / `bb-shadow-hard-lg` — hard pixel offset shadows (`Nx Nx 0 0 var(--bb-shadow)`). Used on dialogs, dropdown menus, hero badges.
- `bb-text-depth` / `bb-text-depth-sm` — display-text pixel offset shadow (accent + deep-shadow layers). Used on page titles.
- `bb-menu-item` — gives the brutalist hover behaviour (translate -2px,-2px + hard shadow on hover, accent border, accent text). Apply to any clickable surface that should "lift on press".

The viewport-edge red frame and global scanline overlay are mounted once in `App.tsx` (`<ViewportFrame />`); pages do NOT need to re-add them.

### Editor (Monaco)
Custom `lc-dark` theme defined in `frontend/src/features/Editor/components/CodeEditor/CodeEditor.tsx`. Monaco only accepts hex strings, so the file keeps a `COLORS` map of hex approximations. **Keep these in sync** with the bb-* tokens:
- `editor.background` = `#0a1c10` (matches `--bb-surface`)
- File explorer sidebar bg = `bg-bb-bg-deep` (`#030806`)
- Cursor = `#22c55e` (deliberately uses `--bb-accent-soft`, not the darker accent, for typing visibility)
- Selection = `#15803d40`
- Line numbers = `#2d4a32` / active `#9bc4a3`
- Font = `JetBrains Mono`

Code is meant to remain easy to read — colors are warm-dark, not aggressive red.

### Component Conventions

**Viewport frame** — the whole app sits inside a `fixed inset-0 border-[4px] md:border-[6px] border-bb-accent` overlay (added in `App.tsx`). Don't re-add it per page.

**Navbar** — `border-b-2 border-bb-border bg-bb-bg/95 backdrop-blur-sm`, sticky `top-0 z-50`. Logo is a `</>` monogram in a `border-bb-accent bg-bb-accent/15` square. No round avatars; user menu uses a 2-letter initials block in the same monogram style.

**Panels (Workspace)** — `border-2 border-bb-border/55 bg-bb-surface/40`. Resizable handle is transparent with `w-1.5`.

**Tabs** — Underline style with red accent: `border-b-2 border-transparent` → `data-[state=active]:border-bb-accent data-[state=active]:text-bb-accent`. Inactive tabs use `text-bb-muted-strong`. Always uppercase `font-sans text-xs tracking-wide`.

**Cards / list items** — `border-2 border-bb-border/55 bg-bb-surface/72` for elevated surfaces, `bg-bb-surface/40` for inset list containers. Hover uses `bg-bb-accent/5` (very subtle) — do NOT translate or shadow list rows on hover (reserved for actionable buttons).

**Buttons (`Button` component)**:
- `default` — accent bordered, `bg-bb-accent/12`, hovers translate `-2,-2` with hard shadow
- `outline` — surface bordered (`border-bb-border/60 bg-bb-surface/72`)
- `secondary` — flat surface-2
- `ghost` — transparent, hover only border + accent text
- `destructive` — solid `bg-bb-accent`
- `link` — accent + dashed underline on hover

All variants are uppercase, tracking-wide, 2px borders. Active state always resets translate to 0 (push-button feel).

**Difficulty badges** — Dot indicator + label in mono uppercase, 2px border:
- Easy: `border-cyan-500/60 bg-cyan-500/10 text-cyan-300` (cyan, not green — would clash with the accent)
- Medium: `border-amber-500/60 bg-amber-500/10 text-amber-300`
- Hard: `border-rose-500/60 bg-rose-500/10 text-rose-300`
- Expert: `border-violet-500/60 bg-violet-500/10 text-violet-300`

**Form inputs** — `border-2 border-bb-border/55 bg-bb-surface/72`, `focus-visible:outline-2 focus-visible:outline-bb-accent`. `Input` and `Select` are already retuned; reach for them, don't restyle ad-hoc.

**Dialog / Dropdown / Popover** — `border-2 border-bb-border bg-bb-surface` with `[box-shadow:6px_6px_0_0_var(--bb-shadow)]` (or `8px 8px` for big modals). No `rounded`, no soft shadow.

**Stats / progress bars** — `h-1.5 border border-bb-border/50 bg-bb-bg-deep p-px` wrapper with a solid color fill inside. Counts use `font-mono tabular-nums` with leading-zero pad ("01 / 12").

**Scrollbars** — Custom, 10px (chunkier than typical), red thumb (`bb-accent-deep`) with 2px bg-color border around it. Red-bordered scrollbar track. Defined in `globals.css`.

**Borders** — Almost always 2px. Reach for `border-bb-border/55` for elevated surfaces, `border-bb-border/40` for dividers, `border-bb-border/30` for subtle list separators.

### Layout
- Problems landing: `bb-grid` page root, max-w-5xl content column, hero with monogram + `bb-text-depth` title, language icon row, side-rail solved-stats panel.
- Workspace: horizontal resizable split, left 33% default, both panels are bordered cards with no chrome between them.
- Profile: max-w-3xl column of three brutalist cards (header, difficulty bars, recent submissions).
- Footers: `border-t-2 border-bb-border/50 bg-bb-bg/80`, mono uppercase 10px tracking-[0.18em] with a pulsing accent-green dot.

### File Explorer
- Sidebar bg: `bg-bb-bg-deep`, `border-r-2 border-bb-border/40`
- Selected node: `bg-bb-accent/20 text-bb-accent`
- Hover: `bg-bb-accent/5`
- Section label (TopMenu): `font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong`
- Import/Export buttons: in the **Editor tab bar** (RightSide), styled as small mono pixel buttons (see `UploadDownload.tsx`)

### Markdown (`markdown.css`)
Headings use Silkscreen uppercase, code blocks use 2px green borders + JetBrains Mono on `bb-bg-deep`, inline code uses `bb-accent-soft` text on a green-tinted bg, links are `bb-accent` with dashed green underline. Tables have green-tinted borders + Silkscreen `<th>`. Updated in lockstep with the design tokens.

### What to avoid
- `rounded-*` of any size (radii are zero — the class still parses but produces no visual; do not introduce rounded surfaces in design intent)
- Indigo, blue, slate, neutral gray accents — **everything accent-colored is dark green** (`bb-accent`). Status colors (emerald/cyan/amber/rose/violet) are allowed for difficulty/test states.
- Using `bb-accent` for anything semantically negative (errors, wrong answers, hard difficulty, destructive). Green = success/active here. Use `rose-*` instead.
- Soft drop shadows (`shadow-md`, `shadow-lg`, `shadow-black/20`) — replace with `bb-shadow-hard*` or `[box-shadow:Nx_Nx_0_0_var(--bb-shadow)]`.
- Glass blur as a primary effect (`backdrop-blur-md` is OK behind the navbar; don't lean on it for cards).
- Filled solid buttons in non-CTA spots — prefer outline/ghost.
- Pure white text — `bb-ink` is warm cream by design.
- Hardcoded `#1e1e1e`, `#191b24`, indigo hexes, or any red `#ff4d3d`-family hexes from the old palettes.
- Adding features, comments, or abstractions beyond what's asked.
