import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/useSounds";
import { Input } from "@/components/ui/input";
import { useProblems } from "@/api/hooks/problems";
import type { Problem } from "@/types/Problem";
import { Link } from "react-router-dom";
import { DifficultyTag } from "./DifficultyTag";
import { X } from "lucide-react";
import Fuse from "fuse.js";

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard", "Expert"] as const;

export function ProblemList() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Problem["difficulty"] | "All">("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { data: problems, isLoading } = useProblems();
  const sounds = useSounds();

  const allTags = useMemo(() => {
    if (!problems) return [];
    const set = new Set<string>();
    for (const p of problems) for (const t of p.tags) set.add(t);
    return Array.from(set).sort();
  }, [problems]);

  const fuse = useMemo(() => {
    if (!problems) return null;
    return new Fuse(problems, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "description", weight: 0.25 },
        { name: "tags", weight: 0.25 },
      ],
      threshold: 0.25,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [problems]);

  const filteredProblems = useMemo(() => {
    if (!problems) return [];

    const matchesDifficulty = (p: Problem) =>
      difficulty === "All" || p.difficulty.toLowerCase() === difficulty.toLowerCase();
    const matchesTag = (p: Problem) => !activeTag || p.tags.includes(activeTag);

    if (!search.trim() || !fuse) {
      return problems.filter(matchesDifficulty).filter(matchesTag);
    }

    return fuse
      .search(search)
      .map((r) => r.item)
      .filter(matchesDifficulty)
      .filter(matchesTag);
  }, [search, difficulty, activeTag, fuse, problems]);

  return (
    <div className="space-y-4 w-full">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch">
        <Input
          placeholder="Search challenges…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <div className="flex items-stretch border-2 border-bb-border/55 bg-bb-surface/72 shrink-0 overflow-x-auto">
          {DIFFICULTIES.map((d) => (
            <motion.button
              key={d}
              onClick={() => { sounds.click(); setDifficulty(d); }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.08 }}
              className={`flex-1 sm:flex-none sm:px-3 py-2 font-sans text-[11px] uppercase tracking-wide border-r-2 border-bb-border/30 last:border-r-0 transition-colors ${
                difficulty === d
                  ? "bg-bb-accent/15 text-bb-accent"
                  : "text-bb-muted-strong hover:text-bb-ink"
              }`}
            >
              {d}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tag chips */}
      {/*allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] border-2 transition-colors ${
                activeTag === tag
                  ? "bg-bb-accent/15 text-bb-accent border-bb-accent"
                  : "bg-bb-surface/60 text-bb-muted-strong border-bb-border/40 hover:text-bb-ink hover:border-bb-border"
              }`}
            >
              {tag}
            </button>
          ))}
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] border-2 border-bb-border/30 text-bb-muted hover:text-bb-accent hover:border-bb-accent transition-colors"
            >
              <X size={10} />
              Clear
            </button>
          )}
        </div>
      )*/}

      {/* List */}
      <div className="border-2 border-bb-border/55 bg-bb-surface/40">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-[28px_1fr_224px_96px] items-center gap-4 px-4 py-3.5 ${idx !== 5 ? "border-b-2 border-bb-border/30" : ""}`}
            >
              <div className="flex justify-end">
                <div className="h-3 w-3 bg-bb-border/40 animate-pulse" />
              </div>
              <div className="h-3.5 bg-bb-border/40 animate-pulse" style={{ maxWidth: `${40 + (idx * 13) % 40}%` }} />
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="h-3 w-10 bg-bb-border/30 animate-pulse" />
              </div>
              <div className="h-5 w-14 bg-bb-border/40 animate-pulse" />
            </div>
          ))
        ) : filteredProblems.length === 0 ? (
          <p className="py-12 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-bb-muted-strong">
            No problems found.
          </p>
        ) : (
          filteredProblems.map((problem, idx) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: Math.min(idx * 0.04, 0.28), ease: "easeOut" }}
              className={idx !== filteredProblems.length - 1 ? "border-b-2 border-bb-border/30" : ""}
            >
              <Link
                to={`/problems/${problem.slug}`}
                onClick={sounds.enter}
                className="group grid grid-cols-[28px_1fr_96px] sm:grid-cols-[28px_1fr_224px_96px] items-center gap-4 px-4 py-3.5 hover:bg-bb-accent/5 transition-colors"
              >
                <span className="font-mono text-[11px] tabular-nums text-bb-muted/70 text-right">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <span className="font-sans text-sm text-bb-ink group-hover:text-bb-accent transition-colors truncate">
                  {problem.title}
                </span>

                <div className="hidden sm:flex items-center gap-1.5">
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] border border-bb-border/40 bg-bb-bg/40 text-bb-muted-strong"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div>
                  <DifficultyTag difficulty={problem.difficulty} />
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
