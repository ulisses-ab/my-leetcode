import { SiC, SiCplusplus, SiRust, SiPython } from "react-icons/si";
import { Navbar } from "@/components/layout/Navbar/Navbar"
import { ProblemList } from "@/features/ProblemList/ProblemList"
import { useNavbarStore } from "@/stores/useNavbarStore"
import { useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { useUserProfile } from "@/api/hooks/user";
import { useProblems } from "@/api/hooks/problems";
import type { Problem } from "@/types/Problem";
import type { UserProfile } from "@/api/functions/user";

const LANGUAGES = [
  { icon: SiC,         label: "C"      },
  { icon: SiCplusplus, label: "C++"    },
  { icon: SiRust,      label: "Rust"   },
  { icon: SiPython,    label: "Python" },
] as const;

const DIFFS = [
  { key: "easy",   label: "Easy",   labelClass: "text-bb-easy",   barClass: "bg-bb-easy"   },
  { key: "medium", label: "Medium", labelClass: "text-bb-medium", barClass: "bg-bb-medium" },
  { key: "hard",   label: "Hard",   labelClass: "text-bb-hard",   barClass: "bg-bb-hard"   },
  { key: "expert", label: "Expert", labelClass: "text-bb-expert", barClass: "bg-bb-expert" },
] as const;

function SolvedStats({ profile, problems }: { profile: UserProfile | null; problems: Problem[] }) {
  const totalByDiff: Record<string, number> = {};
  for (const p of problems) {
    const d = p.difficulty.toLowerCase();
    totalByDiff[d] = (totalByDiff[d] || 0) + 1;
  }

  const solvedByDiff: Record<string, number> = {
    easy:   profile?.stats.solvedEasy   ?? 0,
    medium: profile?.stats.solvedMedium ?? 0,
    hard:   profile?.stats.solvedHard   ?? 0,
    expert: profile?.stats.solvedExpert ?? 0,
  };

  const totalSolved = profile?.stats.totalSolved ?? 0;
  const activeDiffs = DIFFS.filter(d => (totalByDiff[d.key] ?? 0) > 0);

  return (
    <div className="w-60 shrink-0 border-2 border-bb-border/55 bg-bb-surface/72 [box-shadow:8px_8px_0_0_var(--bb-shadow)]">
      <div className="px-4 pt-4 pb-3 border-b-2 border-bb-border/40">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong mb-2">Solved</p>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-3xl leading-none text-bb-ink">{totalSolved}</span>
          <span className="font-mono text-xs text-bb-muted-strong">/ {problems.length}</span>
        </div>
      </div>

      <div className="px-4 py-3.5 flex flex-col gap-2.5">
        {activeDiffs.map(({ key, label, labelClass, barClass }) => {
          const total = totalByDiff[key] ?? 0;
          const solved = solvedByDiff[key] ?? 0;
          const pct = total > 0 ? (solved / total) * 100 : 0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${labelClass}`}>{label}</span>
                <span className="font-mono text-[10px] tabular-nums text-bb-muted-strong">
                  {solved}<span className="text-bb-muted/70">/{total}</span>
                </span>
              </div>
              <div className="h-1.5 w-full border border-bb-border/50 bg-bb-bg-deep p-px">
                <div className={`h-full ${barClass}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UserStats() {
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useUserProfile();
  const { data: problems } = useProblems();
  if (!problems) return null;
  return <SolvedStats profile={user ? (profile ?? null) : null} problems={problems} />;
}

export function Problems() {
  const setNavbarCenter = useNavbarStore((state) => state.setNavbarCenter);

  useSEO({
    title: "Problems — EliteCode",
    description: "Browse and solve real-world software engineering problems. Implement rate limiters, caches, URL routers, and other systems challenges in C.",
    canonicalPath: "/problems",
  });

  useEffect(() => {
    setNavbarCenter(<></>);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bb-red-grid">
      <Navbar />

      <div className="relative w-full max-w-5xl mx-auto px-4 pt-10 md:pt-14 pb-16 flex flex-col gap-10 flex-1">
        {/* Hero */}
        <section className="flex flex-col md:flex-row md:items-end gap-8">
          <div className="flex-1 space-y-5">
            <h1 className="bb-text-depth font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-bb-ink leading-[1.05]">
              Challenges
            </h1>

            <p className="font-sans text-sm text-bb-muted-strong leading-relaxed max-w-md">
              An environment for practicing real software engineering: caches, routers, file systems and other systems-level problems.
            </p>

            <div className="flex items-center gap-3 pt-1">
              {LANGUAGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex h-12 w-12 [box-shadow:4px_4px_0_0_var(--bb-shadow)] items-center justify-center border-2 border-bb-border/55 bg-bb-surface/72 text-bb-muted-strong"
                  title={label}
                >
                  <Icon size={22} />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <UserStats />
          </div>
        </section>

        <ProblemList />
      </div>

      <footer className="relative w-full border-t-2 border-bb-border/50 bg-bb-bg/80 px-4 md:px-6 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-bb-muted-strong">
        <div className="flex items-center gap-4">
          <Link to="/terms"   className="hover:text-bb-accent transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-bb-accent transition-colors">Privacy</Link>
        </div>
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} EliteCode</span>
          <span className="h-2 w-2 bg-bb-accent animate-pulse" />
        </div>
      </footer>
    </div>
  );
}
