import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useProblem } from "@/api/hooks/problems"
import { LeftSide } from "./LeftSide";
import { RightSide } from "./RightSide";
import { useNavbarStore } from "@/stores/useNavbarStore";
import { useEffect } from "react";
import { NavbarMenu } from "./components/NavbarMenu/NavbarMenu";
import { useWorkspaceStore } from "./store";

export function Workspace({ problemId }: { problemId: string }) {
  const { data: problem } = useProblem(problemId);
  const initialize = useWorkspaceStore((state) => state.initialize);
  const setNavbarCenter = useNavbarStore((state) => state.setNavbarCenter);

  useEffect(() => {
    initialize(problem ?? null);
  }, [problem])


  useEffect(() => {
    setNavbarCenter(
      <NavbarMenu />
    )
  }, [])

  return (
    <ResizablePanelGroup 
      direction="horizontal" 
      className="flex-1"
    >
      <ResizablePanel 
        className="min-w-40 m-2 mt-0 ml-2 mr-1 rounded-lg border-gray-700 border-1"
        defaultSize={33}
      >
        <LeftSide />
      </ResizablePanel>
      <ResizableHandle className="bg-transparent"/>
      <ResizablePanel 
        className="min-w-40 m-2 mt-0 mr-2 ml-1 rounded-lg border-gray-700 border-1"
      >
        <RightSide />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}