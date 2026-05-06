import { AddNodeButton } from "./AddNodeButton"

export function TopMenu() {
  return (
    <div className="h-9 flex items-center border-b-2 border-bb-border/40 justify-between px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-bb-muted-strong">
      <span>Explorer</span>
      <div className="flex space-x-0.5 items-center">
        <AddNodeButton type="file" />
        <AddNodeButton type="folder" />
      </div>
    </div>
  );
}
