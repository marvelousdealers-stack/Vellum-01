import { cn } from "@/lib/cn";

// ── Table primitives ──
export const Th = ({ children, className, ...props }) => (
  <th {...props} className={cn("whitespace-nowrap px-3 py-2.5 narrow:px-4 text-left text-[12px] font-semibold text-ink-3", className)}>
    {children}
  </th>
);

export const Td = ({ children, className, ...props }) => (
  <td {...props} className={cn("px-3 py-3 align-middle narrow:px-4 text-[13px] text-ink-2", className)}>
    {children}
  </td>
);

export const TableShell = ({ children, className }) => (
  <div className={cn("overflow-hidden rounded-[var(--radius-container)] border border-rule bg-surface shadow-[var(--shadow-card)]", className)}>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">{children}</table>
    </div>
  </div>
);
