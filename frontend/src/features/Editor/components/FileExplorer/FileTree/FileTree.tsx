import { Tree } from "react-arborist";
import type { FileNode } from "../../../store/types";
import { toArboristNodes } from "../../../utils/arborist";
import { useEditorStore } from "../../../store/store";
import { Node } from "./Node/Node";

export function MyRow() {
  return (
    <div className="bg-red-100 w-10 h-10"></div>
  )
}

export function FileTree() {
  const nodes = useEditorStore((state) => state.nodes);
  const rootId = useEditorStore((state) => state.rootId);
  const moveNode = useEditorStore((state) => state.moveNode);

  const handleMove = (args: any) => {
    const node = nodes[args.dragIds[0]];

    if(args.parentId === node.parentId) return;

    moveNode(args.dragIds[0], args.parentId);
  };

  return (
    <Tree<FileNode>
      data={toArboristNodes(nodes, rootId!)}
      width="100%"
      onMove={handleMove}
    >
      {Node}
    </Tree>
  )
}