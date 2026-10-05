import { cn } from "@/lib/cn";

// ═══════════════════════════════════════════════════════════════
// KBD
// ═══════════════════════════════════════════════════════════════
export const Kbd = ({ children, size = "md", className }) => (
  <kbd
    className={cn(
      "inline-flex items-center justify-center rounded border border-rule-2 bg-raised font-mono font-semibold leading-none tracking-wide text-ink-2",
      size === "sm"
        ? "min-w-4 px-1.5 py-0.5 text-[11px]"
        : "min-w-4.5 px-1.5 py-0.5 text-[12px]",
      className,
    )}
  >
    {children}
  </kbd>
);
