import type { FileNode } from "../store/types";

export const getAncestorIdList = (
  nodes: Record<string, FileNode>,
  id: string,
): string[] => {
  let currentId: string | null = id;
  const list: string[] = [];

  while(currentId) {
    list.push(currentId);
    currentId = nodes[currentId].parentId;
  }

  return list.reverse();
}

export const isDescendant = (
  nodes: Record<string, FileNode>,
  possibleDescendantId: string,
  ancestorId: string
): boolean => {
  const node = nodes[ancestorId];
  if (!node || !node.children) return false;

  if (node.children.includes(possibleDescendantId)) return true;

  return node.children.some((child) =>
    isDescendant(nodes, possibleDescendantId, child)
  );
};

export const createNode = (
  nodes: Record<string, FileNode>,
  parentId: string,
  node: {
    id: string;
    name: string;
    type: "file" | "folder";
  }
): Record<string, FileNode> => {
  const parent = nodes[parentId];
  if (!parent || parent.type !== "folder") {
    return nodes;
  }

  const newNode: FileNode =
    node.type === "file"
      ? {
          id: node.id,
          name: node.name,
          type: "file",
          parentId,
          content: "",
        }
      : {
          id: node.id,
          name: node.name,
          type: "folder",
          parentId,
          children: [],
        };

  return {
    ...nodes,

    [parentId]: {
      ...parent,
      children: [...(parent.children ?? []), node.id],
    },

    [node.id]: newNode,
  };
};

export const updateFileContent = (
  nodes: Record<string, FileNode>,
  id: string, 
  content: string
): Record<string, FileNode> => {
  const node = nodes[id];
  if (!node || node.type !== "file") return nodes;

  return {
    ...nodes,

    [id]: {
      ...node,
      content,
    },
  };
}

export const moveNode = (
  nodes: Record<string, FileNode>,
  id: string, 
  newParentId: string
): Record<string, FileNode> => {
  const node = nodes[id];
  if (!node || !node.parentId) return nodes;

  if(id == newParentId) return nodes;
  if(isDescendant(nodes, newParentId, id)) return nodes;

  const oldParent = nodes[node.parentId];
  const newParent = nodes[newParentId];

  if (!oldParent || !newParent || newParent.type !== "folder") {
    return nodes;
  }

  return {
    ...nodes,

    [oldParent.id]: {
      ...oldParent,
      children: oldParent.children?.filter((c) => c !== id),
    },

    [newParentId]: {
      ...newParent,
      children: [...(newParent.children ?? []), id],
    },

    [id]: {
      ...node,
      parentId: newParentId,
    },
  };
}

export const renameNode = (
  nodes: Record<string, FileNode>,
  id: string, 
  name: string
): Record<string, FileNode> => {
  const node = nodes[id];
  if (!node) return nodes;

  return {
    ...nodes,

    [id]: {
      ...node,
      name,
    },
  }
}

export const deleteNode = (
  nodes: Record<string, FileNode>,  
  id: string
): Record<string, FileNode> => {
  const node = nodes[id];
  if (!node || !node.parentId) return nodes;

  const parent = nodes[node.parentId];
  if (!parent) return nodes;
  
  const newNodes = { 
    ...nodes,

    [parent.id]: {
      ...parent,
      children: parent.children?.filter((c) => c !== id),
    },
  };

  const remove = (id: string) => {
    const node = newNodes[id];
    if (!node) return;

    if (node.children) {
      for (const childId of node.children) {
        remove(childId);
      }
    }

    delete newNodes[id];
  }

  remove(id);

  return newNodes;
}