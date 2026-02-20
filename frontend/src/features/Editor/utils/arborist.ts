import type { FileNode } from "../store/types";

export function toArboristNodes(nodes: Record<string, FileNode>, rootId: string) {
  if(!nodes || !rootId) return [];

  const buildTree = (id: string): any => {
    const node = nodes[id];
    if (!node) return null;

    const isFolder = node.type === "folder";

    let children;
    if(isFolder) {
      children = node.children
        ?.map(buildTree)
        .filter((child): child is NonNullable<typeof child> => child != null) ?? [];
    }
    else {
      children = undefined;
    }

    return {
      id: node.id,
      name: node.name,
      isFolder,
      children,
    };
  };

  return [buildTree(rootId)];
}