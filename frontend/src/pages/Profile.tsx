import { useUpdateUsername, useUserProfile } from "@/api/hooks/user";
import { useProblems } from "@/api/hooks/problems";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils";
import { Check, Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavbarStore } from "@/stores/useNavbarStore";
import { useSounds } from "@/hooks/useSounds";

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
  ACCEPTED: { label: "Accepted",     dot: "bg-bb-success", text: "text-bb-success" },
  REJECTED: { label: "Wrong Answer", dot: "bg-bb-error",   text: "text-bb-error"   },
  FAILED:   { label: "Error",        dot: "bg-bb-warning", text: "text-bb-warning" },
  PENDING:  { label: "Pending",      dot: "bg-bb-info",    text: "text-bb-info"    },
};

function DifficultyBar({
  label, solved, total, colorClass, barColor,
}: {
  label: string; solved: number; total: number; colorClass: string; barColor: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className={cn("font-mono text-[10px] uppercase tracking-[0.14em]", colorClass)}>{label}</span>
        <span className="font-mono text-[10px] tabular-nums text-bb-muted-strong">
          {solved}<span className="text-bb-muted/70"> / {total || "—"}</span>
        </span>
      </div>
      <div className="h-1.5 w-full border border-bb-border/50 bg-bb-bg-deep p-px">
        <div
          className={cn("h-full transition-all duration-500", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function Profile() {
  const setNavbarCenter = useNavbarStore(s => s.setNavbarCenter);
  useEffect(() => { setNavbarCenter(null); }, []);

  const user    = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);
  const { data, isLoading }  = useUserProfile();
  const { data: problems }   = useProblems();
  const updateUsername       = useUpdateUsername();

  const [editing, setEditing]         = useState(false);
  const [handleInput, setHandleInput] = useState("");
  const [handleError, setHandleError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEditing() {
    setHandleInput(user?.handle ?? "");
    setHandleError(null);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }
  function cancelEditing() { setEditing(false); setHandleError(null); }

  async function submitUsername() {
    const handle = handleInput.trim();
    if (!/^[a-z0-9_]{3,20}$/.test(handle)) {
      setHandleError("3–20 chars: lowercase letters, numbers, underscores only.");
      return;
    }
    try {
      const result = await updateUsername.mutateAsync(handle);
      if (user) setUser({ ...user, handle: result.user.handle });
      setEditing(false);
      setHandleError(null);
    } catch (err: any) {
      setHandleError(err?.response?.data?.message ?? "Failed to update username.");
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bb-red-grid">
        <Navbar />
        <div className="flex items-center justify-center h-64 font-mono text-[10px] uppercase tracking-[0.18em] text-bb-muted-strong">
          Sign in to view your profile.
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bb-red-grid">
        <Navbar />
        <div className="flex items-center justify-center h-64"><Spinner /></div>
      </div>
    );
  }

  const { stats, recentSubmissions } = data;
  const acceptRate = stats.totalSubmissions > 0
    ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
    : 0;

  const totalEasy   = problems?.filter(p => p.difficulty.toLowerCase() === "easy").length   ?? 0;
  const totalMedium = problems?.filter(p => p.difficulty.toLowerCase() === "medium").length ?? 0;
  const totalHard   = problems?.filter(p => p.difficulty.toLowerCase() === "hard").length   ?? 0;
  const totalExpert = problems?.filter(p => p.difficulty.toLowerCase() === "expert").length ?? 0;
  const totalAll    = totalEasy + totalMedium + totalHard + totalExpert;

  const initials    = user.handle.slice(0, 2).toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const cardClass = "border-2 border-bb-border/50 bg-bb-surface/72";

  const sounds = useSounds();

  return (
    <div className="min-h-screen bb-red-grid">
      <Navbar />

      <main className="relative max-w-3xl mx-auto px-4 py-10 md:py-14 space-y-4">

        {/* ── Header card ── */}
        <div className={cn(cardClass, "p-6")}>
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 shrink-0 flex items-center justify-center border-2 border-bb-accent bg-bb-accent/15 font-mono text-3xl font-bold text-bb-accent">
              {initials}
            </div>

            <div className="flex-1 min-w-0 pt-1">
              {editing ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      value={handleInput}
                      onChange={e => { setHandleInput(e.target.value); setHandleError(null); }}
                      onKeyDown={e => { if (e.key === "Enter") submitUsername(); if (e.key === "Escape") cancelEditing(); }}
                      className="font-display text-xl uppercase bg-transparent border-b-2 border-bb-border/60 focus:border-bb-accent outline-none w-48 pb-0.5 transition-colors"
                      maxLength={20}
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <button onClick={() => { sounds.click(); submitUsername(); }} disabled={updateUsername.isPending} className="p-1 hover:bg-bb-accent/10 text-bb-success disabled:opacity-40 transition-colors">
                      <Check size={14} />
                    </button>
                    <button onClick={() => { sounds.close(); cancelEditing(); }} className="p-1 hover:bg-bb-accent/10 text-bb-muted-strong transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  {handleError && <p className="font-mono text-xs text-bb-accent">{handleError}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1 className="bb-text-depth-sm font-display text-2xl uppercase tracking-tight text-bb-ink">{user.handle}</h1>
                  <button onClick={() => { sounds.click(); startEditing(); }} className="p-1 opacity-40 hover:opacity-100 hover:bg-bb-accent/10 text-bb-muted-strong transition-all" title="Edit username">
                    <Pencil size={13} />
                  </button>
                </div>
              )}
              <p className="font-mono text-xs text-bb-muted-strong mt-1">{user.email}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-bb-muted mt-1.5">Member since {memberSince}</p>
            </div>

            <div className="hidden sm:flex items-center gap-6 shrink-0 pt-1">
              {[
                { value: stats.totalSolved,       label: "Solved"      },
                { value: stats.totalSubmissions,  label: "Submissions" },
                { value: `${acceptRate}%`,        label: "Accept Rate" },
              ].map(({ value, label }, i, arr) => (
                <div key={label} className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-display text-3xl tabular-nums text-bb-ink">{value}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong mt-1">{label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-8 bg-bb-border/50" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex sm:hidden items-stretch gap-0 mt-5 pt-5 border-t-2 border-bb-border/40">
            {[
              { value: stats.totalSolved,      label: "Solved"      },
              { value: stats.totalSubmissions, label: "Submissions" },
              { value: `${acceptRate}%`,       label: "Accept Rate" },
            ].map(({ value, label }, idx, arr) => (
              <div key={label} className={cn("flex-1 text-center", idx < arr.length - 1 && "border-r-2 border-bb-border/40")}>
                <p className="font-display text-2xl tabular-nums text-bb-ink">{value}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Difficulty breakdown ── */}
        <div className={cn(cardClass, "p-6")}>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bb-muted-strong mb-5">Problems Solved</p>
          <div className="flex items-center gap-8">
            <div className="shrink-0 text-center w-16">
              <p className="bb-text-depth-sm font-display text-5xl tabular-nums leading-none text-bb-ink">{stats.totalSolved}</p>
              <p className="font-mono text-[10px] text-bb-muted mt-2 tabular-nums">/ {totalAll || "—"}</p>
            </div>
            <div className="flex-1 space-y-3.5">
              <DifficultyBar label="Easy"   solved={stats.solvedEasy}   total={totalEasy}   colorClass="text-bb-easy"   barColor="bg-bb-easy"   />
              <DifficultyBar label="Medium" solved={stats.solvedMedium} total={totalMedium} colorClass="text-bb-medium" barColor="bg-bb-medium" />
              <DifficultyBar label="Hard"   solved={stats.solvedHard}   total={totalHard}   colorClass="text-bb-hard"   barColor="bg-bb-hard"   />
              <DifficultyBar label="Expert" solved={stats.solvedExpert} total={totalExpert} colorClass="text-bb-expert" barColor="bg-bb-expert" />
            </div>
          </div>
        </div>

        {/* ── Recent submissions ── */}
        <div className={cn(cardClass, "overflow-hidden")}>
          <div className="px-5 py-3.5 border-b-2 border-bb-border/40">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bb-muted-strong">Recent Submissions</p>
          </div>

          {recentSubmissions.length === 0 ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted text-center py-10">No submissions yet.</p>
          ) : (
            <div>
              {recentSubmissions.map((sub) => {
                const s = STATUS_CONFIG[sub.status];
                return (
                  <Link
                    key={sub.id}
                    to={`/problems/${sub.problemSlug}`}
                    className="flex items-center gap-3 px-5 py-3.5 border-b-2 border-bb-border/30 last:border-0 hover:bg-bb-accent/5 transition-colors group"
                    onClick={sounds.enter}
                  >
                    <span className={cn("w-1.5 h-1.5 shrink-0", s?.dot ?? "bg-bb-muted")} />
                    <span className={cn("font-mono text-[10px] uppercase tracking-[0.14em] w-[7rem] shrink-0", s?.text ?? "text-bb-muted-strong")}>
                      {s?.label ?? sub.status}
                    </span>
                    <span className="flex-1 font-sans text-sm text-bb-ink truncate group-hover:text-bb-accent transition-colors">
                      {sub.problemTitle}
                    </span>
                    <span className="w-16 hidden sm:block shrink-0">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] px-1.5 py-0.5 bg-bb-bg/40 text-bb-muted-strong border-2 border-bb-border/40">
                        {sub.language}
                      </span>
                    </span>
                    <span className="font-mono text-[10px] text-bb-muted shrink-0 tabular-nums w-24 text-right">
                      {formatDate(sub.submittedAt)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
