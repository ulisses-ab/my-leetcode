import { useProblemSubmissions } from "@/api/hooks/submissions";
import { useWorkspaceStore } from "../../store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubmissionCard } from "./SubmissionCard";
import { SubmissionDetails } from "./details/SubmissionDetails";

export function SubmissionsTab() {
  const problem = useWorkspaceStore(state => state.problem);
  const setup = useWorkspaceStore(state => state.setup);
  const { data: submissions, isLoading, error } = useProblemSubmissions(problem?.id!);
  const selectedSubmission = useWorkspaceStore(state => state.selectedSubmission);
  const setSelectedSubmission = useWorkspaceStore(state => state.setSelectedSubmission);

  if (!problem) return <p>No problem selected.</p>;
  if (isLoading) return <p>Loading submissions...</p>;
  if (error) return <p>Error loading submissions.</p>;
  if (!submissions || submissions.length === 0) return <p>No submissions yet.</p>;
  if (!setup) return <div>Select a setup</div>

  const filteredSubmissions = submissions.filter(submission => submission.setupId === setup.id);

  if (selectedSubmission) {
    return <SubmissionDetails id={selectedSubmission.id} onClose={() => setSelectedSubmission(null)}/>
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex items-center justify-between m-5">
        <div className="flex items-center gap-3">
          {setup.language + " "} 
          Submissions

        </div>

        <div className="text-sm text-zinc-400">
          {filteredSubmissions.length} total
        </div>
      </div>

      <ul>
        {filteredSubmissions.map((submission) => (
          <SubmissionCard
            onClick={() => setSelectedSubmission(submission)}
            key={submission.id}
            problem={problem}
            submission={submission}
          />
        ))}
      </ul>
    </ScrollArea>
  );
}
