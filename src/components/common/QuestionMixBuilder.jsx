import { cn } from "@/lib/cn";

// ═══════════════════════════════════════════════════════════════
// QUESTION MIX BUILDER
// ═══════════════════════════════════════════════════════════════
const QUESTION_TYPE_META = {
  mcq: { label: "Multiple choice", short: "MCQ", defaultMarks: 2, max: 40 },
  truefalse: { label: "True / false", short: "T/F", defaultMarks: 1, max: 20 },
  short: { label: "Short answer", short: "Short", defaultMarks: 4, max: 20 },
  long: { label: "Long answer", short: "Long", defaultMarks: 10, max: 10 },
  numerical: { label: "Numerical", short: "Num", defaultMarks: 5, max: 15 },
};

export const QuestionMixBuilder = ({ rows, onChange, targetMarks }) => {
  const totalQuestions = rows.reduce((s, r) => s + r.count, 0);
  const totalMarks = rows.reduce((s, r) => s + r.count * r.marks, 0);

  const update = (type, patch) =>
    onChange(rows.map((r) => (r.type === type ? { ...r, ...patch } : r)));
  const addRow = (type) =>
    onChange([
      ...rows,
      { type, count: 5, marks: QUESTION_TYPE_META[type].defaultMarks },
    ]);
  const removeRow = (type) => onChange(rows.filter((r) => r.type !== type));
  const available = Object.keys(QUESTION_TYPE_META).filter(
    (t) => !rows.some((r) => r.type === t),
  );

  const marksMatch = targetMarks == null || totalMarks === targetMarks;
  const marksOff = targetMarks != null ? totalMarks - targetMarks : 0;

  return (
    <div className="overflow-hidden rounded-[var(--radius-container)] border border-rule-2 bg-sunken shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-rule px-4 py-3 font-mono text-[12px] font-semibold text-ink-2">
        <span>Question types</span>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 tabular-nums",
            marksMatch
              ? "bg-success-dim text-success"
              : "bg-warning-dim text-warning",
          )}
        >
          {totalQuestions} q · {totalMarks} marks
        </span>
      </div>

      <div className="flex flex-col divide-y divide-rule">
        {rows.map((r) => {
          const meta = QUESTION_TYPE_META[r.type];
          return (
            <div
              key={r.type}
              className="grid grid-cols-[minmax(0,130px)_minmax(0,1fr)_52px_28px] items-center gap-3 px-4 py-3 transition-colors hover:bg-surface/50"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="font-mono text-[12px] font-bold tracking-wider text-primary">
                  {meta.short}
                </span>
                <span className="truncate text-[12.5px] text-ink-2">
                  {meta.label}
                </span>
              </div>

              <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                <div className="inline-flex h-8 items-stretch overflow-hidden rounded-[var(--radius-control)] border border-rule-2 bg-surface">
                  <button
                    type="button"
                    onClick={() =>
                      update(r.type, { count: Math.max(0, r.count - 1) })
                    }
                    disabled={r.count <= 0}
                    className="grid w-7 place-items-center text-[15px] text-ink-2 transition-colors hover:bg-raised hover:text-ink disabled:text-ink-3"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={r.count}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, "");
                      update(r.type, {
                        count:
                          v === "" ? 0 : Math.min(meta.max, parseInt(v, 10)),
                      });
                    }}
                    className="w-11 border-x border-rule bg-transparent text-center font-mono text-[13px] font-semibold tabular-nums text-ink outline-none focus:bg-bg"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      update(r.type, { count: Math.min(meta.max, r.count + 1) })
                    }
                    disabled={r.count >= meta.max}
                    className="grid w-7 place-items-center text-[15px] text-ink-2 transition-colors hover:bg-raised hover:text-ink disabled:text-ink-3"
                  >
                    +
                  </button>
                </div>
                <span className="font-mono text-[13px] text-ink-3">×</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={r.marks}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, "");
                    update(r.type, {
                      marks:
                        v === ""
                          ? 1
                          : Math.max(1, Math.min(50, parseInt(v, 10))),
                    });
                  }}
                  className="h-8 w-11 rounded-[var(--radius-control)] border border-rule-2 bg-surface text-center font-mono text-[13px] font-semibold tabular-nums text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                <span className="text-[12px] text-ink-3">marks each</span>
              </div>

              <div className="text-right font-mono text-[14px] font-semibold tabular-nums text-ink">
                {r.count * r.marks}
              </div>

              <button
                type="button"
                onClick={() => removeRow(r.type)}
                aria-label={`Remove ${meta.label}`}
                className="grid size-6 place-items-center rounded text-ink-3 transition-colors hover:bg-danger-dim hover:text-danger"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {available.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-rule bg-surface/60 px-4 py-3">
          <span className="mr-1 text-[12px] text-ink-3">Add type:</span>
          {available.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => addRow(t)}
              className="rounded-full border border-dashed border-rule-2 px-2.5 py-1 text-[12px] font-medium text-ink-2 transition-colors hover:border-solid hover:border-ink-3 hover:text-ink"
            >
              + {QUESTION_TYPE_META[t].label}
            </button>
          ))}
        </div>
      )}

      {targetMarks != null && (
        <div
          className={cn(
            "border-t border-rule px-4 py-2.5 text-[12.5px] font-medium",
            marksMatch
              ? "bg-success-dim text-success"
              : "bg-warning-dim text-warning",
          )}
        >
          {marksMatch
            ? `Total matches your target of ${targetMarks} marks.`
            : marksOff > 0
              ? `${marksOff} marks over your target of ${targetMarks}.`
              : `${Math.abs(marksOff)} marks under your target of ${targetMarks}.`}
        </div>
      )}
    </div>
  );
};

export const DEFAULT_MIX = [
  { type: "mcq", count: 10, marks: 2 },
  { type: "short", count: 5, marks: 4 },
  { type: "long", count: 2, marks: 10 },
];
