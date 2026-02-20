import { Card, CardTitle } from "@/components/ui/card";
import type { Problem } from "@/types/Problem";
import ReactMarkdown from "react-markdown";

export function ProblemDisplayer({ problem }: { problem?: Problem }) {
  return (
    <div className="markdown-body bg-card flex-1 p-6">
      <h1>{problem?.title}</h1>
      <ReactMarkdown >{problem?.statement}</ReactMarkdown>
    </div>
  )
}