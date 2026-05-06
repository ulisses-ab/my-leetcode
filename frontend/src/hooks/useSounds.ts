import { useMemo } from "react";
import { useSoundStore } from "@/stores/useSoundStore";
import {
  playClick,
  playTab,
  playSelect,
  playOpen,
  playClose,
  playDelete,
  playCopy,
  playEnter,
  playSubmit,
  playSuccess,
  playError,
} from "@/lib/sounds";

const noop = () => {};

export function useSounds() {
  const enabled = useSoundStore((s) => s.enabled);
  return useMemo(
    () => ({
      click:  enabled ? playClick  : noop,
      tab:    enabled ? playTab    : noop,
      select: enabled ? playSelect : noop,
      open:   enabled ? playOpen   : noop,
      close:  enabled ? playClose  : noop,
      delete: enabled ? playDelete : noop,
      copy:   enabled ? playCopy   : noop,
      enter:  enabled ? playEnter  : noop,
      submit: enabled ? playSubmit : noop,
      success: enabled ? playSuccess : noop,
      error:  enabled ? playError  : noop,
    }),
    [enabled]
  );
}
