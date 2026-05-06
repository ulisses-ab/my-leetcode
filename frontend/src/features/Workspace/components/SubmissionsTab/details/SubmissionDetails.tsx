import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { playClose } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, Clock, Cpu, Loader2, FolderOpen } from "lucide-react";
import { CopyToClipboardButton } from "@/components/ui/CopyToClipboardButton";
import { useSubmissionWithResults, useSubmissionCode } from "@/api/hooks/submissions";
import { useWorkspaceStore } from "@/features/Workspace/store";
import { useTests } from "@/api/hooks/problems";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type SubmissionDetailsProps = {
  id: string;
  onClose: () => void;
};

const STATUS = {
  ACCEPTED: { label: "Accepted",      color: "text-bb-success", bar: "bg-bb-success" },
  REJECTED: { label: "Wrong Answer",  color: "text-bb-error",   bar: "bg-bb-error"   },
  FAILED:   { label: "Runtime Error", color: "text-bb-warning", bar: "bg-bb-warning" },
  PENDING:  { label: "Pending",       color: "text-bb-info",    bar: "bg-bb-info"    },
} as const;

function totalMs(results: any): number {
  return Math.trunc(
    (results?.testcases ?? []).reduce((sum: number, t: any) => sum + (t.time_ms ?? 0), 0)
  );
}

export function SubmissionDetails({ id, onClose }: SubmissionDetailsProps) {
  const { data, isLoading } = useSubmissionWithResults(id);
  const { mutateAsync: fetchCode, isPending: isLoadingCode } = useSubmissionCode();
  const setSubmissionResults = useWorkspaceStore(state => state.setSubmissionResults);
  const setRightTab = useWorkspaceStore(state => state.setRightTab);
  const problem  = useWorkspaceStore(state => state.problem);
  const setupId  = useWorkspaceStore(state => state.setup?.id);
  const { data: tests } = useTests(problem?.id!, setupId!);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (data?.results) setSubmissionResults(data.results);
  }, [data?.results, setSubmissionResults]);

  const handleConfirmLoad = async () => {
    setConfirmOpen(false);
    const zip = await fetchCode(id);
    const currentEditor = useWorkspaceStore.getState().editor;
    if (!currentEditor) return;
    await currentEditor.loadFromZip(zip);
    setRightTab("editor");
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-bb-muted-strong">
        <Loader2 size={18} className="animate-spin" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Loading…</span>
      </div>
    );
  }

  const { submission, results } = data;
  const theme = STATUS[submission.status as keyof typeof STATUS] ?? STATUS.PENDING;

  const totalTests  = tests?.testcases?.length ?? 0;
  const passedTests = results?.testcases?.filter((t: any) => t.status === "ACCEPTED").length ?? 0;
  const pct = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load submission code?</DialogTitle>
            <DialogDescription className="font-sans text-xs text-bb-muted-strong">
              This will replace your current code in the editor with the code from this submission. Any unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLoad}
              disabled={isLoadingCode}
              variant="default"
            >
              {isLoadingCode && <Loader2 size={13} className="animate-spin mr-1" />}
              Load code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex items-center px-3 py-2 border-b-2 border-bb-border/40 shrink-0">
          <button
            onClick={() => { if (useSoundStore.getState().enabled) playClose(); onClose(); }}
            className="flex items-center gap-1 px-2.5 py-1.5 border-2 border-bb-border/55 bg-bb-surface/72 font-sans text-xs uppercase tracking-wide text-bb-ink hover:text-bb-accent hover:border-bb-accent transition-colors"
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
            All Submissions
          </button>
        </div>

        <div className="flex-1 px-5 py-5 space-y-5">
          <div>
            <p className={cn("bb-text-depth-sm font-display text-2xl uppercase tracking-tight", theme.color)}>
              {theme.label}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong mt-1">
              {format(new Date(submission.submittedAt), "MMM d, yyyy · h:mm a")}
            </p>
          </div>

          {totalTests > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-bb-muted-strong">
                <span>Test cases</span>
                <span className="tabular-nums">{passedTests} / {totalTests}</span>
              </div>
              <div className="h-1.5 w-full border border-bb-border/50 bg-bb-bg-deep p-px">
                <div
                  className={cn("h-full transition-all duration-500", theme.bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          {submission.status === "ACCEPTED" && results && (
            <div className="grid grid-cols-2 gap-2">
              <StatCard
                icon={<Clock size={13} />}
                label="Runtime"
                value={`${totalMs(results)} ms`}
              />
              <StatCard
                icon={<Cpu size={13} />}
                label="Memory"
                value={results.memory ? `${results.memory} KB` : "N/A"}
              />
            </div>
          )}

          {submission.status === "FAILED" && (
            <div className="border-2 border-bb-warning/40 bg-bb-warning/[0.08] p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-warning">
                  Error
                </p>
                <CopyToClipboardButton
                  text={results?.error ?? "Unknown error"}
                  variant="ghost"
                  size="icon"
                  showText={false}
                  className="h-6 w-6 text-bb-warning hover:text-bb-warning"
                />
              </div>
              <pre className="font-mono text-xs text-bb-warning whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-60">
                {results?.error ?? "Unknown error"}
              </pre>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => setConfirmOpen(true)}
            disabled={isLoadingCode}
            className="w-full gap-2"
          >
            {isLoadingCode
              ? <Loader2 size={14} className="animate-spin" />
              : <FolderOpen size={14} />
            }
            Load code in editor
          </Button>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-2 border-bb-border/45 bg-bb-bg/40 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-bb-muted-strong">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">{label}</span>
      </div>
      <span className="font-mono text-sm text-bb-ink">{value}</span>
    </div>
  );
}
