import { useMemo, useState } from "react";
import { ModalShell } from "@/components/common/ModalShell";
import { Field, inputClass } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { publishTest } from "@/api/tests";
import { useToast } from "@/context/ToastContext";
import { validateQuestions } from "@/lib/questions";
import { formatDateTime, fromLocalInput, toLocalInput } from "@/lib/time";
import { cn } from "@/lib/cn";
import { DEFAULT_SETTINGS, RELEASE_LABELS } from "@/lib/testSettings";

const HOUR = 3_600_000;

// First full hour from now — a sensible default opening time.
const nextHour = () => Math.ceil((Date.now() + 5 * 60_000) / HOUR) * HOUR;

const Option = ({ active, onClick, title, body }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "w-full rounded-[var(--radius-container)] border px-4 py-3 text-left transition-colors",
      active
        ? "border-primary bg-primary-soft"
        : "border-rule-2 bg-surface hover:border-rule-3",
    )}
  >
    <div className="text-[14px] font-semibold text-ink">{title}</div>
    <div className="mt-0.5 text-[12.5px] leading-snug text-ink-2">{body}</div>
  </button>
);

const Toggle = ({ checked, onChange, title, body }) => (
  <label className="flex cursor-pointer items-start gap-3 py-2.5">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]"
    />
    <span>
      <span className="block text-[14px] font-medium text-ink">{title}</span>
      <span className="block text-[12.5px] leading-snug text-ink-2">{body}</span>
    </span>
  </label>
);

// Every variant is checked, not just the first — a personalized test can
// only publish when each student's own question set is valid.
const collectIssues = (test) => {
  const sets =
    test.mode === "personal"
      ? (test.variants ?? []).map((v) => ({ label: v.studentName, qs: v.questions }))
      : [{ label: null, qs: test.questionSet ?? [] }];
  return sets.flatMap(({ label, qs }) =>
    validateQuestions(qs).map((i) => ({
      key: `${label}-${i.index}-${i.message}`,
      text: `${label ? `${label} · ` : ""}${i.index >= 0 ? `Q${i.index + 1} ` : ""}${i.message}`,
    })),
  );
};

export const PublishTestModal = ({ test, open, onClose, onPublished }) => {
  const toast = useToast();
  const [when, setWhen] = useState("now"); // "now" | "schedule"
  const [from, setFrom] = useState(() => toLocalInput(nextHour()));
  const [until, setUntil] = useState(() =>
    toLocalInput(nextHour() + Math.max(2, Math.ceil((test?.config?.duration ?? 30) / 60) + 1) * HOUR),
  );
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const setSetting = (key) => (value) => setSettings((s) => ({ ...s, [key]: value }));

  const issues = useMemo(() => (test ? collectIssues(test) : []), [test]);

  if (!test) return null;

  const duration = test.config?.duration ?? 30;
  const fromMs = fromLocalInput(from);
  const untilMs = fromLocalInput(until);

  let scheduleError = null;
  if (when === "schedule") {
    if (Number.isNaN(fromMs) || Number.isNaN(untilMs)) scheduleError = "Pick both an opening and a closing time.";
    else if (fromMs < Date.now() - 60_000) scheduleError = "The opening time is in the past.";
    else if (untilMs - fromMs < duration * 60_000)
      scheduleError = `The window must be at least as long as the test (${duration} min).`;
  }

  const blocked = issues.length > 0 || Boolean(scheduleError);
  const questionCount = test.questions;

  const handlePublish = async () => {
    setBusy(true);
    try {
      await publishTest(
        test.id,
        {
          ...(when === "schedule" ? { availableFrom: fromMs, availableUntil: untilMs } : {}),
          settings,
        },
      );
      toast.push(
        when === "schedule"
          ? `Scheduled for ${formatDateTime(fromMs)}`
          : "Published — students can start now",
        "success",
      );
      onPublished?.();
      onClose();
    } catch (err) {
      toast.push(err?.message || "Couldn't publish — try again", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={busy ? () => {} : onClose}
      title={`Publish “${test.title}”`}
      maxWidth="520px"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={blocked || busy}>
            {busy ? "Publishing…" : when === "schedule" ? "Schedule test" : "Publish now"}
          </Button>
        </>
      }
    >
      <p className="mb-5 text-[13.5px] leading-relaxed text-ink-2">
        {questionCount} questions · {test.marks} marks · {duration} min ·{" "}
        {test.mode === "personal"
          ? `${test.variants?.length ?? 0} personalized variants`
          : "same test for the whole class"}
      </p>

      {issues.length > 0 && (
        <div
          role="alert"
          className="mb-5 rounded-[var(--radius-control)] border border-warning/25 bg-warning-dim px-4 py-3 text-[13px] text-warning"
        >
          <div className="mb-1 font-semibold">Fix these before publishing</div>
          <ul className="list-disc pl-4">
            {issues.slice(0, 6).map((i) => (
              <li key={i.key}>{i.text}</li>
            ))}
          </ul>
          {issues.length > 6 && <div className="mt-1">…and {issues.length - 6} more</div>}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2.5">
        <Option
          active={when === "now"}
          onClick={() => setWhen("now")}
          title="Open to students now"
          body="You stay in control: it runs until you stop it from Live test."
        />
        <Option
          active={when === "schedule"}
          onClick={() => setWhen("schedule")}
          title="Schedule a window"
          body="Opens and closes automatically. You can still start it early or stop it at any time."
        />
      </div>

      {when === "schedule" && (
        <div className="grid gap-x-4 narrow:grid-cols-2">
          <Field label="Available from">
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Available until">
            <input
              type="datetime-local"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              className={inputClass}
            />
          </Field>
          {scheduleError && (
            <p role="alert" className="text-[12.5px] text-danger narrow:col-span-2">
              {scheduleError}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 border-t border-rule pt-4">
        <div className="mb-2 text-[13px] font-semibold text-ink">Students see results</div>
        <div className="mb-3 flex flex-col gap-2">
          {Object.entries(RELEASE_LABELS).map(([value, label]) => (
            <Option
              key={value}
              active={settings.release === value}
              onClick={() => setSetting("release")(value)}
              title={label}
              body={
                value === "immediately"
                  ? "Each student sees their auto-graded score as soon as they submit."
                  : "Results stay hidden until the window closes or you stop the test, which helps stop answers being shared."
              }
            />
          ))}
        </div>

        <div className="mb-1 mt-4 text-[13px] font-semibold text-ink">Options</div>
        <div className="divide-y divide-rule">
          <Toggle
            checked={settings.aiGrading}
            onChange={setSetting("aiGrading")}
            title="Draft marks for written answers with AI"
            body="You review and can override every mark. Off: all written answers go straight to your manual grading queue."
          />
          <Toggle
            checked={settings.allowBack}
            onChange={setSetting("allowBack")}
            title="Let students go back to earlier questions"
            body="Off: one question at a time with no way back."
          />
        </div>
      </div>
    </ModalShell>
  );
};
