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
  const ICON_TONE = {
    primary: "bg-surface text-primary",
    success: "bg-surface text-success",
    warning: "bg-surface text-warning",
    danger:  "bg-surface text-danger",
    neutral: "bg-raised text-ink-2",
  };
  const DELTA_TONE = {
    success: "text-success",
    warning: "text-warning",
    danger:  "text-danger",
  };

  return (
    <Bento
      as={Component}
      variant={variant === "default" && tinted && iconTone !== "neutral" ? "tinted" : variant}
      tone={iconTone}
      onClick={onClick}
      className={cn(
        span,
        "text-left",
        onClick && "cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)] focus-visible:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {Icon && (
          <div className={cn("grid size-10 place-items-center rounded-xl shadow-[var(--shadow-card)]", ICON_TONE[iconTone])}>
            <Icon size={18} />
          </div>
        )}
        {delta && (
          <div className={cn("rounded-full bg-surface/70 px-2 py-0.5 text-[12px] font-semibold tabular-nums", DELTA_TONE[deltaTone])}>
            {delta}
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col pt-6">
        <div className="text-[13px] font-medium text-ink-2">
          {label}
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5 font-display text-[34px] font-bold leading-none tracking-[-0.03em] tabular-nums text-ink">
          {value}
          {unit && <span className="text-[14px] font-medium text-ink-3">{unit}</span>}
        </div>
      </div>

      {sparkline && <div className="mt-3 h-8 opacity-90">{sparkline}</div>}
    </Bento>
  );
};
