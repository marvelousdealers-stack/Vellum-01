import { Bento } from "@/components/common";
import { cn } from "@/lib/cn";

const ActionBtn = ({ onClick, disabled, label, children }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    disabled={disabled}
    className="rounded-[var(--radius-control)] border border-rule-2 px-2.5 py-1 text-[12px] font-medium text-ink-2 transition-colors hover:border-rule-3 hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:text-ink-3"
  >
    {children}
  </button>
);

// ═══════════════════════════════════════════════════════════════
// QUESTION EDITOR
// ═══════════════════════════════════════════════════════════════
export const QuestionEditor = ({
  q,
  index,
  total,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
}) => {
  const isMCQ = q.type === "mcq" || q.type === "truefalse";
  const isWritten = !isMCQ;
  const updateField = (patch) => onUpdate({ ...q, ...patch });
  const updateOption = (i, val) => {
    const opts = [...q.options];
    opts[i] = val;
    updateField({ options: opts });
  };

  return (
    <Bento className="!p-5">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-[13px] font-bold tabular-nums text-primary">
            Q{index + 1}
          </span>
          <span className="text-[12.5px] font-medium text-ink-2">
            {q.typeLabel}
          </span>
          <span className="rounded-full border border-primary/25 bg-primary-soft px-2 py-0.5 text-[12px] font-medium text-primary">
            {q.topic}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="inline-flex items-center gap-1.5">
            <input
              value={q.marks}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                updateField({
                  marks: v === "" ? 1 : Math.max(1, parseInt(v, 10)),
                });
              }}
              className="h-8 w-12 rounded-[var(--radius-control)] border border-rule-2 bg-bg text-center font-mono text-[13.5px] font-semibold tabular-nums text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
              aria-label="Marks"
            />
            <span className="text-[12px] text-ink-3">marks</span>
          </div>
          <div className="flex gap-0.5">
            <ActionBtn
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
              label="Move up"
            >
              ↑
            </ActionBtn>
            <ActionBtn
              onClick={() => onMove(index, 1)}
              disabled={index === total - 1}
              label="Move down"
            >
              ↓
            </ActionBtn>
            <ActionBtn onClick={() => onDuplicate(index)}>Duplicate</ActionBtn>
            <ActionBtn onClick={() => onDelete(index)}>Delete</ActionBtn>
          </div>
        </div>
      </div>

      <textarea
        value={q.text}
        onChange={(e) => updateField({ text: e.target.value })}
        rows={2}
        className="w-full resize-y rounded-[var(--radius-control)] border border-rule bg-bg px-3.5 py-3 font-display text-[16px] leading-snug text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      {isMCQ && q.options && (
        <div className="mt-4">
          <div className="mb-2.5 flex items-baseline justify-between gap-3 text-[12px] font-semibold text-ink-3">
            <span>Options</span>
            <span className="text-[12px] font-normal italic text-ink-3">
              Click the circle to mark the correct answer
            </span>
          </div>
          {q.options.map((opt, i) => {
            const isCorrect = q.correctIndex === i;
            return (
              <div
                key={i}
                className={cn(
                  "mb-2 grid grid-cols-[28px_20px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[var(--radius-control)] border px-3 py-2 transition-all",
                  isCorrect
                    ? "border-success/50 bg-success-dim shadow-[0_0_0_1px_oklch(0.74_0.13_155_/_0.2)]"
                    : "border-rule bg-bg",
                )}
              >
                <button
                  type="button"
                  onClick={() => updateField({ correctIndex: i })}
                  aria-label={`Mark option ${String.fromCharCode(65 + i)} as correct`}
                  className={cn(
                    "grid size-6 place-items-center rounded-full border-2 transition-colors",
                    isCorrect
                      ? "border-success"
                      : "border-rule-2 hover:border-ink-3",
                  )}
                >
                  <span
                    className={cn(
                      "size-2.5 rounded-full transition-colors",
                      isCorrect &&
                        "bg-success shadow-[0_0_6px_var(--color-success)]",
                    )}
                  />
                </button>
                <span
                  className={cn(
                    "text-center text-[13px] font-bold",
                    isCorrect ? "text-success" : "text-ink-3",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-[14px] text-ink outline-none"
                />
                {isCorrect && (
                  <span className="shrink-0 rounded-full bg-success-dim px-2 py-0.5 text-[12px] font-semibold text-success">
                    Correct
                  </span>
                )}
              </div>
            );
          })}
          <div className="mt-2.5 text-[12px] italic text-ink-3">
            Used by auto-grading. Students never see this marker.
          </div>
        </div>
      )}

      {isWritten && (
        <div className="mt-4 flex flex-col gap-3.5">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-ink-3">
              Expected answer / model response
            </label>
            <textarea
              value={q.expectedAnswer}
              onChange={(e) => updateField({ expectedAnswer: e.target.value })}
              placeholder="What a full-mark answer should say. Used by the AI grader and shown to you during review."
              rows={3}
              className="w-full min-h-[76px] resize-y rounded-[var(--radius-control)] border border-rule bg-bg px-3 py-2.5 text-[13.5px] leading-relaxed text-ink outline-none transition-all placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {q.rubric.length > 0 && (
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-ink-3">
                Rubric ({q.rubric.reduce((s, r) => s + r.points, 0)} pts)
              </label>
              <div className="rounded-[var(--radius-control)] border border-rule bg-bg px-3.5 py-2.5">
                {q.rubric.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-rule py-1.5 text-[13px] last:border-b-0"
                  >
                    <span className="text-ink-2">{r.label}</span>
                    <span className="font-mono text-[12px] font-semibold tabular-nums text-ink">
                      {r.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Bento>
  );
};
