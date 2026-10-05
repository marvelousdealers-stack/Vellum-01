import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// AI EVALUATION CHECKLIST
// ═══════════════════════════════════════════════════════════════
const buildRubricVerdict = (marksAwarded, maxMarks) => {
  const ratio = marksAwarded / maxMarks;
  return [
    {
      label: "Identifies the correct principle",
      verdict: ratio >= 0.4 ? "pass" : "fail",
    },
    {
      label: "Shows the working or reasoning",
      verdict: ratio >= 0.6 ? "pass" : "partial",
    },
    {
      label: "States the final answer with units",
      verdict: ratio >= 0.8 ? "pass" : "partial",
    },
    {
      label: "Uses correct terminology",
      verdict: ratio >= 0.9 ? "pass" : "fail",
    },
  ];
};

const CONFIDENCE_TONE = {
  low: { label: "Low", cls: "border-danger/30 bg-danger-dim text-danger" },
  med: {
    label: "Medium",
    cls: "border-warning/30 bg-warning-dim text-warning",
  },
  high: { label: "High", cls: "border-success/30 bg-success-dim text-success" },
};

export const GradingDetailPanel = ({
  g,
  onClose,
  onSave,
  showClose = true,
}) => {
  const toast = useToast();
  const [score, setScore] = useState(g.aiScore);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    setScore(g.aiScore);
    setRemark("");
  }, [g.id, g.aiScore]);

  const verdicts = buildRubricVerdict(Number(score) || 0, g.maxScore);
  const changed = score !== g.aiScore;
  const conf = CONFIDENCE_TONE[g.confidence] || CONFIDENCE_TONE.high;

  return (
    <div className="border-b border-rule bg-surface px-6 py-7 tablet:px-12">
      <div className="mx-auto max-w-[1000px]">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="font-display text-[20px] font-semibold tracking-[-0.015em] text-ink">
              {g.student}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-3">
              <span className="font-mono">Roll {g.roll}</span>
              <span className="text-ink-3">·</span>
              <span>{g.test}</span>
              <span className="text-ink-3">·</span>
              <span className="font-mono">{g.date}</span>
            </div>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[12px] font-semibold",
              conf.cls,
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {conf.label} confidence
          </span>
        </div>

        {/* Question */}
        <div className="mb-5 rounded-[var(--radius-container)] border border-rule bg-sunken px-5 py-4">
          <div className="mb-1.5 text-[12px] font-semibold text-ink-3">
            Question
          </div>
          <div className="font-display text-[16px] leading-snug text-ink-2">
            {g.question}
          </div>
        </div>

        {/* Two-column: answer vs AI */}
        <div className="mb-5 grid gap-4 tablet:grid-cols-2">
          <div className="min-w-0 rounded-[var(--radius-container)] border border-rule bg-sunken px-5 py-4">
            <div className="mb-3 text-[12px] font-semibold text-ink-3">
              Student's answer
            </div>
            <div className="break-words font-display text-[15px] leading-relaxed text-ink">
              {g.answer}
            </div>
          </div>

          <div className="min-w-0 rounded-[var(--radius-container)] border border-primary/25 bg-primary-soft px-5 py-4">
            <div className="mb-3 flex items-center gap-1.5 text-[12px] font-semibold text-primary">
              <Sparkles size={12} />
              AI evaluation
            </div>
            <ul className="flex flex-col gap-2">
              {verdicts.map((v, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[12.5px] leading-snug"
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-4.5 shrink-0 place-items-center rounded text-[12px] font-bold",
                      v.verdict === "pass" && "bg-success-dim text-success",
                      v.verdict === "partial" && "bg-warning-dim text-warning",
                      v.verdict === "fail" && "bg-danger-dim text-danger",
                    )}
                  >
                    {v.verdict === "pass"
                      ? "✓"
                      : v.verdict === "partial"
                        ? "~"
                        : "✗"}
                  </span>
                  <span
                    className={cn(
                      "min-w-0",
                      v.verdict === "pass"
                        ? "text-ink"
                        : v.verdict === "fail"
                          ? "text-danger"
                          : "text-ink-2",
                    )}
                  >
                    {v.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-primary/15 pt-3 text-[12px] italic leading-relaxed text-ink-3">
              Suggested {g.aiScore} / {g.maxScore} based on{" "}
              {verdicts.filter((v) => v.verdict === "pass").length} of 4 rubric
              items fully met.
            </div>
          </div>
        </div>

        {/* Score override */}
        <div className="mb-4 rounded-[var(--radius-container)] border border-rule bg-sunken px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-ink-3">
              Your mark
            </span>
            {changed && (
              <span className="rounded-full border border-primary/25 bg-primary-soft px-2 py-0.5 text-[12px] font-semibold text-primary">
                Overridden (was {g.aiScore})
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              value={score}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9.]/g, "");
                setScore(v === "" ? "" : Math.min(g.maxScore, parseFloat(v)));
              }}
              className="w-[84px] rounded-[var(--radius-control)] border border-rule-2 bg-surface px-3 py-2 text-center font-display text-[18px] font-semibold tabular-nums text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-[14px] text-ink-3">/ {g.maxScore}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-rule">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-300"
                style={{
                  width: `${((Number(score) || 0) / g.maxScore) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Remark */}
        <textarea
          rows={3}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Feedback for the student… (optional)"
          className="mb-4 w-full rounded-[var(--radius-container)] border border-rule-2 bg-sunken px-3.5 py-3 text-[13.5px] leading-relaxed text-ink outline-none transition-all placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
          {showClose ? (
            <Button
              onClick={onClose} variant="ghost"
            >
              Close
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                toast.push("Saved without releasing", "info");
                onSave?.(score, remark);
              }} variant="outline"
            >
              Save without releasing
            </Button>
            <Button
              onClick={() => {
                toast.push(
                  `${g.student} graded at ${score} / ${g.maxScore}`,
                  "success",
                );
                onSave?.(score, remark);
              }}
            >
              Accept &amp; continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
