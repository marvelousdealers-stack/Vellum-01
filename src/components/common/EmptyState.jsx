import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════
export const EmptyState = ({
  icon,
  title,
  body,
  action,
  onAction,
  secondary,
  onSecondary,
  compact = false,
}) => (
  <div
    className={cn(
      "flex flex-col items-center gap-3 rounded-[var(--radius-container)] border border-rule bg-surface text-center shadow-[var(--shadow-card)]",
      compact ? "p-10" : "p-16",
    )}
  >
    {icon && (
      <div className="grid size-12 place-items-center rounded-xl bg-primary-dim text-primary shadow-[var(--shadow-primary)]">
        {icon}
      </div>
    )}
    {title && (
      <div className="font-display text-[16px] font-semibold tracking-[-0.005em] text-ink">
        {title}
      </div>
    )}
    {body && (
      <p className="max-w-[400px] text-[13.5px] leading-relaxed text-ink-3">
        {body}
      </p>
    )}
    {(action || secondary) && (
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {action && (
          <Button
            onClick={onAction}
          >
            {action}
          </Button>
        )}
        {secondary && (
          <Button
            onClick={onSecondary} variant="ghost"
          >
            {secondary}
          </Button>
        )}
      </div>
    )}
  </div>
);
