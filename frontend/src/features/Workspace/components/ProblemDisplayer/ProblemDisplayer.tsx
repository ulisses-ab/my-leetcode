import type { Problem } from "@/types/Problem";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DifficultyTag } from "@/features/ProblemList/DifficultyTag";

export function ProblemDisplayer({ problem }: { problem?: Problem }) {
  if (!problem) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bb-muted-strong">
          Loading problem…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 border-b-2 border-bb-border/40 shrink-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="bb-text-depth-sm font-display text-2xl sm:text-3xl uppercase leading-tight tracking-tight text-bb-ink">
            {problem.title}
          </h1>
          <div className="shrink-0 pt-1">
            <DifficultyTag difficulty={problem.difficulty} />
          </div>
        </div>
        {problem.description && (
          <p className="font-sans text-sm text-bb-muted-strong leading-relaxed">
            {problem.description}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 pb-20">
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.statement}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
