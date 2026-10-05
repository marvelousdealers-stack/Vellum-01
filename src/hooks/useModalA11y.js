import { useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// MODAL ACCESSIBILITY HOOK
// ═══════════════════════════════════════════════════════════════
export const useModalA11y = (open, onClose) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previousActive = document.activeElement;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key === "Tab" && ref.current) {
        const focusable = ref.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => {
      const first = ref.current?.querySelector(
        "input, textarea, [data-autofocus], button:not(.modal-x)",
      );
      first?.focus?.();
    }, 40);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      clearTimeout(t);
      if (previousActive instanceof HTMLElement && previousActive.focus)
        previousActive.focus();
    };
  }, [open, onClose]);

  return ref;
};
