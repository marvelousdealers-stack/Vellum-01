import { useEffect, useMemo, useState } from "react";
import { Radio, Users, Flag, Clock, StopCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { extendTest, stopTestNow } from "@/api/tests";
import {
  Bento,
  Conn,
  EmptyState,
  MetricCard,
  PageError,
  PageLoading,
  SectionHeader,
  StatusDot,
  TableShell,
  Td,
  Th,
} from "@/components/common";
import { NumberStepper } from "@/components/teacher-live-control/NumberStepper";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { useTestRoster } from "@/hooks/useAttempts";
import { useTests } from "@/hooks/useTests";
import { getSettings, RELEASE_LABELS } from "@/lib/testSettings";
import { formatDateTime } from "@/lib/time";
import { Button } from "@/components/ui/button";

const LiveTestView = ({ test }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { setConfirmState } = useApp();
  const { data: roster = [], isLoading: rosterLoading, error: rosterError, refetch: refetchRoster } =
    useTestRoster(test.id);
  const [now, setNow] = useState(() => Date.now());
  const [stopping, setStopping] = useState(false);
  const [extendBy, setExtendBy] = useState(10);

  const running = test.status === "live";
  const ended = test.status === "completed";

  // Re-render for the countdown. The roster itself refreshes from the server
  // every 20 s (see useTestRoster).
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  // One row per student in the class; the server says who has started and how
  // far they are (answers themselves are never sent to the teacher here).
  const rows = useMemo(
    () =>
      roster.map(({ student, attempt }) => {
        const flagEvents = attempt?.flags.filter((f) => f.type === "tab-switch") ?? [];
        let status = "waiting";
        if (attempt?.status === "submitted") status = "submitted";
        else if (attempt) status = ended ? "submitting" : "working";
        return {
          name: student.name,
          status,
          answered: attempt?.progress.answered ?? 0,
          total: attempt?.progress.total ?? 0,
          flags: flagEvents.length,
          lastFlag: flagEvents.at(-1)?.at ?? null,
        };
      }),
    [roster, ended],
  );

  if (rosterLoading) return <PageLoading />;
  if (rosterError) return <PageError error={rosterError} onRetry={refetchRoster} />;

  const working = rows.filter((r) => r.status === "working" || r.status === "submitting").length;
  const done = rows.filter((r) => r.status === "submitted").length;
  const waiting = rows.filter((r) => r.status === "waiting").length;
  const flagged = rows.filter((r) => r.flags > 0).length;
  const closes = test.schedule?.availableUntil ?? null;
  const minutesLeft = closes ? Math.max(0, Math.ceil((closes - now) / 60_000)) : null;
  const settings = getSettings(test);

  const stop = () =>
    setConfirmState({
      title: `Stop "${test.title}" now?`,
      message:
        "Every student still working is submitted automatically within about 20 seconds.",
      confirmLabel: "Stop test",
      onConfirm: async () => {
        setStopping(true);
        try {
          await stopTestNow(test.id);
          toast.push("Test stopped — answers are being submitted", "info");
        } catch (err) {
          toast.push(err?.message || "Couldn't stop the test — try again", "error");
        } finally {
          setStopping(false);
        }
      },
    });

  const extend = async () => {
    try {
      await extendTest(test.id, extendBy);
      toast.push(`Extended by ${extendBy} minutes`, "success");
    } catch (err) {
      toast.push(err?.message || "Couldn't extend the test — try again", "error");
    }
  };

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      {running && (
        <div className="hero-glow gradient-border relative mb-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-bento)] border border-primary/30 bg-gradient-to-r from-primary-soft to-transparent px-5 py-3.5 shadow-[var(--shadow-card)]">
          <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-on-primary shadow-[var(--shadow-primary)]">
            <Radio size={15} />
          </span>
          <span className="relative z-10 inline-flex items-center gap-2 text-[12px] font-semibold text-primary">
            <span className="size-1.5 animate-beacon rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
            Test is live
          </span>
          <span className="relative z-10 text-[13px] text-ink-2">
            {working} working · {done} submitted ·{" "}
            {minutesLeft != null ? `${minutesLeft} min until it closes` : "open until you stop it"}
          </span>
          <span className="relative z-10 ml-auto">
            <Conn state="live" secs={20} />
          </span>
        </div>
      )}

      <div className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-3">
        {test.subject} · {test.cls} <span className="text-ink-3">/</span> Live test
      </div>

      <div className="mb-8 min-w-0">
        <h1 className="font-serif text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink tablet:text-[34px]">
          {test.title}
        </h1>
        <p className="mt-2 text-[14px] text-ink-2">
          {running
            ? "Students are working. You can extend or stop at any time."
            : "This test has ended."}
          {" "}
          Results: {RELEASE_LABELS[settings.release].toLowerCase()} ·{" "}
          {settings.aiGrading ? "AI drafts written marks" : "written answers graded by hand"}
        </p>
      </div>

      <div className="bento mb-8">
        <MetricCard
          icon={Users}
          iconTone={working > 0 ? "primary" : "neutral"}
          label="Working now"
          value={working}
          unit={`/ ${rows.length}`}
          delta="In the test"
          deltaTone="success"
        />
        <MetricCard
          icon={Users}
          iconTone="success"
          label="Submitted"
          value={done}
          delta="Answers received"
          deltaTone="success"
        />
        <MetricCard
          icon={Flag}
          iconTone={flagged > 0 ? "danger" : "neutral"}
          label="Flagged"
          value={flagged}
          delta="Tab switches detected"
          deltaTone={flagged > 0 ? "danger" : "success"}
        />
        <MetricCard
          icon={Clock}
          iconTone="warning"
          label={minutesLeft != null ? "Closes in" : "Not started"}
          value={minutesLeft != null ? minutesLeft : waiting}
          unit={minutesLeft != null ? "min" : `/ ${rows.length}`}
          delta={closes ? formatDateTime(closes) : "Haven't opened it yet"}
          deltaTone="success"
        />
      </div>

      <section className="mb-8">
        <SectionHeader label="Live roster" meta="refreshes as students work" />
        <TableShell>
          <thead>
            <tr className="border-b border-rule-2">
              <Th>Student</Th>
              <Th className="text-right">Progress</Th>
              <Th>Status</Th>
              <Th className="text-right">Flags</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.name}
                className="border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50"
              >
                <Td className="text-[13.5px] font-medium text-ink">{r.name}</Td>
                <Td className="text-right font-mono tabular-nums">
                  {r.total > 0 ? (
                    <div className="ml-auto flex items-center justify-end gap-2">
                      <span className="h-1 w-16 overflow-hidden rounded-full bg-rule">
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-primary to-primary-2"
                          style={{ width: `${(r.answered / r.total) * 100}%` }}
                        />
                      </span>
                      <span>
                        {r.answered}/{r.total}
                      </span>
                    </div>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  <StatusDot
                    tone={
                      r.status === "submitted"
                        ? "success"
                        : r.status === "working"
                          ? "primary"
                          : r.status === "submitting"
                            ? "warning"
                            : "muted"
                    }
                  >
                    {
                      {
                        submitted: "Submitted",
                        working: "Working",
                        submitting: "Submitting…",
                        waiting: "Not started",
                      }[r.status]
                    }
                  </StatusDot>
                </Td>
                <Td className="text-right font-mono">
                  {r.flags ? (
                    <span
                      title={r.lastFlag ? `Last: ${formatDateTime(r.lastFlag)}` : undefined}
                      className="rounded-full bg-warning-dim px-2 py-0.5 text-[12px] font-semibold text-warning"
                    >
                      {r.flags}
                    </span>
                  ) : (
                    "—"
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </section>

      {running ? (
        <Bento className="flex-row flex-wrap items-center gap-3 !py-4">
          <Button onClick={stop} disabled={stopping} variant="destructive">
            <StopCircle size={14} />
            {stopping ? "Stopping…" : "Stop test for everyone"}
          </Button>
          <NumberStepper value={extendBy} onChange={setExtendBy} min={1} max={60} suffix="min" />
          <Button onClick={extend} variant="outline">
            Extend
          </Button>
          <span className="ml-auto hidden text-[13px] font-medium text-ink-3 narrow:inline">
            Students submit automatically when their time runs out
          </span>
        </Bento>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate("/teacher/review")}>Review submissions →</Button>
          <Button onClick={() => navigate("/teacher/drafts")} variant="outline">
            Back to tests
          </Button>
        </div>
      )}
    </div>
  );
};

const TeacherLiveControl = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { data: tests, isLoading, error, refetch } = useTests();
  const liveTests = tests.filter((t) => t.status === "live");
  const requested = params.get("test");

  if (isLoading) return <PageLoading />;
  if (error) return <PageError error={error} onRetry={refetch} />;

  if (requested) {
    const test = tests.find((t) => t.id === requested);
    if (test && (test.status === "live" || test.status === "completed")) {
      return <LiveTestView key={test.id} test={test} />;
    }
    return (
      <EmptyState
        title={test ? "This test isn't live" : "Test not found"}
        body={
          test
            ? "It hasn't opened yet, or hasn't been published."
            : "It may have been deleted."
        }
        action="Back to tests"
        onAction={() => navigate("/teacher/drafts")}
      />
    );
  }

  if (liveTests.length === 1) return <LiveTestView key={liveTests[0].id} test={liveTests[0]} />;

  if (liveTests.length === 0) {
    return (
      <EmptyState
        title="No test is live right now"
        body="Publish a test, or start a scheduled one early, and you can monitor it here."
        action="Go to tests"
        onAction={() => navigate("/teacher/drafts")}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <h1 className="mb-2 font-serif text-[28px] font-semibold tracking-[-0.02em] text-ink tablet:text-[34px]">
        Live tests
      </h1>
      <p className="mb-6 text-[14px] text-ink-2">More than one test is open. Pick one to monitor.</p>
      <Bento>
        <ul>
          {liveTests.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-3 border-b border-rule py-4 last:border-b-0"
            >
              <div>
                <div className="text-[14.5px] font-medium text-ink">{t.title}</div>
                <div className="text-[12.5px] text-ink-3">
                  {t.subject} · {t.cls} · {t.questions} questions
                </div>
              </div>
              <Button onClick={() => setParams({ test: t.id })}>Monitor</Button>
            </li>
          ))}
        </ul>
      </Bento>
    </div>
  );
};

export default TeacherLiveControl;
