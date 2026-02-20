import { TbFolderPlus, TbFilePlus } from "react-icons/tb";
import { useEditorStore } from "../../../store/store";

export function AddNodeButton({ type }: { type: "folder" | "file" }) {
  const nodes = useEditorStore((state) => state.nodes);
  const rootId = useEditorStore((state) => state.rootId);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const createNode = useEditorStore((state) => state.createNode);


  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    const selectedNode = 
      selectedNodeId ?
        nodes[selectedNodeId] :
        nodes[rootId!];

    const parentId = 
      selectedNode.type === "folder" ?
        selectedNode.id :
        selectedNode.parentId;

    createNode(parentId!, "", type); 
  };

  return (
    <button
      onClick={handleAdd}
      className="flex items-center gap-1 text-xs text-[#bbbbbb] hover:bg-[#2a2d2e] rounded"
      title="Add new folder"
    >
      {type === "file" ? (
        <TbFilePlus size={18} />
      ) : (
        <TbFolderPlus size={18} />
      )}

    </button>
  );
}
