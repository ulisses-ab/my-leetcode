import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Code2, 
  Hash 
} from "lucide-react";
import { useSubmissionWithResults } from "@/api/hooks/submissions";
import { useWorkspaceStore } from "@/features/Workspace/store";
import { useTests } from "@/api/hooks/problems";
import { format } from "date-fns";

export type SubmissionDetailsProps = {
  id: string;
  onClose: () => void;
};

export function SubmissionDetails({ id, onClose }: SubmissionDetailsProps) {
  const { data, isLoading } = useSubmissionWithResults(id);
  const setSubmissionResults = useWorkspaceStore(state => state.setSubmissionResults);
  const problem = useWorkspaceStore((state) => state.problem);
  const setupId = useWorkspaceStore((state) => state.setup?.id);
  const setup = useWorkspaceStore((state) => state.setup);
  const { data: tests } = useTests(problem?.id!, setupId!);

  // Sync results to store safely
  useEffect(() => {
    if (data?.results) setSubmissionResults(data.results);
  }, [data?.results, setSubmissionResults]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const { submission, results } = data;

  const STATUS_THEMES = {
    ACCEPTED: { label: "Accepted", color: "text-green-500" },
    REJECTED: { label: "Wrong Answer", color: "text-red-500" },
    FAILED: { label: results?.errorType || "Error", color: "text-red-500" },
    PENDING: { label: "Pending", color: "text-blue-500" } 
  };

  const theme = STATUS_THEMES[submission.status as keyof typeof STATUS_THEMES] || STATUS_THEMES.PENDING;
  const totalTests = tests?.testcases?.length || 0;
  const passedTests = results?.testcases?.filter((t: any) => t.status === "ACCEPTED").length || 0;
  const passPercentage = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ChevronLeft size={16} />
          Back to Submissions
        </Button>
        <span className="text-xs font-mono text-muted-foreground">ID: {submission.id}</span>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
        <div className="space-y-2">
          <h1 className={`${theme.color} text-4xl font-bold tracking-tight`}>
            {theme.label}
          </h1>
          <p className="text-muted-foreground">
            Submitted on {format(new Date(submission.submittedAt), "MMM dd, yyyy 'at' hh:mm a")}
          </p>
        </div>

        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Testcases Passed</span>
            <span>{passedTests} / {totalTests}</span>
          </div>
          <Progress value={passPercentage} className="h-2" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard icon={<Clock size={16}/>} label="Runtime" value={results?.time_ms ? `${results.time_ms}ms` : "N/A"} />
        <StatCard icon={<Hash size={16}/>} label="Memory" value={results?.memory ? `${results.memory}KB` : "N/A"} />
      </div>

      {/* Error or Details View */}
      {submission.status === "FAILED" && (
        <div className="rounded-xl max-h-80 bg-red-950/30 whitespace-pre-wrap border text-red-400 border-red-500/10 p-4 font-mono text-sm leading-relaxed overflow-x-auto">
          {results?.error || "Unknown error occurred"}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="bg-card/50">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-2 bg-muted rounded-lg text-muted-foreground">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
          <p className="text-lg font-bold font-mono">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}