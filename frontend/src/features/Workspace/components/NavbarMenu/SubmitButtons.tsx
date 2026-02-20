import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa6";
import { MdCloudUpload } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";
import { useWorkspaceStore } from "../../store";
import { usePostSubmission, useProblemLatestSubmission } from "@/api/hooks/submissions";
import { Loader2 } from "lucide-react";

export function SubmitButtons() {
  const editorRef = useWorkspaceStore(state => state.editor);
  const problem = useWorkspaceStore(state => state.problem);
  const setup = useWorkspaceStore((state) => state.setup);
  const onSubmissionFinished = useWorkspaceStore(state => state.onSubmissionFinished) 

  const { data: latestSubmission, isSuccess: latestSubmissionFetched } = useProblemLatestSubmission(problem?.id!);
  const { mutateAsync: postSubmission, isPending: isSubmitting } = usePostSubmission(problem?.id!);

  const [ isSubmissionEvaluating, setIsSubmissionEvaluating ] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!editorRef || !problem || !setup) {
      return;
    }

    try {
      const zipFile = await editorRef.getCurrentZip();
      const submission = await postSubmission({
        problemId: problem.id,
        setupId: setup.id,
        file: zipFile,
        temporary: false,
      });
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  }, [problem, setup, editorRef]);

  useEffect(() => {
    if(!latestSubmissionFetched) return;

    if(latestSubmission?.status === "PENDING") {
      setIsSubmissionEvaluating(true);
      return;
    }

    setIsSubmissionEvaluating(false);
 
    if(isSubmissionEvaluating) {
      onSubmissionFinished(latestSubmission!);
    }
  }, [latestSubmission, latestSubmissionFetched]);

  const isPending =
    !latestSubmissionFetched || latestSubmission?.status === "PENDING" || isSubmitting;

  if(isPending) {
    return (
      <Button 
        onClick={() => {}} 
        className="flex-1 dark:bg-gray-500/15 cursor-default dark:border-gray-500 text-gray-300 hover:text-gray-300 hover:border-gray-500 transition-none" 
        variant="outline"
      >
        Pending <Loader2 className="animate-spin"/>
      </Button>
    )
  }

  return (
    <>
      {/*<Button 
        onClick={() => {}} 
        className="flex-3 dark:bg-gray-500/15 dark:border-gray-500 text-gray-300 hover:text-gray-300 hover:border-gray-500 transition-none" 
        variant="outline"
      >
        Run
        <FaPlay />
      </Button>*/}
      <Button 
        onClick={handleSubmit} 
        className="flex-4 dark:bg-green-500/15 dark:border-green-700 text-green-500 hover:text-green-300 hover:border-green-500 transition-none" 
        variant="outline"
      >
        Submit
        <MdCloudUpload />
      </Button>
    </>
  )
}