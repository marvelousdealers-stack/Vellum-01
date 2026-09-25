import { useState, useEffect, useCallback } from "react";

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

// ═══════════════════════════════════════════════════════════════
// useDocumentTitle
// Keeps the browser tab in sync with the current view.
// ═══════════════════════════════════════════════════════════════
export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · Vellum` : "Vellum";
  }, [title]);
};

// ═══════════════════════════════════════════════════════════════
// useDebouncedValue
// Delays a rapidly-changing value. Used by search inputs.
// ═══════════════════════════════════════════════════════════════
export const useDebouncedValue = (value, delay = 200) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};