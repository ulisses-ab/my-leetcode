import type { Snapshot, EditorState } from "./store";
import { debounce } from "lodash";
import type { StoreApi } from "zustand";

const AUTOSAVE_DELAY_MS = 500;
const EDITOR_PREFIX = "editor:";
const MAX_EDITORS = 10;

function storageKey(persistanceKey: string) {
  return `${EDITOR_PREFIX}${persistanceKey}`;
}

function editorListKey() {
  return `${EDITOR_PREFIX}list`;
}

function getSavedEditorIds(): string[] {
  const raw = localStorage.getItem(editorListKey());
  return raw ? JSON.parse(raw) : [];
}

function saveEditorId(id: string) {
  let ids = getSavedEditorIds();

  ids = ids.filter((x) => x !== id);
  ids.unshift(id);

  if (ids.length > MAX_EDITORS) {
    const toRemove = ids.slice(MAX_EDITORS);
    toRemove.forEach((oldId) =>
      localStorage.removeItem(storageKey(oldId))
    );
    ids = ids.slice(0, MAX_EDITORS);
  }

  localStorage.setItem(editorListKey(), JSON.stringify(ids));
}

export function saveEditor(
  persistanceKey: string,
  snapshot: Snapshot
) {
  localStorage.setItem(
    storageKey(persistanceKey),
    JSON.stringify(snapshot)
  );

  saveEditorId(persistanceKey);
}

export function loadEditor(
  persistanceKey: string
): Snapshot | null {
  const raw = localStorage.getItem(storageKey(persistanceKey));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

export function setupAutoSave(store: StoreApi<EditorState>) {
  const autoSave = debounce((state: EditorState) => {
    if (!state.persistanceKey) return;

    const snapshot: Snapshot = {
      nodes: state.nodes,
      rootId: state.rootId,
      activeFileId: state.activeFileId,
    };

    saveEditor(state.persistanceKey, snapshot);
  }, AUTOSAVE_DELAY_MS);

  store.subscribe(autoSave);
}
