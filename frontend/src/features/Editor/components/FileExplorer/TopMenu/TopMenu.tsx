import { UploadDownload } from "./UploadDownload"
import { AddNodeButton } from "./AddNodeButton"

export function TopMenu() {
  return (
    <>
      <UploadDownload />
    
      <div className="h-8 flex items-center border-t justify-between px-1 py-1 text-xs uppercase tracking-wide text-[#bbbbbb]">
        <span className="pl-2">Explorer</span>
        <div className="flex space-x-1 items-center">
          <AddNodeButton type="file" />
          <AddNodeButton type="folder" />
        </div>
      </div>
    </>
  )
}