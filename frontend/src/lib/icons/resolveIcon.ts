import materialIconsRaw from "./material-icons.json";

const icons = import.meta.glob('../../assets/icons/file-icons/*.svg', { eager: true, import: 'default' });

export function resolveIcon(name?: string, isFolder?: boolean) {
  const materialIcons = materialIconsRaw as any;

  let fileName = "file";

  if (!name) {
    fileName = "file";
  } else if (isFolder) {
    fileName = materialIcons.folderNames?.[name] ?? materialIcons.folder;
  } else {
    const ext = name.split(".").pop() ?? "";
    fileName = materialIcons.fileExtensions?.[ext] ?? materialIcons.file;
  }

  const key = `../../assets/icons/file-icons/${fileName}.svg`;
  return icons[key];
}