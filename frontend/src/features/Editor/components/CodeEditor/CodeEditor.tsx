import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { useEditorStore } from "../../store/store";
import { useThemeStore } from "@/stores/useThemeStore";
import { FileBreadcrumb } from "./FileBreadcrumb";
import { languageFromFilename } from "../../utils/languageFromFilename";

/**
 * Monaco only accepts hex strings, so we read CSS custom properties from
 * :root at mount time and convert them. The palette lives in
 * frontend/src/styles/globals.css — this file does NOT define colors.
 */
function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function rgbTriplet(name: string): [number, number, number] {
  // e.g., "21, 128, 61" → [21, 128, 61]
  return readToken(name).split(",").map((s) => Number(s.trim())) as [number, number, number];
}

function hex(name: string): string {
  // Token might be a hex string already, or a `var(...)` chain CSS resolved.
  const v = readToken(name);
  return v.startsWith("#") ? v : v;
}

function rgba(rgbVarName: string, alpha: number): string {
  const [r, g, b] = rgbTriplet(rgbVarName);
  // Monaco accepts 8-digit hex
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${a}`;
}

function buildTheme() {
  // Monaco's syntax `rules` want hex without the leading `#`.
  const stripHash = (h: string) => h.replace(/^#/, "");
  return {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: stripHash(hex("--bb-muted")), fontStyle: "italic" },
    ],
    colors: {
      "editor.background":               hex("--bb-surface"),
      "editor.foreground":               hex("--bb-ink"),
      "editor.lineHighlightBackground":  rgba("--bb-accent-rgb", 0.07),
      "editor.selectionBackground":      rgba("--bb-accent-rgb", 0.25),
      "editorLineNumber.foreground":     rgba("--bb-accent-rgb", 0.35),
      "editorLineNumber.activeForeground": hex("--bb-muted-strong"),
      "editorCursor.foreground":         hex("--bb-accent-soft"),
      "editorIndentGuide.background1":   hex("--bb-surface-2"),
      "editorBracketMatch.background":   rgba("--bb-accent-rgb", 0.13),
      "editorBracketMatch.border":       hex("--bb-muted-strong"),
      "scrollbarSlider.background":      rgba("--bb-accent-rgb", 0.13),
      "scrollbarSlider.hoverBackground": rgba("--bb-accent-rgb", 0.25),
      "scrollbarSlider.activeBackground": rgba("--bb-accent-rgb", 0.4),
    },
  };
}

function handleMount(_editor: any, monaco: any) {
  monaco.editor.defineTheme("lc-dark", buildTheme());
  monaco.editor.setTheme("lc-dark");
}

export function CodeEditor() {
  const nodes = useEditorStore((state) => state.nodes);
  const activeFileId = useEditorStore((state) => state.activeFileId);
  const updateFileContent = useEditorStore((state) => state.updateFileContent);

  // Re-build the Monaco theme whenever the app theme changes — Monaco only
  // reads CSS custom properties at mount, so we need to re-define and re-apply
  // it on every palette swap.
  const monaco = useMonaco();
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    if (!monaco) return;
    monaco.editor.defineTheme("lc-dark", buildTheme());
    monaco.editor.setTheme("lc-dark");
  }, [monaco, theme]);

  if (!activeFileId) {
    return (
      <div className="flex h-full items-center justify-center bg-bb-surface">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bb-muted-strong">
          Select a file to edit
        </p>
      </div>
    );
  }

  const activeFile = nodes[activeFileId];
  const language = languageFromFilename(activeFile.name);

  return (
    <>
      <FileBreadcrumb />
      <Editor
        key={activeFileId}
        language={language}
        value={activeFile.content ?? ""}
        onChange={(v) => updateFileContent(activeFileId, v ?? "")}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
          tabSize: 2,
          scrollBeyondLastLine: true,
        }}
      />
    </>
  );
}
