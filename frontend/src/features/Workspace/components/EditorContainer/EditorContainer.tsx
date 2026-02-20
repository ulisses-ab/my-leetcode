import { Editor, type EditorRef } from "@/features/Editor/Editor";
import { EmptyTemplate } from "./EmptyTemplate";
import { useEffect, useRef, useCallback } from "react";
import { useWorkspaceStore } from "../../store";
import { useTemplate } from "@/api/hooks/problems";
import { Loader2 } from "lucide-react";

export function EditorContainer() {
  const editorRef = useRef<EditorRef | null>(null);
  const setEditor = useWorkspaceStore(state => state.setEditor);
   
  const problemId = useWorkspaceStore(state => state.problem?.id);
  const setupId = useWorkspaceStore(state => state.setup?.id);
  const { data: template, isSuccess } = useTemplate(problemId!, setupId!);

  const setEditorRef = useCallback((node: EditorRef | null) => {
    editorRef.current = node;
    setEditor(node);
  }, [setEditor]);

  useEffect(() => {
    setEditor(editorRef.current);
    return () => setEditor(null);
  }, [setupId, setEditor]);

  if (!setupId) {
    return <EmptyTemplate/>
  }

  if (!template || !isSuccess) {
    return <div className="flex w-full h-full items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10"/>
    </div>
  }

  return (
    <Editor ref={setEditorRef} persistanceKey={setupId} zip={template}></Editor>
  )
}