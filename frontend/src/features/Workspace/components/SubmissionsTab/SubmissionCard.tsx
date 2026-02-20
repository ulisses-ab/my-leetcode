import type { Problem } from "@/types/Problem";
import type { Submission } from "@/types/Submission";
import { format } from "timeago.js";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, Code2 } from "lucide-react";
import { Loader2 } from "lucide-react";

function statusConfig(status: Submission["status"]) {
  switch (status) {
    case "ACCEPTED":
      return {
        label: "Accepted",
        icon: CheckCircle2,
        className: "bg-green-500/10 text-green-600 border-green-500/20",
      };
    case "REJECTED":
      return {
        label: "Wrong answer",
        className: "bg-muted text-muted-foreground",
      };
    case "PENDING":
      return {
        label: <div className="flex">Pending<Loader2 className="ml-2 w-4 h-4 animate-spin"/></div>,
        className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      };
    default:
      return {
        label: "Failed",
        className: "bg-gray-500/10 text-red-600 border-red-500/20",
      };
  }
}

export type SubmissionCardProps = 
  React.ComponentProps<typeof Card> & {
    submission: Submission;
    problem: Problem;
  };

export function SubmissionCard({
  submission,
  problem,
  ...childProps
}: SubmissionCardProps) {
  const language = problem.setups.find(
    setup => setup.id === submission.setupId
  )?.language;

  const status = statusConfig(submission.status);

  return (
    <Card {...childProps} className="flex m-4 cursor-pointer flex-col items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-muted/50">
      <div className="flex w-full justify-between">
        <div className="flex items-start gap-2">
          <Badge
            variant="default"
            className={status.className}
          >
            {status.label}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {format(submission.submittedAt)}
          </div>
        </div>


      </div> 

      <div className="flex w-full justify-between"> 
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        </div>
        
        { submission.status === "PENDING" ? <div></div> : <span
          className="text-sm text-blue-400 hover:text-blue-500"
        >View submission →</span>}
      </div>
      
    </Card>
  );
}
