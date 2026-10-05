import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// TEST PREVIEW
// ═══════════════════════════════════════════════════════════════
const PREVIEW_QUESTIONS = [
  {
    id: 1,
    type: "MCQ",
    topic: "Newton's Laws",
    marks: 2,
    text: "A 5 kg block rests on a frictionless horizontal surface. A horizontal force of 20 N is applied. What is the block's acceleration?",
    options: ["2 m/s²", "4 m/s²", "10 m/s²", "25 m/s²"],
  },
  {
    id: 2,
    type: "Short answer",
    topic: "Newton's Laws",
    marks: 4,
    text: "State Newton's Second Law of Motion and explain, in your own words, how it relates to the concept of inertia.",
  },
  {
    id: 3,
    type: "MCQ",
    topic: "Thermodynamics",
    marks: 2,
    text: "In an isothermal expansion of an ideal gas, which quantity remains constant throughout the process?",
    options: ["Internal energy", "Pressure", "Volume", "Heat transferred"],
  },
  {
    id: 4,
    type: "Numerical",
    topic: "Kinematics",
    marks: 3,
    text: "A car of mass 1200 kg decelerates uniformly from 25 m/s to rest in 8 seconds. Calculate the magnitude of the average braking force.",
  },
];

export const TestPreview = ({ onExit }) => {
  const toast = useToast();
  const [qIndex, setQIndex] = useState(0);
  const q = PREVIEW_QUESTIONS[qIndex];
  const isText = q.type === "Short answer" || q.type === "Numerical";

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-primary/30 bg-bg/85 px-4 py-3 backdrop-blur-xl tablet:px-8">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="font-display text-[14.5px] font-semibold tracking-[-0.01em] text-ink">
            Newton's Laws — Unit Test
          </span>
          <span className="rounded-full border border-primary/25 bg-primary-soft px-2 py-0.5 text-[12px] font-semibold text-primary">
            Preview mode
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[12px] text-ink-3 narrow:inline">
            This is what students see
          </span>
          <Button
            onClick={onExit} variant="outline" size="sm"
          >
            Exit preview
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-12 tablet:px-8 tablet:py-16">
        <div className="w-full max-w-[680px]">
          <div className="mb-10 flex gap-1">
            {PREVIEW_QUESTIONS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-0.5 flex-1 rounded-sm transition-colors duration-300",
                  i < qIndex
                    ? "bg-ink-3"
                    : i === qIndex
                      ? "bg-gradient-to-r from-primary to-primary-2 shadow-[0_0_8px_var(--color-primary-dim)]"
                      : "bg-rule",
                )}
              />
            ))}
          </div>

          <div className="mb-5 flex items-center justify-between font-mono text-[12px] font-medium text-ink-3">
            <span>
              Question {qIndex + 1} of {PREVIEW_QUESTIONS.length} · {q.type}
            </span>
            <span>{q.marks} marks</span>
          </div>

          <div className="mb-9 font-display text-[26px] leading-snug tracking-[-0.015em] text-ink">
            {q.text}
          </div>

          {!isText && q.options && (
            <div className="flex flex-col gap-2">
              {q.options.map((o, i) => (
                <button
                  key={i}
                  disabled
                  className="flex cursor-default items-center gap-4 rounded-[var(--radius-container)] border border-rule-2 bg-surface px-5 py-4 text-left text-[15px] text-ink opacity-85"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-raised font-mono text-[12px] font-semibold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{o}</span>
                </button>
              ))}
            </div>
          )}

          {isText && (
            <div className="min-h-[180px] rounded-[var(--radius-container)] border border-rule-2 bg-surface px-4 py-4 text-[15px] text-ink-3">
              Students type their answer here…
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <Button
              disabled={qIndex === 0}
              onClick={() => setQIndex(qIndex - 1)} variant="ghost"
            >
              ← Previous
            </Button>
            <span className="font-mono text-[12px] text-ink-3">
              Interactive preview disabled
            </span>
            <Button
              onClick={() => {
                if (qIndex === PREVIEW_QUESTIONS.length - 1) {
                  toast.push("End of preview", "info");
                  onExit();
                } else setQIndex(qIndex + 1);
              }}
            >
              {qIndex === PREVIEW_QUESTIONS.length - 1
                ? "Finish preview"
                : "Next →"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
