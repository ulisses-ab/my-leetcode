import { useState } from "react";
import { useResources } from "@/api/hooks/resources";
import { useWorkspaceStore } from "../../store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, ChevronLeft, ChevronRight, Loader2, Maximize2 } from "lucide-react";
import type { Resource } from "@/types/Resource";
import { ResourceViewer } from "@/components/ResourceViewer";
import { playEnter, playClose, playOpen } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

function ResourceList({
  resources,
  onSelect,
}: {
  resources: Resource[];
  onSelect: (r: Resource) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b-2 border-bb-border/40 shrink-0">
        <span className="font-display text-sm uppercase tracking-tight text-bb-ink">Resources</span>
        <span className="font-mono text-[11px] tabular-nums text-bb-muted-strong">
          {String(resources.length).padStart(2, "0")}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {resources.map((resource, idx) => (
          <button
            key={resource.id}
            onClick={() => { if (useSoundStore.getState().enabled) playEnter(); onSelect(resource); }}
            className="group w-full flex items-center gap-3 px-5 py-3.5 border-b-2 border-bb-border/30 last:border-0 hover:bg-bb-accent/5 transition-colors text-left"
          >
            <span className="font-mono text-[10px] tabular-nums text-bb-muted w-5 shrink-0 text-right">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-sans text-sm text-bb-ink group-hover:text-bb-accent transition-colors leading-snug">
              {resource.title}
            </span>
            <ChevronRight
              size={13}
              className="text-bb-muted group-hover:text-bb-accent shrink-0 transition-colors"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

function ResourceReader({
  resource,
  onBack,
}: {
  resource: Resource;
  onBack: () => void;
}) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-bb-border/40 shrink-0">
          <button
            onClick={() => { if (useSoundStore.getState().enabled) playClose(); onBack(); }}
            className="flex items-center gap-1 px-2.5 py-1.5 border-2 border-bb-border/55 bg-bb-surface/72 font-sans text-xs uppercase tracking-wide text-bb-ink hover:text-bb-accent hover:border-bb-accent transition-colors"
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
            Resources
          </button>
          <button
            onClick={() => { if (useSoundStore.getState().enabled) playOpen(); setFullscreen(true); }}
            className="flex items-center justify-center w-7 h-7 border-2 border-bb-border/55 bg-bb-surface/72 text-bb-muted-strong hover:text-bb-accent hover:border-bb-accent transition-colors"
            title="Open fullscreen"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-20">
          <h2 className="bb-text-depth-sm font-display text-2xl uppercase text-bb-ink mb-5 leading-snug tracking-tight">
            {resource.title}
          </h2>
          <MarkdownContent content={resource.content} />
        </div>
      </div>

      <ResourceViewer resource={resource} open={fullscreen} onOpenChange={setFullscreen} />
    </>
  );
}

export function ResourcesTab() {
  const problem = useWorkspaceStore((state) => state.problem);
  const { data: resources, isLoading } = useResources(problem?.id);
  const [selected, setSelected] = useState<Resource | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 gap-2 text-bb-muted-strong">
        <Loader2 size={16} className="animate-spin" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Loading…</span>
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-bb-muted-strong">
        <BookOpen size={28} strokeWidth={1.5} />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em]">No resources yet.</p>
      </div>
    );
  }

  if (selected) {
    return <ResourceReader resource={selected} onBack={() => setSelected(null)} />;
  }

  return <ResourceList resources={resources} onSelect={setSelected} />;
}
