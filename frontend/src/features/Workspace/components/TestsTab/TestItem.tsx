import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { stringifyObject } from "./stringifyObject";
import { cn } from "@/lib/utils";

function getStatusAttributes(status: string) {
  switch (status) {
    case "ACCEPTED":
      return {
        container: "border-green-500/30 bg-green-500/5",
        accent: "bg-green-500",
        badge: "bg-green-500 hover:bg-green-500",
        label: "Accepted",
      };
    case "REJECTED":
      return {
        container: "border-red-500/30 bg-red-500/5",
        accent: "bg-red-500",
        badge: "bg-red-500 hover:bg-red-500",
        label: "Wrong Answer",
      };
    case "FAILED":
      return {
        container: "border-red-500/30 bg-red-500/5",
        accent: "bg-red-500",
        badge: "bg-red-500 hover:bg-red-500",
        label: "Error",
      };
    default:
      return {
        container: "",
        accent: "bg-muted",
        badge: "",
        label: "",
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
  function display(obj: any) {
    return typeof obj === "string" ? obj : stringifyObject(obj);
  }

  const status = getStatusAttributes(results?.status);

  return (
    <AccordionItem
      value={`testcase-${index}`}
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all duration-200",
        "hover:shadow-md hover:border-primary/40",
        status.container
      )}
    >
      {/* Left accent bar */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 transition-colors",
          status.accent
        )}
      />

      <AccordionTrigger className="px-5 py-4 hover:no-underline">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-semibold tracking-wide">
            Test Case {index + 1}
          </span>

          {results?.status && (
            <Badge className={cn("text-xs font-medium mr-4", status.badge)}>
              {status.label}
            </Badge>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5 pb-5 pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Input */}
          <CodeBlock
            title="Input"
            content={display(testcase.input)}
          />

          {/* Expected */}
          <CodeBlock
            title="Expected Output"
            content={display(testcase.output)}
          />

          {/* Actual */}
          <CodeBlock
            title="Actual Output"
            content={
              results?.actual_output
                ? display(results.actual_output)
                : null
            }
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function CodeBlock({
  title,
  content,
}: {
  title: string;
  content: any;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(String(content));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>

      <div className="relative group">
        <div className="rounded-md border bg-muted/40">
          <ScrollArea className="h-50 px-3">
            <pre className="h-2.5"></pre>
            {content ? (
              <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed">
                {content}
              </pre>
            ) : (
              <div className="text-xs italic text-muted-foreground">
                No output
              </div>
            )}
          </ScrollArea>
        </div>

        {content && (
          <button
            onClick={handleCopy}
            className="
              absolute top-2 right-2
              text-xs px-2 py-1
              rounded-md border bg-background/10 backdrop-blur
              opacity-0 group-hover:opacity-100
              transition-opacity
              hover:bg-card
            "
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}