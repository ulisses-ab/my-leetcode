import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { EditorContainer } from "./components/EditorContainer/EditorContainer";
import { useWorkspaceStore } from "./store";
import { TestsTab } from "./components/TestsTab/TestsTab";
import { UploadDownload } from "@/features/Editor/components/FileExplorer/TopMenu/UploadDownload";
import { FileExplorer } from "@/features/Editor/components/FileExplorer/FileExplorer";
import { SelectLanguage } from "./components/NavbarMenu/SelectLanguage";
import { useSounds } from "@/hooks/useSounds";
import { Empty } from "@/components/ui/empty";
import { EmptyTemplate } from "./components/EditorContainer/EmptyTemplate";

const TAB_CLASS = "px-3 h-9 font-sans text-xs uppercase tracking-wide border-b-2 border-transparent text-bb-muted-strong hover:text-bb-ink data-[state=active]:border-bb-accent data-[state=active]:text-bb-accent data-[state=active]:bg-transparent";

export function RightSide() {
  const rightTab = useWorkspaceStore(state => state.rightTab);
  const setRightTab = useWorkspaceStore(state => state.setRightTab);
  const setupId = useWorkspaceStore(state => state.setup?.id);
  const sounds = useSounds();

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={rightTab}
        className="flex flex-col h-full"
        onValueChange={(val) => { sounds.tab(); setRightTab(val); }}
      >
        <div className="border-b-2 border-bb-border/40 bg-bb-bg/40 shrink-0 px-2 flex items-center justify-between">
          <TabsList className="bg-transparent gap-0 h-9 p-0">
            <TabsTrigger value="editor" className={TAB_CLASS}>
              Editor
            </TabsTrigger>
            <TabsTrigger value="files" className={`${TAB_CLASS} md:hidden`}>
              Files
            </TabsTrigger>
            <TabsTrigger value="tests" className={TAB_CLASS}>
              Tests
            </TabsTrigger>
          </TabsList>
          {rightTab === "editor" && <UploadDownload />}
        </div>

        <div className="flex-1 min-h-0">
          <TabsContent className="mt-0 h-full" value="editor" forceMount>
            <EditorContainer />
          </TabsContent>
          <TabsContent className="mt-0 h-full md:hidden" value="files">
            {setupId ? (
              <FileExplorer />
            ) : (
              <EmptyTemplate />
            )}
          </TabsContent>
          <TabsContent className="h-full overflow-y-auto" value="tests" forceMount>
            <TestsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
