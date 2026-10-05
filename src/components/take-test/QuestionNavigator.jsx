import { cn } from "@/lib/cn";

// ═══════════════════════════════════════════════════════════════
// QUESTION NAVIGATOR + AUTO-SAVE
// ═══════════════════════════════════════════════════════════════
export const QuestionNavigator = ({ total, current, answered, onJump }) => (
  <div className="flex flex-col gap-2.5">
    <div className="text-[12px] font-semibold text-ink-3">
      Question
    </div>
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const isCurrent = n === current;
        const isAnswered = answered.has(n);
        return (
          <button
            key={n}
            onClick={() => onJump(n)}
            aria-label={`Go to question ${n}${isAnswered ? " (answered)" : ""}`}
            className={cn(
              "grid size-8.5 place-items-center rounded-[var(--radius-control)] border font-mono text-[12.5px] font-semibold tabular-nums transition-all duration-200",
              isCurrent
                ? "border-primary bg-primary text-on-primary shadow-[var(--shadow-primary)]"
                : isAnswered
                  ? "border-success/50 bg-success-dim text-success"
                  : "border-rule-2 text-ink-3 hover:border-rule-3 hover:bg-raised hover:text-ink",
            )}
          >
            {n}
          </button>
        );
      })}
    </div>
    <div className="flex flex-wrap gap-3.5 text-[12px] text-ink-3">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-sm bg-primary" />
        Current
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-sm bg-success" />
        Answered
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-sm bg-rule-2" />
        Unanswered
      </span>
    </div>
  </div>
);
