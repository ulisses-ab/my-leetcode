import { Volume2, VolumeX } from "lucide-react";
import { useSoundStore } from "@/stores/useSoundStore";
import { playClick } from "@/lib/sounds";

export function SoundToggle() {
  const enabled = useSoundStore((s) => s.enabled);
  const toggle = useSoundStore((s) => s.toggle);

  const handleToggle = () => {
    toggle();
    // Play a confirmation beep when turning sounds ON (call directly, bypasses the gate)
    if (!enabled) playClick();
  };

  return (
    <button
      type="button"
      aria-label={enabled ? "Mute sounds" : "Enable sounds"}
      onClick={handleToggle}
      className="inline-flex h-9 w-9 items-center justify-center border-2 border-bb-border/55 bg-bb-surface/72 text-bb-muted-strong hover:text-bb-accent hover:border-bb-accent transition-colors"
    >
      {enabled ? <Volume2 className="size-[18px]" /> : <VolumeX className="size-[18px]" />}
    </button>
  );
}
