import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { stringifyObject } from "./stringifyObject";
import { cn } from "@/lib/utils";
import { Copy, Check, Lock } from "lucide-react";
import { playCopy } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

const DEFAULT_CODE_BLOCK_HEIGHT = 128;
const MIN_CODE_BLOCK_HEIGHT = 60;

type StatusConfig = {
  container: string;
  label: string;
  labelClass: string;
  errorBorder: string;
  errorBg: string;
  errorLabel: string;
  errorText: string;
};

function getStatusConfig(status: string): StatusConfig {
  switch (status) {
    case "ACCEPTED":
      return {
        container: "border-bb-success/60 bg-bb-success/[0.05]",
        label: "Accepted",
        labelClass: "text-bb-success",
        errorBorder: "", errorBg: "", errorLabel: "", errorText: "",
      };
    case "REJECTED":
      return {
        container: "border-bb-error/60 bg-bb-error/[0.05]",
        label: "Wrong Answer",
        labelClass: "text-bb-error",
        errorBorder: "", errorBg: "", errorLabel: "", errorText: "",
      };
    case "TLE":
      return {
        container: "border-bb-warning/60 bg-bb-warning/[0.05]",
        label: "Time Limit",
        labelClass: "text-bb-warning",
        errorBorder: "border-bb-warning/40",
        errorBg: "bg-bb-warning/[0.08]",
        errorLabel: "text-bb-warning",
        errorText: "text-bb-warning",
      };
    case "FAILED":
      return {
        container: "border-bb-warning/60 bg-bb-warning/[0.05]",
        label: "Error",
        labelClass: "text-bb-warning",
        errorBorder: "border-bb-warning/40",
        errorBg: "bg-bb-warning/[0.08]",
        errorLabel: "text-bb-warning",
        errorText: "text-bb-warning",
      };
    default:
      return {
        container: "border-bb-border/55",
        label: "",
        labelClass: "",
        errorBorder: "", errorBg: "", errorLabel: "", errorText: "",
      };
  }
}

export function TestItem({
  testcase,
  index,
  results,
}: {
  testcase: any;
  index: number;
  results: any;
}) {
  const [codeBlockHeight, setCodeBlockHeight] = useState(DEFAULT_CODE_BLOCK_HEIGHT);

  function display(obj: any) {
    return typeof obj === "string" ? obj : stringifyObject(obj);
  }

  function startResize(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const startY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const startHeight = codeBlockHeight;

    document.body.style.userSelect = "none";

    function onMove(e: MouseEvent | TouchEvent) {
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      setCodeBlockHeight(Math.max(MIN_CODE_BLOCK_HEIGHT, startHeight + (y - startY)));
    }

    function onUp() {
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onUp);
  }

  const status = getStatusConfig(results?.status);
  const isHidden = testcase.hidden === true;
  const hasError = (results?.status === "FAILED" || results?.status === "TLE") && results?.error;
  const hasStats = results?.time_ms != null || results?.memory_kb != null;

  return (
    <AccordionItem
      value={`testcase-${index}`}
      className={cn(
        "group border-2 bg-bb-surface/40 transition-colors duration-150",
        status.container
      )}
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-transparent [&>svg]:text-bb-muted-strong">
        <div className="flex w-full items-center justify-between pr-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong">
              Case {String(index + 1).padStart(2, "0")}
            </span>
            {isHidden && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-bb-muted">
                <Lock size={9} />
                hidden
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasStats && (
              <span className="font-mono text-[10px] tabular-nums text-bb-muted">
                {results.time_ms != null && `${Math.round(results.time_ms)} ms`}
                {results.time_ms != null && results.memory_kb != null && " · "}
                {results.memory_kb != null && `${results.memory_kb} KB`}
              </span>
            )}
            {results?.status && (
              <span className={cn("font-mono text-[10px] uppercase tracking-[0.16em]", status.labelClass)}>
                {status.label}
              </span>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-0 pt-0">
        {isHidden ? (
          <div className="pb-3 grid gap-3 grid-cols-1 sm:grid-cols-3">
            <HiddenBlock title="Input" />
            <HiddenBlock title="Expected" />
            <HiddenBlock title="Output" />
          </div>
        ) : (<>
          <div className="space-y-3">
            {hasError && (
              <div className={cn("border-2 p-3", status.errorBorder, status.errorBg)}>
                <p className={cn("font-mono text-[10px] uppercase tracking-[0.16em] mb-1.5", status.errorLabel)}>
                  {results.errorType ?? "Error"}
                </p>
                <pre className={cn("font-mono text-xs whitespace-pre-wrap leading-relaxed", status.errorText)}>
                  {results.error}
                </pre>
              </div>
            )}

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              <CodeBlock title="Input" content={display(testcase.input)} maxHeight={codeBlockHeight} />
              <CodeBlock title="Expected" content={display(testcase.output)} maxHeight={codeBlockHeight} />
              <CodeBlock
                title="Output"
                content={results?.actual_output != null ? display(results.actual_output) : null}
                maxHeight={codeBlockHeight}
                highlight={
                  results?.status === "REJECTED" ? "wrong" :
                  results?.status === "ACCEPTED" ? "correct" : undefined
                }
              />
            </div>

            {results?.stdout && (
              <CodeBlock title="Stdout" content={results.stdout} maxHeight={codeBlockHeight} mono />
            )}
          </div>
          <div
            onMouseDown={startResize}
            onTouchStart={startResize}
            className="group-data-[state=closed]:hidden mt-3 h-3 flex items-center justify-center cursor-row-resize"
          >
            <div className="w-8 h-0.5 bg-bb-border/40 group-hover:bg-bb-accent transition-colors" />
          </div>
        </>)}
      </AccordionContent>
    </AccordionItem>
  );
}

function HiddenBlock({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong">
        {title}
      </span>
      <div className="border-2 border-bb-border/40 bg-bb-bg/40 p-3 flex items-center gap-1.5 text-bb-muted">
        <Lock size={10} />
        <span className="font-mono text-xs italic">hidden</span>
      </div>
    </div>
  );
}

function CodeBlock({
  title,
  content,
  highlight,
  maxHeight,
  mono = true,
}: {
  title: string;
  content: string | null;
  highlight?: "correct" | "wrong";
  maxHeight: number;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    if (useSoundStore.getState().enabled) playCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const borderClass =
    highlight === "correct"
      ? "border-bb-success/60"
      : highlight === "wrong"
      ? "border-bb-error/60"
      : "border-bb-border/45";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong">
        {title}
      </span>

      <div className={cn("relative group border-2 bg-bb-bg/50", borderClass)}>
        <div className="overflow-y-auto p-3" style={{ maxHeight }}>
          {content ? (
            <pre
              className={cn(
                "text-xs whitespace-pre-wrap leading-relaxed",
                mono ? "font-mono" : "font-sans",
                highlight === "correct" && "text-bb-success",
                highlight === "wrong" && "text-bb-error",
                !highlight && "text-bb-ink"
              )}
            >
              {content}
            </pre>
          ) : (
            <span className="text-xs text-bb-muted italic">—</span>
          )}
        </div>

        {content && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-3 flex items-center gap-1 px-1.5 py-1 border-2 border-bb-border/40 bg-bb-bg/70 text-bb-muted hover:text-bb-accent hover:border-bb-accent opacity-0 group-hover:opacity-100 transition-all"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
        )}
      </div>
    </div>
  );
}
