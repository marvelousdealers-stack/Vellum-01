import { AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/cn";

// ═══════════════════════════════════════════════════════════════
// SCOPE ESTIMATE
// Returns a plain content fragment — no outer surface. The caller
// wraps this in a <Bento variant="featured"> or <Bento> so the
// featured treatment (gradient border + hero glow) comes from the
// container, not the content.
// ═══════════════════════════════════════════════════════════════
export const ScopeEstimate = ({
  mix,
  totalMarks,
  targetMarks,
  duration,
  mode,
}) => {
  const totalQuestions = mix.reduce((s, r) => s + r.count, 0);
  const estimatedMin = Math.round((totalQuestions * 90) / 60);
  const isOver = totalMarks > targetMarks;
  const isUnder = totalMarks < targetMarks;
  const tight = duration < estimatedMin - 5;
  const generous = duration > estimatedMin + 20;

  const stats = [
    { label: "Questions", value: totalQuestions },
    {
      label: "Total marks",
      value: (
        <>
          <span
            className={cn(
              isOver ? "text-warning" : isUnder ? "text-danger" : "text-ink",
            )}
          >
            {totalMarks}
          </span>
          {targetMarks > 0 && (
            <span className="ml-1 text-[16px] font-normal text-ink-3">
              / {targetMarks}
            </span>
          )}
        </>
      ),
    },
    {
      label: "Duration",
      value: (
        <>
          <span
            className={cn(
              tight ? "text-danger" : generous ? "text-warning" : "text-ink",
            )}
          >
            {duration}
          </span>
          <span className="ml-1 text-[15px] font-normal text-ink-3">min</span>
        </>
      ),
    },
    {
      label: "Mode",
      value: (
        <span className="text-[15px] font-semibold tracking-[-0.005em]">
          {mode === "personal" ? "Per student" : "Whole class"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-5 flex items-baseline justify-between border-b border-rule pb-4">
        <div className="text-[12px] font-semibold text-ink-3">
          Draft scope
        </div>
        <div className="font-mono text-[12px] text-ink-3">
          What this will produce
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 narrow:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i}>
            <div className="mb-2 text-[12px] font-semibold text-ink-3">
              {s.label}
            </div>
            <div className="font-display text-[26px] font-medium leading-none tracking-[-0.025em] tabular-nums text-ink">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-2 border-t border-rule pt-4 text-[12.5px] leading-relaxed text-ink-2">
        {tight ? (
          <>
            <AlertTriangle size={13} className="mt-0.5 shrink-0 text-warning" />
            <span>
              At {totalQuestions} questions, students will need about{" "}
              {estimatedMin} min. The current {duration}-min limit may be tight.
            </span>
          </>
        ) : generous ? (
          <>
            <Check size={13} className="mt-0.5 shrink-0 text-primary" />
            <span>
              Comfortable pace — {totalQuestions} questions in {duration} min
              gives students plenty of room.
            </span>
          </>
        ) : (
          <>
            <Check size={13} className="mt-0.5 shrink-0 text-primary" />
            <span>
              Well-balanced — {totalQuestions} questions typically take about{" "}
              {estimatedMin} min, fitting the {duration}-min limit.
            </span>
          </>
        )}
      </div>
    </div>
  );
};
