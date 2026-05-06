import { SubmitButtons } from "./SubmitButtons";
import { SelectLanguage } from "./SelectLanguage";

export function NavbarMenu() {
  return (
    <div className="hidden sm:flex items-center gap-1.5 px-1 py-1 border-2 border-bb-border/55 bg-bb-surface/72">
      <SelectLanguage />
      <div className="h-5 w-px bg-bb-border/40" />
      <div className="w-44">
        <SubmitButtons />
      </div>
    </div>
  );
}
