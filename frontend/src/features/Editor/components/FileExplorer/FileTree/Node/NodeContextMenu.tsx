import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useEditorStore } from "../../../../store/store"
import type { NodeApi } from "react-arborist";
import type { FileNode } from "../../../../store/types";

interface RowContextMenuProps {
  node: NodeApi<FileNode>;
  children: React.ReactNode; 
}

export function NodeContextMenu({ node, children }: RowContextMenuProps) {
  const deleteNode = useEditorStore((state) => state.deleteNode);
  const setActiveFile = useEditorStore((state) => state.setActiveFile);
  const setRenamingNode = useEditorStore((state) => state.setRenamingNode);
  const createNode = useEditorStore((state) => state.createNode);

  const handleRename = (e: React.MouseEvent<HTMLDivElement>) => {
    setRenamingNode(node.data.id);
    e.stopPropagation();
  }

  const handleNewFile = () => {
    node.open();
    createNode(node.data.id, "", "file")
  }

  const handleNewFolder = () => {
    node.open();
    createNode(node.data.id, "", "folder")
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56 [&>*]:cursor-pointer">
        { 
          node.isLeaf && 
          <ContextMenuItem onClick={() => setActiveFile(node.data.id)}>
            Open
          </ContextMenuItem>
        }

        { 
          node.isInternal && 
          <>
            <ContextMenuItem onClick={handleNewFile}>
              New file...
            </ContextMenuItem>

            <ContextMenuItem onClick={handleNewFolder}>
              New folder...
            </ContextMenuItem>
          </>
        }

        <ContextMenuItem onClick={() => deleteNode(node.data.id)}>
          Delete
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={handleRename}>
          Rename
        </ContextMenuItem>

      </ContextMenuContent>
    </ContextMenu>
  );
}
