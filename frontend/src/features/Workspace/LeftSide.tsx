import { ProblemDisplayer } from "./components/ProblemDisplayer/ProblemDisplayer"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useWorkspaceStore } from "./store"
import { SubmissionsTab } from "./components/SubmissionsTab/SubmissionsTab";
import { LeaderboardTab } from "./components/LeaderboardTab/LeaderboardTab";
import { ResourcesTab } from "./components/ResourcesTab/ResourcesTab";
import { useResources } from "@/api/hooks/resources";
import { useEffect } from "react";
import { useSounds } from "@/hooks/useSounds";

const TAB_CLASS = "px-3 h-9 font-sans text-xs uppercase tracking-wide border-b-2 border-transparent text-bb-muted-strong hover:text-bb-ink data-[state=active]:border-bb-accent data-[state=active]:text-bb-accent data-[state=active]:bg-transparent";

export function LeftSide() {
  const problem = useWorkspaceStore((state) => state.problem);
  const leftTab = useWorkspaceStore((state) => state.leftTab);
  const setLeftTab = useWorkspaceStore((state) => state.setLeftTab);
  const sounds = useSounds();

  const { data: resources } = useResources(problem?.id);
  const hasResources = !!resources && resources.length > 0;

  useEffect(() => {
    if (leftTab === "resources" && resources !== undefined && !hasResources) {
      setLeftTab("statement");
    }
  }, [hasResources, resources, leftTab, setLeftTab]);

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={leftTab}
        onValueChange={(value) => { sounds.tab(); setLeftTab(value); }}
        className="flex flex-col h-full"
      >
        <div className="border-b-2 border-bb-border/40 bg-bb-bg/40 shrink-0 px-2">
          <TabsList className="bg-transparent gap-0 h-9 p-0">
            <TabsTrigger value="statement" className={TAB_CLASS}>
              Statement
            </TabsTrigger>
            {hasResources && (
              <TabsTrigger value="resources" className={TAB_CLASS}>
                Resources
              </TabsTrigger>
            )}
            <TabsTrigger value="submissions" className={TAB_CLASS}>
              Submissions
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className={TAB_CLASS}>
              Leaderboard
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0">
          <TabsContent className="mt-0 h-full" value="statement" forceMount>
            <ProblemDisplayer problem={problem ?? undefined} />
          </TabsContent>

          {hasResources && (
            <TabsContent className="mt-0 h-full overflow-y-auto" value="resources" forceMount>
              <ResourcesTab />
            </TabsContent>
          )}

          <TabsContent className="mt-0 h-full overflow-y-auto" value="submissions" forceMount>
            <SubmissionsTab />
          </TabsContent>

          <TabsContent className="mt-0 h-full overflow-y-auto" value="leaderboard" forceMount>
            <LeaderboardTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
