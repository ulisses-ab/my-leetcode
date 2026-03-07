import { ProblemDisplayer } from "./components/ProblemDisplayer/ProblemDisplayer"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useWorkspaceStore } from "./store"
import { SubmissionsTab } from "./components/SubmissionsTab/SubmissionsTab";

export function LeftSide() {
  const problem = useWorkspaceStore((state) => state.problem);
  const leftTab = useWorkspaceStore((state) => state.leftTab);
  const setLeftTab = useWorkspaceStore((state) => state.setLeftTab);
  const setup = useWorkspaceStore((state) => state.setup);  

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={leftTab}
        onValueChange={(value) => setLeftTab(value)}
        className="flex flex-col h-full"
      >
        <div className="bg-muted shrink-0">
          <TabsList>
            <TabsTrigger value="statement">Statement</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent className="mt-0 h-full" value="statement" forceMount>
            {import.meta.env.VITE_ENVIRONMENT === "development" && (
              <div className="text-sm text-muted-foreground px-2">
                Problem ID: {problem?.id}
                <br />
                Setup ID: {setup?.id || "None"}
              </div>
            )}
            <ProblemDisplayer problem={problem ?? undefined} />
          </TabsContent>

          <TabsContent className="mt-0 h-full" value="submissions" forceMount>
            <SubmissionsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}