import { cn } from "@/lib/cn";

// ── Legacy KPI strip — kept for compat, wraps the new primitives ──
export const KpiStrip = ({ children, className }) => (
  <div className={cn("kpi-strip grid grid-cols-2 border-y border-rule tablet:grid-cols-4", className)}>
    {children}
  </div>
);

export const Kpi = ({ label, value, sub, alert, children }) => (
  <div className="flex min-h-[100px] flex-col border-b border-r border-rule px-5 py-5 last:border-r-0 narrow:border-b-0 [&:nth-child(2)]:border-r-0 tablet:[&:nth-child(2)]:border-r tablet:[&:nth-child(4)]:border-r-0">
    <div className="mb-2 text-[12px] font-semibold text-ink-3">{label}</div>
    <div className={cn("font-display text-[36px] font-medium leading-none tracking-[-0.03em] tabular-nums", alert ? "text-danger" : "text-ink")}>{value}</div>
    {sub && <div className="mt-auto pt-2 text-[12px] text-ink-3">{sub}</div>}
    {children}
  </div>
);
