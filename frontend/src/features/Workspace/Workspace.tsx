import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useProblem } from "@/api/hooks/problems"
import { LeftSide } from "./LeftSide";
import { RightSide } from "./RightSide";
import { useNavbarStore } from "@/stores/useNavbarStore";
import { useEffect, useState } from "react";
import { NavbarMenu } from "./components/NavbarMenu/NavbarMenu";
import { SelectLanguage } from "./components/NavbarMenu/SelectLanguage";
import { SubmitButtons } from "./components/NavbarMenu/SubmitButtons";
import { useWorkspaceStore } from "./store";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/utils";

export function Workspace({ problemId }: { problemId: string }) {
  const { data: problem } = useProblem(problemId);
  const initialize = useWorkspaceStore((state) => state.initialize);
  const setNavbarCenter = useNavbarStore((state) => state.setNavbarCenter);
  const [mobileTab, setMobileTab] = useState<"problem" | "code">("problem");

  useSEO({ title: problem ? `${problem.title} — EliteCode` : "EliteCode" });

  useEffect(() => {
    initialize(problem ?? null);
  }, [problem]);

  useEffect(() => {
    setNavbarCenter(<NavbarMenu />);
  }, []);

  const panelClass = "min-w-40 border-2 border-bb-border/55 bg-bb-surface/40 overflow-hidden";

  return (
    <>
      {/* Mobile layout */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden">
        {/* Mobile sub-bar: language + submit */}
        <div className="flex shrink-0 items-center gap-2 px-2 py-1.5 border-b-2 border-bb-border/50 bg-bb-bg">
          <SelectLanguage />
          <div className="flex-1">
            <SubmitButtons />
          </div>
        </div>
        <div className="flex shrink-0 border-b-2 border-bb-border/50 bg-bb-bg">
          {(["problem", "code"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={cn(
                "flex-1 py-2.5 font-sans text-xs uppercase tracking-wide transition-colors border-b-2 -mb-0.5",
                mobileTab === tab
                  ? "border-bb-accent text-bb-accent"
                  : "border-transparent text-bb-muted-strong hover:text-bb-ink"
              )}
            >
              {tab === "problem" ? "Problem" : "Code"}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-hidden p-2">
          <div className={cn("h-full", panelClass, mobileTab === "problem" ? "block" : "hidden")}>
            <LeftSide />
          </div>
          <div className={cn("h-full", panelClass, mobileTab === "code" ? "block" : "hidden")}>
            <RightSide />
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel className={cn("m-2 mr-1", panelClass)} defaultSize={33}>
            <LeftSide />
          </ResizablePanel>
          <ResizableHandle className="bg-transparent w-1.5" />
          <ResizablePanel className={cn("m-2 ml-1", panelClass)}>
            <RightSide />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
