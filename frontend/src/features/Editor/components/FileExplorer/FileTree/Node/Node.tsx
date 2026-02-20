import { NodeApi } from "react-arborist";
import type { FileNode } from "@/features/Editor/store/types";
import { NodeContextMenu } from "./NodeContextMenu";
import { useEditorStore } from "../../../../store/store";
import { NodeContent } from "./NodeContent";

export function Node({ node, style, dragHandle }: { 
  node: NodeApi<FileNode>; 
  style: any, 
  dragHandle?: any,
}) {
  const setActiveFile = useEditorStore((state) => state.setActiveFile);
  const setSelectedNode = useEditorStore((state) => state.setSelectedNode);
  const isSelected = useEditorStore((state) => state.selectedNodeId === node.id);
  
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    setSelectedNode(node.data.id);

    if (node.isInternal) {
      node.toggle();
    } else {
      setActiveFile(node.data.id);
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
        className={`flex flex-1 items-center gap-1 h-6 text-sm cursor-pointer
          ${isSelected ? "bg-[#094771] border-y" : "hover:bg-[#2a2d2e]"}`}
        onClick={onClick}
        onContextMenu={onRightClick}
        ref={dragHandle}
      >

        <NodeContent node={node} />
      </div>
    </NodeContextMenu>
  )
}