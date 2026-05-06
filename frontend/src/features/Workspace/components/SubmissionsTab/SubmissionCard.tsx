import type { Problem } from "@/types/Problem";
import type { Submission } from "@/types/Submission";
import { format } from "timeago.js";
import { ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { playClick } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

type StatusConfig = {
  label: string;
  dot: string;
  text: string;
};

function statusConfig(status: Submission["status"]): StatusConfig {
  switch (status) {
    case "ACCEPTED":
      return { label: "Accepted",     dot: "bg-bb-success", text: "text-bb-success" };
    case "REJECTED":
      return { label: "Wrong Answer", dot: "bg-bb-error",   text: "text-bb-error"   };
    case "PENDING":
      return { label: "Pending",      dot: "bg-bb-info",    text: "text-bb-info"    };
    default:
      return { label: "Error",        dot: "bg-bb-warning", text: "text-bb-warning" };
  }
}

export type SubmissionCardProps = {
  submission: Submission;
  problem: Problem;
  onClick?: () => void;
};

export function SubmissionCard({ submission, onClick }: SubmissionCardProps) {
  const status = statusConfig(submission.status);
  const isPending = submission.status === "PENDING";

  return (
    <div
      onClick={isPending ? undefined : () => { if (useSoundStore.getState().enabled) playClick(); onClick?.(); }}
      className={cn(
        "group flex items-center gap-3 px-5 py-3 border-b-2 border-bb-border/30 transition-colors",
        isPending
          ? "cursor-default opacity-70"
          : "cursor-pointer hover:bg-bb-accent/5"
      )}
    >
      {isPending ? (
        <Loader2 size={12} className="shrink-0 text-bb-info animate-spin" />
      ) : (
        <span className={cn("w-2 h-2 shrink-0", status.dot)} />
      )}

      <span className={cn("font-mono text-[11px] uppercase tracking-[0.14em]", status.text)}>
        {status.label}
      </span>

      <span className="font-mono text-[10px] text-bb-muted-strong ml-auto tabular-nums">
        {format(submission.submittedAt)}
      </span>

      {!isPending && (
        <ChevronRight
          size={14}
          className="text-bb-muted group-hover:text-bb-accent transition-colors shrink-0"
        />
      )}
    </div>
  );
}
