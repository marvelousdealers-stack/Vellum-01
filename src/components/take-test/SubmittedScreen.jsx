import { CheckCircle2 } from "lucide-react";
import { BrandMark } from "@/components/common";
import { Button } from "@/components/ui/button";
import { answeredCount } from "@/lib/attempts";
import { formatDateTime } from "@/lib/time";

const REASON_COPY = {
  manual: null,
  timeout: "Time ran out, so your answers were submitted automatically.",
  stopped: "Your teacher ended the test, so your answers were submitted automatically.",
};

export const SubmittedScreen = ({ test, attempt, questions, result, onExit }) => {
  const notice = REASON_COPY[attempt.submitReason];
  const totals = result?.released ? result.totals : null;
  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-4 py-10">
      <div className="w-full max-w-[480px] text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-success-dim text-success">
          <CheckCircle2 size={28} />
        </div>
        <h1 className="mb-2 font-serif text-[30px] font-semibold tracking-[-0.02em] text-ink">
          Test submitted
        </h1>
        <p className="mb-1 text-[15px] text-ink-2">{test.title}</p>
        <p className="mb-6 font-mono text-[12.5px] text-ink-3">
          {answeredCount(questions, attempt.answers)} of {questions.length} answered ·{" "}
          {formatDateTime(attempt.submittedAt)}
        </p>
        {notice && (
          <p className="mb-6 rounded-[var(--radius-control)] border border-warning/25 bg-warning-dim px-4 py-3 text-[13.5px] text-warning">
            {notice}
          </p>
        )}
        {totals ? (
          <div className="mb-8 rounded-[var(--radius-container)] border border-rule bg-surface px-5 py-4">
            <div className="font-display text-[26px] font-semibold tabular-nums text-ink">
              {totals.earned} <span className="text-ink-3">/ {totals.max}</span>
            </div>
            <div className="mt-1 text-[13px] text-ink-3">
              {totals.complete
                ? "Final mark"
                : `So far — ${totals.notFinal} ${totals.notFinal === 1 ? "answer is" : "answers are"} still being graded`}
            </div>
          </div>
        ) : (
          <p className="mb-8 text-[14px] leading-relaxed text-ink-3">
            Your answers are in. Results appear in Test history once they are released.
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <Button onClick={onExit}>Back to tests</Button>
        </div>
        <div className="mt-10 flex justify-center text-primary/60">
          <BrandMark size={22} />
        </div>
      </div>
    </div>
  );
};
