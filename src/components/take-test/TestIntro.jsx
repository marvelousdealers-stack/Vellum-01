import { Clock, FileText, ListChecks } from "lucide-react";
import { BrandMark } from "@/components/common";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/time";
import { getSettings } from "@/lib/testSettings";

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-[var(--radius-container)] border border-rule bg-surface px-4 py-3">
    <Icon size={16} className="shrink-0 text-primary" />
    <div>
      <div className="font-display text-[18px] font-semibold tabular-nums leading-tight text-ink">
        {value}
      </div>
      <div className="text-[12px] text-ink-3">{label}</div>
    </div>
  </div>
);

// Shown before an attempt starts (or resumes). Starting is a deliberate
// click, so the timer never begins just because the page loaded.
export const TestIntro = ({
  test,
  questionCount,
  marks,
  attempt,
  starting,
  openError,
  onBegin,
  onExit,
}) => {
  const resuming = attempt?.status === "in_progress";
  const minutesLeft = resuming
    ? Math.max(0, Math.ceil((attempt.deadline - Date.now()) / 60_000))
    : null;
  const closes = test.schedule?.availableUntil;

  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-4 py-10">
      <div className="w-full max-w-[560px]">
        <div className="mb-6 flex items-center gap-3 text-primary">
          <BrandMark size={28} />
          <span className="text-[13px] font-medium text-ink-3">
            {test.subject} · {test.cls}
          </span>
        </div>
        <h1 className="mb-6 font-serif text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink tablet:text-[36px]">
          {test.title}
        </h1>

        <div className="mb-6 grid gap-3 narrow:grid-cols-3">
          <Stat icon={Clock} label="Time limit" value={`${test.config?.duration ?? 30} min`} />
          <Stat icon={ListChecks} label="Questions" value={questionCount} />
          <Stat icon={FileText} label="Total marks" value={marks} />
        </div>

        <ul className="mb-8 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-ink-2">
          <li>The timer starts when you press the button and keeps running if you leave the page.</li>
          <li>Answers save automatically. The test submits itself when time runs out.</li>
          <li>Switching tabs or windows is recorded and shown to your teacher.</li>
          <li>Your teacher can stop the test for everyone; your answers so far are submitted.</li>
          {!getSettings(test).allowBack && (
            <li>You can't go back to earlier questions, so answer each one before moving on.</li>
          )}
          {closes && <li>This test closes at {formatDateTime(closes)}.</li>}
        </ul>

        {resuming && (
          <p className="mb-4 rounded-[var(--radius-control)] border border-primary/25 bg-primary-soft px-4 py-3 text-[13.5px] text-ink">
            You already started this test — about {minutesLeft} min left.
          </p>
        )}
        {openError && (
          <p role="alert" className="mb-4 text-[13.5px] text-danger">{openError}</p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onBegin} disabled={starting || Boolean(openError)}>
            {starting ? "Starting…" : resuming ? "Resume test" : "Begin test"}
          </Button>
          <Button variant="ghost" onClick={onExit}>
            Back to tests
          </Button>
        </div>
      </div>
    </div>
  );
};
