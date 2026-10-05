import { cn } from "@/lib/cn";

// ── Bento card ──
// The core container. Variants:
//   default  — white surface, hairline border, soft shadow
//   featured — primary-tinted fill + indigo hairline (max ONE per page)
//   quiet    — no border, surface fill only (for dense grids)
//   tinted   — pastel fill chosen by `tone` (WeHR-style KPI cards)
const TONE_FILL = {
  primary: "bg-tint-primary",
  success: "bg-tint-success",
  warning: "bg-tint-warning",
  danger: "bg-tint-danger",
  neutral: "bg-surface border-rule",
};

export const Bento = ({
  as: Component = "div",
  variant = "default",
  tone = "primary",
  span,
  className,
  children,
  ...props
}) => (
  <Component
    className={cn(
      "relative flex min-h-0 flex-col rounded-[var(--radius-bento)] p-5 transition-[transform,box-shadow] duration-200",
      variant === "default" && "border border-rule bg-surface shadow-[var(--shadow-card)]",
      variant === "featured" && "border border-primary/25 bg-tint-primary shadow-[var(--shadow-card)]",
      variant === "tinted" && cn("border border-transparent", TONE_FILL[tone] || TONE_FILL.primary),
      variant === "quiet" && "bg-surface",
      span,
      className
    )}
    {...props}
  >
    {children}
  </Component>
);
