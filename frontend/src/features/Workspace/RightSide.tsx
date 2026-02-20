import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { EditorContainer } from "./components/EditorContainer/EditorContainer";
import { useWorkspaceStore } from "./store";
import { forwardRef } from "react";
import type { EditorRef } from "@/features/Editor/Editor";
import { TestsTab } from "./components/TestsTab/TestsTab";

export function RightSide() {
  const rightTab = useWorkspaceStore(state => state.rightTab);
  const setRightTab = useWorkspaceStore(state => state.setRightTab);

  return (
    <div className="bg-card h-full">
      <Tabs 
        value={rightTab} 
        className="h-full" 
        onValueChange={(val) => setRightTab(val)}
      >
        <div className="bg-muted">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>
        </div>
        <div className="overflow-auto h-full">
          <TabsContent className="mt-0 h-full" value="editor" forceMount>
            <EditorContainer />
          </TabsContent>
          <TabsContent value="tests" forceMount>
            <TestsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
};