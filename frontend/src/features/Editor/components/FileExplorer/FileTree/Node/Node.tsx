import { NodeApi } from "react-arborist";
import type { FileNode } from "@/features/Editor/store/types";
import { NodeContextMenu } from "./NodeContextMenu";
import { useEditorStore } from "../../../../store/store";
import { NodeContent } from "./NodeContent";
import { MoreVertical } from "lucide-react";
import { useRef } from "react";
import { flushSync } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { playSelect, playTab, playClick, playDelete } from "@/lib/sounds";
import { useSoundStore } from "@/stores/useSoundStore";

export function Node({ node, style, dragHandle }: {
  node: NodeApi<FileNode>;
  style: any,
  dragHandle?: any,
}) {
  const setActiveFile = useEditorStore((state) => state.setActiveFile);
  const setSelectedNode = useEditorStore((state) => state.setSelectedNode);
  const isSelected = useEditorStore((state) => state.selectedNodeId === node.id);
  const isActiveFile = useEditorStore((state) => !node.isInternal && state.activeFileId === node.id);
  const setRenamingNode = useEditorStore((state) => state.setRenamingNode);
  const deleteNode = useEditorStore((state) => state.deleteNode);
  const renamingRef = useRef(false);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    setSelectedNode(node.data.id);

    if (node.isInternal) {
      node.toggle();
      if (useSoundStore.getState().enabled) playTab();
    } else {
      setActiveFile(node.data.id);
      if (useSoundStore.getState().enabled) playSelect();
    }
  };

  const onRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedNode(node.data.id);
  };

  return (
    <NodeContextMenu node={node} >
      <div
        style={{
          ...style,
          paddingLeft: style.paddingLeft*0.8 + 6,
        }}
        className={`flex flex-1 items-center gap-1 h-6 text-sm cursor-pointer transition-colors outline-none border-l-2
          ${isActiveFile ? "border-l-bb-accent-soft md:border-l-transparent" : "border-l-transparent"}
          ${isSelected
            ? "bg-bb-accent/20 text-bb-accent"
            : isActiveFile
              ? "bg-bb-accent/20 text-bb-accent md:bg-transparent md:text-bb-muted-strong md:hover:bg-bb-accent/5 md:hover:text-bb-ink"
              : "hover:bg-bb-accent/5 text-bb-muted-strong hover:text-bb-ink"}`}
        onClick={onClick}
        onContextMenu={onRightClick}
        ref={dragHandle}
      >
        <NodeContent node={node} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="sm:hidden ml-auto shrink-0 p-0.5 text-bb-muted hover:text-bb-accent outline-none"
              onClick={(e) => { e.stopPropagation(); setSelectedNode(node.data.id); }}
            >
              <MoreVertical size={13} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-36 [&>*]:cursor-pointer"
            onCloseAutoFocus={(e) => {
              if (renamingRef.current) {
                renamingRef.current = false;
                e.preventDefault();
              }
            }}
          >
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              if (useSoundStore.getState().enabled) playClick();
              renamingRef.current = true;
              flushSync(() => setRenamingNode(node.data.id));
              const input = document.querySelector<HTMLInputElement>(`[data-rename-input="${node.data.id}"]`);
              input?.focus();
              input?.select();
            }}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); if (useSoundStore.getState().enabled) playDelete(); deleteNode(node.data.id); }}
              className="text-bb-error focus:text-bb-error"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </NodeContextMenu>
  )
}