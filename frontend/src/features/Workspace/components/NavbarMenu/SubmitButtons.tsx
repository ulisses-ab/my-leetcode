import { MdCloudUpload } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";
import { useWorkspaceStore } from "../../store";
import { usePostSubmission, useProblemLatestSubmission } from "@/api/hooks/submissions";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { SignInDialog } from "@/features/auth/SignInDialog";
import { useSounds } from "@/hooks/useSounds";

const BASE = "w-full h-9 inline-flex items-center justify-center gap-2 border-2 font-sans text-xs uppercase tracking-wide transition-colors";

export function SubmitButtons() {
  const editorRef = useWorkspaceStore(state => state.editor);
  const problem = useWorkspaceStore(state => state.problem);
  const setup = useWorkspaceStore((state) => state.setup);
  const onSubmissionFinished = useWorkspaceStore(state => state.onSubmissionFinished);
  const user = useAuthStore(state => state.user);

  const isAuthenticated = !!user;

  const { data: latestSubmission, isSuccess: latestSubmissionFetched } = useProblemLatestSubmission(
    isAuthenticated ? (problem?.id ?? null) : null
  );
  const { mutateAsync: postSubmission, isPending: isSubmitting } = usePostSubmission(problem?.id!);
  const sounds = useSounds();

  const [isSubmissionEvaluating, setIsSubmissionEvaluating] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!editorRef || !problem || !setup) return;

    sounds.submit();
    setJustSubmitted(true);
    try {
      const zipFile = await editorRef.getCurrentZip();
      await postSubmission({
        problemId: problem.id,
        setupId: setup.id,
        file: zipFile,
        temporary: false,
      });
    } catch (error) {
      console.error("Failed to submit:", error);
      setJustSubmitted(false);
    }
  }, [problem, setup, editorRef]);

  useEffect(() => {
    if (!latestSubmissionFetched) return;

    if (latestSubmission?.status === "PENDING") {
      setJustSubmitted(false);
      setIsSubmissionEvaluating(true);
      return;
    }

    setIsSubmissionEvaluating(false);

    if (isSubmissionEvaluating) {
      onSubmissionFinished(latestSubmission!);
      if (latestSubmission?.status === "ACCEPTED") {
        sounds.success();
      } else {
        sounds.error();
      }
    }
  }, [latestSubmission, latestSubmissionFetched]);

  if (!isAuthenticated) {
    return (
      <SignInDialog>
        <button
          type="button"
          onClick={() => { if (useSoundStore.getState().enabled) playOpen(); }}
          className={`${BASE} border-bb-success/60 bg-bb-success/15 text-bb-success hover:border-bb-success hover:bg-bb-success/25`}
        >
          <span className="hidden sm:inline">Submit</span>
          <MdCloudUpload size={14} />
        </button>
      </SignInDialog>
    );
  }

  const isPending =
    !latestSubmissionFetched || latestSubmission?.status === "PENDING" || isSubmitting || justSubmitted;

  if (isPending) {
    return (
      <button
        type="button"
        disabled
        className={`${BASE} border-bb-border/50 bg-bb-surface text-bb-muted-strong cursor-default`}
      >
        Pending <Loader2 size={14} className="animate-spin" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSubmit}
      className={`${BASE} border-bb-success/60 bg-bb-success/15 text-bb-success hover:border-bb-success hover:bg-bb-success/25`}
    >
      Submit
      <MdCloudUpload size={14} />
    </button>
  );
}
