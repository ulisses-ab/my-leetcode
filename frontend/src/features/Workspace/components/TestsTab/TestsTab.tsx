import { useTests } from "@/api/hooks/problems";
import { useWorkspaceStore } from "../../store";

import {
  Accordion,
} from "@/components/ui/accordion";
import { TestItem } from "./TestItem";

export function TestsTab() {
  const submissionResults = useWorkspaceStore((state) => state.submissionResults);
  const problem = useWorkspaceStore((state) => state.problem);
  const setupId = useWorkspaceStore((state) => state.setup?.id);
  const { data: tests, isLoading } = useTests(problem?.id!, setupId!);

  console.log(problem?.id, setupId);


  if (isLoading) return <div>Loading testcases...</div>  
  if (!tests || !tests.testcases.length) return <div>No tests available</div>;

  return (<>    
    <Accordion type="multiple" className="m-4 space-y-3">
      {tests.testcases.map((testcase: any, index: any) => (
        <TestItem testcase={testcase} index={index} results={submissionResults?.testcases?.[index]} />
      ))}
    </Accordion>
  </>);
}
