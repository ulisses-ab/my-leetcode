import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useRef } from "react";
import { useEditorStore } from "../../../../store/store"
import type { NodeApi } from "react-arborist";
import type { FileNode } from "../../../../store/types";
import { playClick, playDelete } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

interface RowContextMenuProps {
  node: NodeApi<FileNode>;
  children: React.ReactNode;
}

export function NodeContextMenu({ node, children }: RowContextMenuProps) {
  const nodes = useEditorStore((state) => state.nodes);
  const deleteNode = useEditorStore((state) => state.deleteNode);
  const setRenamingNode = useEditorStore((state) => state.setRenamingNode);
  const createNode = useEditorStore((state) => state.createNode);
  const renamingNodeId = useEditorStore((state) => state.renamingNodeId);

  const isFolder = node.isInternal;
  // Files create siblings; folders create children
  const newItemParentId = isFolder
    ? node.data.id
    : (nodes[node.data.id]?.parentId ?? null);

  const creatingNewRef = useRef(false);
  const renamingRef = useRef(false);

  const handleNewFile = () => {
    if (renamingNodeId) return;
    if (isFolder) node.open();
    if (newItemParentId) {
      creatingNewRef.current = true;
      createNode(newItemParentId, "", "file");
    }
  };

  const handleNewFolder = () => {
    if (renamingNodeId) return;
    if (isFolder) node.open();
    if (newItemParentId) {
      creatingNewRef.current = true;
      createNode(newItemParentId, "", "folder");
    }
  };

  const setActiveFile = useEditorStore((state) => state.setActiveFile);

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    renamingRef.current = true;
    setRenamingNode(node.data.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className="w-48 [&>*]:cursor-pointer"
        onCloseAutoFocus={(e) => {
          if (creatingNewRef.current) {
            creatingNewRef.current = false;
            e.preventDefault();
          }
          if (renamingRef.current) {
            renamingRef.current = false;
            e.preventDefault();
          }
        }}
      >
        {!isFolder && (
          <>
            <ContextMenuItem onClick={() => { if (useSoundStore.getState().enabled) playClick(); setActiveFile(node.data.id); }}>Open</ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem onClick={() => { if (useSoundStore.getState().enabled) playClick(); handleNewFile(); }}>New file…</ContextMenuItem>
        <ContextMenuItem onClick={() => { if (useSoundStore.getState().enabled) playClick(); handleNewFolder(); }}>New folder…</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={(e) => { if (useSoundStore.getState().enabled) playClick(); handleRename(e); }}>Rename</ContextMenuItem>
        <ContextMenuItem
          onClick={() => { if (useSoundStore.getState().enabled) playDelete(); deleteNode(node.data.id); }}
          className="text-bb-error focus:text-bb-error"
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
