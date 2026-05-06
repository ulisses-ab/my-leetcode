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
    <Breadcrumb className="h-9 flex items-center px-3 bg-bb-surface border-b-2 border-bb-border/40 font-mono text-[10px] tracking-[0.04em]">
      <BreadcrumbList className="text-bb-muted-strong">
        {ancestorList.map(getAncestorElement)}
      </BreadcrumbList>
    </Breadcrumb>
  );
}