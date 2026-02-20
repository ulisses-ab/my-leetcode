import { SubmitButtons } from "./SubmitButtons";
import { SelectLanguage } from "./SelectLanguage";

export function NavbarMenu() {
  return (
    <div className="flex space-x-2">
      <SelectLanguage/>
      <div className="flex space-x-2 w-40">
        <SubmitButtons />
      </div>
    </div>
  )
}