import { FaDownload, FaUpload } from "react-icons/fa";
import { useEditorStore } from "../../../store/store";
import { useRef, useState } from "react";
import { zipToFileNodes, fileNodesToZip } from "../../../utils/zip";
import { downloadFile } from "../../../utils/download";
import { useWorkspaceStore } from "@/features/Workspace/store";
import { useTemplate } from "@/api/hooks/problems";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { RotateCcw } from "lucide-react";
import { playClick, playOpen, playClose, playDelete } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

const BTN = "flex items-center gap-1.5 px-2 h-7 border-2 border-bb-border/55 bg-bb-surface/72 font-mono text-[10px] uppercase tracking-[0.12em] text-bb-muted-strong hover:text-bb-accent hover:border-bb-accent transition-colors";

export function UploadDownload() {
  const nodes = useEditorStore((state) => state.nodes);
  const rootId = useEditorStore((state) => state.rootId);
  const setNodes = useEditorStore((state) => state.setNodes);
  const resetStore = useEditorStore((state) => state.reset);

  const problemId = useWorkspaceStore((state) => state.problem?.id);
  const setupId = useWorkspaceStore((state) => state.setup?.id);
  const { data: template } = useTemplate(problemId!, setupId!);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const { nodes, rootId } = await zipToFileNodes(file);
      setNodes(nodes, rootId);
    }
  };

  const handleDownload = async () => {
    downloadFile(await fileNodesToZip(nodes, rootId!), "solution.zip");
  };

  const handleReset = async () => {
    if (template) {
      const { nodes, rootId } = await zipToFileNodes(template);
      resetStore(nodes, rootId);
    }
    setResetOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <button className={BTN} onClick={() => { if (useSoundStore.getState().enabled) playOpen(); setResetOpen(true); }} title="Reset to template">
          <RotateCcw size={11} aria-hidden="true" />
          Reset
        </button>

        <span className="hidden sm:contents">
          <button className={BTN} onClick={() => { if (useSoundStore.getState().enabled) playClick(); handleDownload(); }} title="Export as ZIP">
            <FaDownload size={11} aria-hidden="true" />
            Export
          </button>
        </span>

        <input
          type="file"
          accept=".zip"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <span className="hidden sm:contents">
          <button className={BTN} onClick={() => { if (useSoundStore.getState().enabled) playClick(); handleUploadClick(); }} title="Import ZIP">
            <FaUpload size={11} aria-hidden="true" />
            Import
          </button>
        </span>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-sm sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reset to template?</DialogTitle>
            <DialogDescription className="font-sans text-xs text-bb-muted-strong">
              This will discard all your changes and restore the original template files for this setup. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
            <DialogClose asChild>
              <button
                onClick={() => { if (useSoundStore.getState().enabled) playClose(); }}
                className="flex-1 px-3 h-9 border-2 border-bb-border/55 bg-bb-surface/72 font-sans text-xs uppercase tracking-wide text-bb-muted-strong hover:text-bb-ink hover:border-bb-border transition-colors"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => { if (useSoundStore.getState().enabled) playDelete(); handleReset(); }}
              className="flex-1 px-3 h-9 border-2 border-bb-warning/60 bg-bb-warning/15 font-sans text-xs uppercase tracking-wide text-bb-warning hover:bg-bb-warning/25 transition-colors"
            >
              Reset
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
