import { cn } from "@/lib/cn";

// ── Status indicator — dot + text, no pill background ──
const DOT_COLOR = { success: "bg-success", warning: "bg-warning", danger: "bg-danger", primary: "bg-primary", muted: "bg-ink-3" };

const DOT_TEXT = { success: "text-success", warning: "text-warning", danger: "text-danger", primary: "text-primary", muted: "text-ink-3" };

export const StatusDot = ({ tone = "success", children }) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-medium">
    <span className={cn("size-1.5 shrink-0 rounded-full", DOT_COLOR[tone])} />
    <span className={DOT_TEXT[tone]}>{children}</span>
  </span>
);
