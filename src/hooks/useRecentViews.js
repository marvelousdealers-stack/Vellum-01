import { useCallback } from "react";
import { usePersistentState } from "./usePersistentState";

// ═══════════════════════════════════════════════════════════════
// useRecentViews
// Keeps a bounded list of the last N things a user opened.
// Used by the command palette to show a "Recent" section.
// ═══════════════════════════════════════════════════════════════
export const useRecentViews = (key, max = 5) => {
  const [recent, setRecent] = usePersistentState(key, []);
  const push = useCallback(
    (id) => {
      setRecent((prev) => {
        const next = [id, ...prev.filter((v) => v !== id)].slice(0, max);
        return next;
      });
    },
    [max, setRecent]
  );
  const clear = useCallback(() => setRecent([]), [setRecent]);
  return [recent, push, clear];
};
