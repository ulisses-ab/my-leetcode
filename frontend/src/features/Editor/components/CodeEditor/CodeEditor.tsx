import { Editor, useMonaco } from "@monaco-editor/react";
import { useEditorStore } from "../../store/store";
import { FileBreadcrumb } from "./FileBreadcrumb";

function handleMount(editor: any, monaco: any) {
  //monaco.languages.registerCompletionItemProvider("cpp");

  monaco.editor.defineTheme("my-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#121318ff",
      "editorLineNumber.foreground": "#858585",
      "editorCursor.foreground": "#ffffff",
    },
  });
  monaco.editor.setTheme("my-dark");
}

export function CodeEditor({ language = "cpp" }: { 
  language?: string 
}) {
  const nodes = useEditorStore((state) => state.nodes);
  const activeFileId = useEditorStore((state) => state.activeFileId);
  const updateFileContent = useEditorStore((state) => state.updateFileContent);

  if(!activeFileId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="">
          Select file...
        </div>
      </div>
    )
  }

  return (
    <>
      <FileBreadcrumb />
      <Editor
        defaultLanguage={language}
        value={nodes[activeFileId].content ?? ""}
        onChange={(v) => updateFileContent(activeFileId, v ?? "")}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 2,
          scrollBeyondLastLine: false,
        }}
      />
    </>
  );
}
