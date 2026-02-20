import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Problem } from "@/types/Problem";
import { useWorkspaceStore } from "../../store";
import { useTests } from "@/api/hooks/problems";

export function SelectLanguage() {
  const problem = useWorkspaceStore((state) => state.problem);
  const setupId = useWorkspaceStore((state) => state.setup?.id);
  const setSetup = useWorkspaceStore((state) => state.setSetup);

  let selectItems = null;

  if(problem) {
    selectItems = problem.setups.map((setup) => 
      <SelectItem value={setup.id}>{setup.language}</SelectItem>
    )
  }

  return (
    <Select value={setupId} onValueChange={setSetup}>
      <SelectTrigger className="w-30">
        <SelectValue placeholder="Template" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="text-gray-500" value={"."}>Template</SelectItem>
        {selectItems}
      </SelectContent>
    </Select>
  )
}