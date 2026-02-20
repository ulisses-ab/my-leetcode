import { resolveIcon } from "@/lib/icons/resolveIcon";

export function FileIcon({
  name,
  isFolder,
}: {
  name: string;
  isFolder: boolean;
}) {
  const icon = resolveIcon(name, isFolder);

  return (
    <img
      src={`${icon}`}
      className="w-4 h-4"
      draggable={false}
    />
  );
}
