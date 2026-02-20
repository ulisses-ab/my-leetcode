import { getAncestorIdList } from "../../utils/tree"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEditorStore } from "../../store/store"

export function FileBreadcrumb() {
  const nodes = useEditorStore((state) => state.nodes);
  const activeFileId = useEditorStore((state) => state.activeFileId);

  const ancestorIdList = 
    activeFileId ? 
      getAncestorIdList(nodes, activeFileId) :
      [];

  ancestorIdList.shift();

  const ancestorList = ancestorIdList.map((id) => ({
    name: nodes[id].name,
    id,
  }));

  const getAncestorElement = (ancestor: { name: string, id: string }, index: number) => (
    <>
      <BreadcrumbItem>
        {ancestor.name}
      </BreadcrumbItem>
      {index !== ancestorList.length - 1 && <BreadcrumbSeparator />}
    </>
  )

  return (
    <Breadcrumb className="px-2 bg-[#121318ff]">
      <BreadcrumbList>
        {ancestorList.map(getAncestorElement)}
      </BreadcrumbList>
    </Breadcrumb>
  );
}