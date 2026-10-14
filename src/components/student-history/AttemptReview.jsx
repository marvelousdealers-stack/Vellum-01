import { CheckCircle2, XCircle } from "lucide-react";
import { Bento } from "@/components/common";
import { cn } from "@/lib/cn";
import { isChoice, typeLabel } from "@/lib/questions";
import { formatDateTime } from "@/lib/time";

const REASON_COPY = {
  timeout: "Submitted automatically when time ran out.",
  stopped: "Submitted automatically when your teacher ended the test.",
};

const ChoiceAnswer = ({ item }) => (
  <ul className="flex flex-col gap-1.5">
    {(item.question.options ?? []).map((option, i) => {
      const picked = item.answer === i;
      const correct = item.correctIndex === i;
      return (
        <li
          key={i}
          className={cn(
            "flex items-center gap-3 rounded-[var(--radius-control)] border px-3.5 py-2.5 text-[14px]",
            correct
              ? "border-success/40 bg-success-dim text-ink"
              : picked
                ? "border-danger/40 bg-danger-dim text-ink"
                : "border-rule bg-surface text-ink-2",
          )}
        >
          <span className="grid size-5 shrink-0 place-items-center font-mono text-[12px] font-semibold text-ink-3">
            {String.fromCharCode(65 + i)}
          </span>
          <span className="flex-1">{option}</span>
          {picked && (
            <span className="text-[12px] font-medium text-ink-3">Your answer</span>
          )}
          {correct && <CheckCircle2 size={14} className="shrink-0 text-success" />}
          {picked && !correct && <XCircle size={14} className="shrink-0 text-danger" />}
        </li>
      );
    })}
    {item.answer == null && (
      <li className="text-[12.5px] text-ink-3">You didn't answer this question.</li>
    )}
  </ul>
);

// One released attempt, question by question: what was asked, what the
// student answered, what earned marks, and the teacher's feedback.
export const AttemptReview = ({ review }) => {
  const { totals, items } = review;
  return (
    <div className="mx-auto max-w-[860px]">
      <Bento className="mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-display text-[32px] font-semibold tabular-nums leading-none text-ink">
              {totals.earned} <span className="text-ink-3">/ {totals.max}</span>
            </div>
            <div className="mt-2 text-[13px] text-ink-3">
              {totals.complete
                ? "Final mark"
                : `So far — ${totals.notFinal} ${totals.notFinal === 1 ? "answer is" : "answers are"} still being graded`}
            </div>
          </div>
          <div className="text-right text-[12.5px] text-ink-3">
            <div>Submitted {formatDateTime(review.submittedAt)}</div>
            {REASON_COPY[review.submitReason] && <div>{REASON_COPY[review.submitReason]}</div>}
            {review.flags > 0 && (
              <div className="text-warning">
                {review.flags} tab {review.flags === 1 ? "switch" : "switches"} recorded
              </div>
            )}
          </div>
        </div>
      </Bento>

      <ol className="flex flex-col gap-5">
        {items.map((item, i) => {
          const g = item.grade;
          const graded = g.status === "final";
          return (
            <li
              key={item.question.id}
              className="rounded-[var(--radius-bento)] border border-rule bg-surface px-5 py-5 tablet:px-7"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[12.5px] font-medium text-ink-3">
                <span>
                  Question {i + 1} · {typeLabel(item.question.type)}
                  {item.question.topic ? ` · ${item.question.topic}` : ""}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 font-mono text-[12px] font-semibold",
                    !graded
                      ? "bg-raised text-ink-3"
                      : g.marks >= g.max
                        ? "bg-success-dim text-success"
                        : g.marks > 0
                          ? "bg-warning-dim text-warning"
                          : "bg-danger-dim text-danger",
                  )}
                >
                  {graded ? `${g.marks} / ${g.max}` : `Being graded · ${g.max} marks`}
                </span>
              </div>

              <div className="mb-4 font-display text-[17px] leading-snug text-ink">
                {item.question.text}
              </div>

              {isChoice(item.question) ? (
                <ChoiceAnswer item={item} />
              ) : (
                <div className="grid gap-3">
                  <div className="rounded-[var(--radius-container)] border border-rule bg-sunken px-4 py-3">
                    <div className="mb-1 text-[12px] font-semibold text-ink-3">Your answer</div>
                    <div className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-ink">
                      {item.answer || <span className="text-ink-3">(No answer given)</span>}
                    </div>
                  </div>
                  {item.modelAnswer && (
                    <div className="rounded-[var(--radius-container)] border border-success/25 bg-success-dim px-4 py-3">
                      <div className="mb-1 text-[12px] font-semibold text-success">Model answer</div>
                      <div className="text-[14px] leading-relaxed text-ink">{item.modelAnswer}</div>
                    </div>
                  )}
                </div>
              )}

              {graded && g.feedback && (
                <p className="mt-4 border-l-2 border-primary pl-3 text-[13.5px] leading-relaxed text-ink-2">
                  {g.feedback}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
