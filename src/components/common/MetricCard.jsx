import { Bento } from "./Bento";
import { cn } from "@/lib/cn";

// ── Metric card ──
// WeHR + Promage: pastel tinted card, icon badge top-left, label, large value, delta.
// Tint follows `iconTone`; pass tinted={false} for a plain white card.
// Optional sparkline slot for the Tesla-style trend micro-chart.
export const MetricCard = ({
  icon: Icon,
  iconTone = "primary",
  label,
  value,
  unit,
  delta,
  deltaTone = "success",
  sparkline,
  onClick,
  span,
  variant = "default",
  tinted = true,
  className,
}) => {
  const Component = onClick ? "button" : "div";
  // Tinted cards: white badge on the pastel fill. Plain cards: the badge carries the tint.
  const isTinted = variant === "default" && tinted && iconTone !== "neutral";
  const ICON_TONE = isTinted
    ? {
        primary: "bg-surface text-primary",
        success: "bg-surface text-success",
        warning: "bg-surface text-warning",
        danger: "bg-surface text-danger",
        neutral: "bg-raised text-ink-2",
      }
    : {
        primary: "bg-primary-dim text-primary",
        success: "bg-success-dim text-success",
        warning: "bg-warning-dim text-warning",
        danger: "bg-danger-dim text-danger",
        neutral: "bg-raised text-ink-2",
      };
  const DELTA_TONE = {
    success: "text-success",
    warning: "text-warning",
    danger:  "text-danger",
    neutral: "text-ink-2",
  };

  return (
    <Bento
      as={Component}
      variant={isTinted ? "tinted" : variant}
      tone={iconTone}
      data-metric=""
      onClick={onClick}
      className={cn(
        "max-narrow:p-4",
        span,
        "text-left",
        onClick && "cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)] focus-visible:-translate-y-0.5 dark:hover:border-rule-3"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {Icon && (
          <div className={cn("grid size-10 place-items-center rounded-xl shadow-[var(--shadow-card)] max-narrow:size-9", ICON_TONE[iconTone])}>
            <Icon size={18} />
          </div>
        )}
        {delta && (
          <div className={cn("rounded-full px-2 py-0.5 text-[12px] font-semibold tabular-nums max-narrow:hidden", isTinted ? "bg-surface/70" : "bg-raised", DELTA_TONE[deltaTone])}>
            {delta}
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col pt-6 max-narrow:pt-4">
        <div className="text-[13px] font-medium text-ink-2">
          {label}
        </div>
        <div className="mt-1.5 flex items-end justify-between gap-3">
          <div className="flex items-baseline gap-1.5 font-display text-[34px] font-bold leading-none max-narrow:text-[28px] tracking-[-0.03em] tabular-nums text-ink">
            {value}
            {unit && <span className="text-[14px] font-medium text-ink-3">{unit}</span>}
          </div>
          {sparkline && <div className="h-9 w-24 shrink-0 opacity-90 max-narrow:hidden">{sparkline}</div>}
        </div>
        {/* Phones: the delta moves under the value (no room beside the icon in a 2-up card). */}
        {delta && (
          <div className={cn("mt-1.5 text-[12px] font-medium narrow:hidden", DELTA_TONE[deltaTone])}>{delta}</div>
        )}
      </div>
    </Bento>
  );
};
