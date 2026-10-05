import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// usePersistentState
// Drop-in replacement for useState that survives page reloads.
// ═══════════════════════════════════════════════════════════════
export const usePersistentState = (key, initial) => {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded or private mode — silently ignore */
    }
  }, [key, value]);

  return [value, setValue];
};
