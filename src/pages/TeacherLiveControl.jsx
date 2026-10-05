import { useState, useEffect } from "react";
import { Radio, Users, Flag, Clock, StopCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { extendTest, stopTestNow } from "@/api/tests";
import {
  Bento,
  Conn,
  MetricCard,
  SectionHeader,
  StatusDot,
  TableShell,
  Td,
  Th,
} from "@/components/common";
import { NumberStepper } from "@/components/teacher-live-control/NumberStepper";
import { useToast } from "@/context/ToastContext";
import { LIVE_STUDENTS } from "@/data/tests";
import { Button } from "@/components/ui/button";

const TeacherLiveControl = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [running, setRunning] = useState(true);
  const [stopping, setStopping] = useState(false);
  const [students, setStudents] = useState(LIVE_STUDENTS);
  const [tick, setTick] = useState(12);
  const [remainingMinutes, setRemainingMinutes] = useState(23);
  const [extendBy, setExtendBy] = useState(10);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTick(12);
      setStudents((prev) =>
        prev.map((s) =>
          s.status === "active" && Math.random() > 0.9
            ? { ...s, status: "submitted", progress: 10 }
            : s,
        ),
      );
    }, 8000);
    const c = setInterval(() => setTick((x) => Math.max(1, x - 1)), 1000);
    const m = setInterval(
      () => setRemainingMinutes((min) => Math.max(0, min - 1)),
      60000,
    );
    return () => {
      clearInterval(t);
      clearInterval(c);
      clearInterval(m);
    };
  }, [running]);

  const stop = () => {
    setStopping(true);
    stopTestNow("demo-test").finally(() => {
      setRunning(false);
      setStopping(false);
      setStudents((prev) =>
        prev.map((s) =>
          s.status === "active"
            ? { ...s, status: "submitted", progress: 10 }
            : s,
        ),
      );
      toast.push("Test stopped — all students submitted", "info");
    });
  };

  const extend = async () => {
    try {
      await extendTest("demo-test", extendBy);
      setRemainingMinutes((min) => min + extendBy);
      toast.push(`Extended by ${extendBy} minutes`, "success");
    } catch (err) {
      toast.push(
        err?.message || "Couldn't extend the test — try again",
        "error",
      );
    }
  };

  const active = students.filter((s) => s.status === "active").length;
  const done = students.filter((s) => s.status === "submitted").length;
  const flagged = students.filter((s) => s.flags > 0).length;

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      {/* ── Live status banner — Vercel/Stripe style. Sets the visual
          anchor for the entire page. Only appears while live. ── */}
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
            {active} students working · {done} submitted · {remainingMinutes}{" "}
            min remaining
          </span>
          <span className="relative z-10 ml-auto">
            <Conn state="live" secs={tick} />
          </span>
        </div>
      )}

      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Physics · Grade 11A <span className="text-ink-3">/</span> Live test
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Newton's Laws <span className="text-ink-3">— Unit Test</span>
          </h1>
          <p className="mt-2 text-[14px] text-ink-2">
            {running
              ? "Students are working. You can extend or stop at any time."
              : "Test has been stopped. All answers submitted."}
          </p>
        </div>
      </div>

      <div className="bento mb-8">
        <MetricCard
          icon={Users}
          iconTone={active > 0 ? "primary" : "neutral"}
          label="Active now"
          value={active}
          unit="/ 32"
          delta="Working on the test"
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
          label="Time remaining"
          value={remainingMinutes}
          unit="min"
          delta="Since 18:00"
          deltaTone="success"
        />
      </div>

      <section className="mb-8">
        <SectionHeader label="Live roster · updates every 20s" />
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
            {students.map((s, i) => (
              <tr
                key={i}
                className="border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50"
              >
                <Td className="text-[13.5px] font-medium text-ink">{s.name}</Td>
                <Td className="text-right font-mono tabular-nums">
                  <div className="ml-auto flex items-center justify-end gap-2">
                    <span className="h-1 w-16 overflow-hidden rounded-full bg-rule">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-primary to-primary-2"
                        style={{ width: `${s.progress * 10}%` }}
                      />
                    </span>
                    <span>{s.progress}/10</span>
                  </div>
                </Td>
                <Td>
                  <StatusDot
                    tone={
                      s.status === "submitted"
                        ? "success"
                        : s.status === "flagged"
                          ? "danger"
                          : "primary"
                    }
                  >
                    {s.status === "submitted"
                      ? "Submitted"
                      : s.status === "flagged"
                        ? "Flagged"
                        : "Active"}
                  </StatusDot>
                </Td>
                <Td className="text-right font-mono">
                  {s.flags ? (
                    <span className="rounded-full bg-warning-dim px-2 py-0.5 text-[12px] font-semibold text-warning">
                      {s.flags}
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

      {running && (
        <Bento className="flex-row items-center gap-3 flex-wrap !py-4">
          <Button
            onClick={stop}
            disabled={stopping} variant="destructive"
          >
            <StopCircle size={14} />
            {stopping ? "Stopping…" : "Stop test for everyone"}
          </Button>
          <NumberStepper
            value={extendBy}
            onChange={setExtendBy}
            min={1}
            max={60}
            suffix="min"
          />
          <Button
            onClick={extend} variant="outline"
          >
            Extend
          </Button>
          <span className="ml-auto hidden font-mono text-[12px] font-medium text-ink-3 narrow:inline">
            Students will submit automatically when time runs out
          </span>
        </Bento>
      )}

      {!running && (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => navigate("/teacher/review")}
          >
            Review submissions →
          </Button>
          <Button
            onClick={() => setRunning(true)} variant="outline"
          >
            Restart test
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeacherLiveControl;
