import { Navbar } from "@/components/layout/Navbar/Navbar";
import { useAllResources } from "@/api/hooks/resources";
import { useNavbarStore } from "@/stores/useNavbarStore";
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Resource } from "@/types/Resource";
import { ResourceViewer } from "@/components/ResourceViewer";
import { playEnter } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b-2 border-bb-border/30 last:border-0">
      <div className="w-5 shrink-0 flex justify-end">
        <div className="h-3 w-3 bg-bb-border/40 animate-pulse" />
      </div>
      <div className="h-3.5 bg-bb-border/40 animate-pulse" style={{ width: `${30 + Math.random() * 40}%` }} />
    </div>
  );
}

export function Resources() {
  const { data: resources, isLoading } = useAllResources();
  const setNavbarCenter = useNavbarStore((state) => state.setNavbarCenter);
  const [selected, setSelected] = useState<Resource | null>(null);

  useSEO({
    title: "Resources — EliteCode",
    description: "Learning materials and references to help you solve EliteCode problems.",
    canonicalPath: "/resources",
  });

  useEffect(() => {
    setNavbarCenter(<></>);
  }, []);

  const sorted = resources ? [...resources].sort((a, b) => a.order - b.order) : [];

  return (
    <div className="min-h-screen flex flex-col bb-red-grid">
      <Navbar />

      <div className="relative mt-14 mb-10 text-center px-4 flex flex-col items-center">
        <h1 className="bb-text-depth font-display text-4xl sm:text-5xl uppercase tracking-tight text-bb-ink mb-4">
          Resources
        </h1>
        <p className="font-sans text-sm text-bb-muted-strong max-w-md mx-auto leading-relaxed">
          Reference material and guides to help you think through the problems.
        </p>
      </div>

      <div className="relative w-full flex justify-center px-4 pb-16 flex-1">
        <div className="w-full max-w-3xl">
          <div className="border-2 border-bb-border/55 bg-bb-surface/40 overflow-hidden">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : sorted.length === 0 ? (
              <p className="py-12 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-bb-muted-strong">
                No resources yet.
              </p>
            ) : (
              sorted.map((resource, idx) => (
                <button
                  key={resource.id}
                  onClick={() => { if (useSoundStore.getState().enabled) playEnter(); setSelected(resource); }}
                  className="group w-full flex items-center gap-3 px-5 py-3.5 border-b-2 border-bb-border/30 last:border-0 hover:bg-bb-accent/5 transition-colors text-left"
                >
                  <span className="font-mono text-[11px] tabular-nums text-bb-muted w-6 shrink-0 text-right">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-sans text-sm text-bb-ink group-hover:text-bb-accent transition-colors truncate">
                    {resource.title}
                  </span>
                  <ChevronRight size={13} className="shrink-0 text-bb-muted group-hover:text-bb-accent transition-colors" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <footer className="w-full border-t-2 border-bb-border/50 bg-bb-bg/80 px-4 md:px-6 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-bb-muted-strong">
        <div className="flex items-center gap-4">
          <Link to="/terms"   className="hover:text-bb-accent transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-bb-accent transition-colors">Privacy</Link>
        </div>
        <span>© {new Date().getFullYear()} EliteCode</span>
      </footer>

      <ResourceViewer
        resource={selected}
        open={!!selected}
        onOpenChange={(open) => { if (!open) setSelected(null); }}
      />
    </div>
  );
}
