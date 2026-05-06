import { useLeaderboard } from "@/api/hooks/submissions";
import { useWorkspaceStore } from "../../store";
import type { LeaderboardRow } from "@/api/functions/submissions";
import { Clock, Cpu, Loader2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const RANK_COLORS = ["text-bb-warning", "text-bb-muted-strong", "text-bb-warning/60"];

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <Trophy
        size={12}
        className={cn("shrink-0", RANK_COLORS[rank - 1])}
        fill="currentColor"
      />
    );
  }
  return (
    <span className="font-mono text-[10px] text-bb-muted w-3 text-center">
      {rank}
    </span>
  );
}

function LeaderboardTable({
  rows,
  metric,
  icon,
  label,
  format,
}: {
  rows: LeaderboardRow[];
  metric: "runtimeMs" | "memoryKb";
  icon: React.ReactNode;
  label: string;
  format: (v: number) => string;
}) {
  return (
    <div className="border-2 border-bb-border/45 overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b-2 border-bb-border/30 bg-bb-bg/50">
        <span className="text-bb-muted-strong">{icon}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong">
          {label}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted px-3 py-4 text-center">
          No data yet
        </p>
      ) : (
        <div>
          {rows.map((row) => (
            <div
              key={row.submissionId}
              className="flex items-center gap-2.5 px-3 py-2 border-b-2 border-bb-border/20 last:border-0 hover:bg-bb-accent/5 transition-colors"
            >
              <RankBadge rank={row.rank} />
              <span className="flex-1 font-sans text-xs text-bb-ink truncate">
                {row.userHandle}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] px-1.5 py-0.5 bg-bb-bg/40 text-bb-muted-strong border-2 border-bb-border/40 shrink-0">
                {row.language}
              </span>
              <span className="font-mono text-xs text-bb-ink shrink-0 tabular-nums">
                {row[metric] !== null ? format(row[metric]!) : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LeaderboardTab() {
  const problem = useWorkspaceStore((state) => state.problem);
  const setup = useWorkspaceStore((state) => state.setup);
  const { data, isLoading } = useLeaderboard(problem?.id ?? null, setup?.id ?? null);

  if (!problem || !setup) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-bb-muted-strong">
        <Trophy size={28} strokeWidth={1.5} />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em]">Select a language to see rankings</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-48 gap-2 text-bb-muted-strong">
        <Loader2 size={16} className="animate-spin" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <LeaderboardTable
        rows={data.byRuntime}
        metric="runtimeMs"
        icon={<Clock size={12} />}
        label="Fastest"
        format={(v) => `${v} ms`}
      />
      <LeaderboardTable
        rows={data.byMemory}
        metric="memoryKb"
        icon={<Cpu size={12} />}
        label="Least Memory"
        format={(v) => `${v} KB`}
      />
    </div>
  );
}
