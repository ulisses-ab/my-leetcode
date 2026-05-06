import { useProblemSubmissions } from "@/api/hooks/submissions";
import { useWorkspaceStore } from "../../store";
import { SubmissionCard } from "./SubmissionCard";
import { SubmissionDetails } from "./details/SubmissionDetails";
import { Loader2, FileX2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 text-bb-muted-strong">
      <Icon size={28} strokeWidth={1.5} />
      <p className="font-mono text-[10px] uppercase tracking-[0.18em]">{message}</p>
    </div>
  );
}

export function SubmissionsTab() {
  const problem = useWorkspaceStore(state => state.problem);
  const setup   = useWorkspaceStore(state => state.setup);
  const { data: submissions, isLoading, error } = useProblemSubmissions(problem?.id!);
  const selectedSubmission  = useWorkspaceStore(state => state.selectedSubmission);
  const setSelectedSubmission = useWorkspaceStore(state => state.setSelectedSubmission);

  if (selectedSubmission) {
    return (
      <SubmissionDetails
        id={selectedSubmission.id}
        onClose={() => setSelectedSubmission(null)}
      />
    );
  }

  if (!problem || !setup) {
    return <EmptyState icon={FileX2} message="Select a language to see submissions" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 gap-2 text-bb-muted-strong">
        <Loader2 size={16} className="animate-spin" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Loading…</span>
      </div>
    );
  }

  if (error) {
    return <EmptyState icon={AlertCircle} message="Failed to load submissions" />;
  }

  const filteredSubmissions = (submissions ?? []).filter(s => s.setupId === setup.id);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b-2 border-bb-border/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 bg-bb-accent/10 text-bb-accent border-2 border-bb-accent/40">
            {setup.language}
          </span>
          <span className="font-display text-sm uppercase tracking-tight text-bb-ink">Submissions</span>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-bb-muted-strong">
          {String(filteredSubmissions.length).padStart(2, "0")}
        </span>
      </div>

      {/* List */}
      {filteredSubmissions.length === 0 ? (
        <EmptyState icon={FileX2} message="No submissions yet" />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {filteredSubmissions.map((submission, idx) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, delay: Math.min(idx * 0.04, 0.2), ease: "easeOut" }}
            >
              <SubmissionCard
                problem={problem}
                submission={submission}
                onClick={() => setSelectedSubmission(submission)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
