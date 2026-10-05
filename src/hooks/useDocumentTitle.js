import { useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// useDocumentTitle
// Keeps the browser tab in sync with the current view.
// ═══════════════════════════════════════════════════════════════
export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · Vellum` : "Vellum";
  }, [title]);
};
