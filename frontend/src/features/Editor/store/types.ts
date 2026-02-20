export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  children?: string[];
  content?: string;
};
