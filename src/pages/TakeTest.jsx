import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LIVE_STATUS_INTERVAL_MS, getLiveStatus } from "@/api/tests";
import { BrandMark, Conn } from "@/components/common";
import { AutoSaveIndicator } from "@/components/take-test/AutoSaveIndicator";
import { QuestionNavigator } from "@/components/take-test/QuestionNavigator";
import { StopTestOverlay } from "@/components/take-test/StopTestOverlay";
import { GENERATED_QUESTIONS } from "@/data/tests";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

const DEFAULT_DURATION_MINUTES = 30;

const TakeTest = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [qIndex, setQIndex] = useState(1);
  const [seconds, setSeconds] = useState(DEFAULT_DURATION_MINUTES * 60);
  const [flags, setFlags] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [conn, setConn] = useState("live");
  const [answered, setAnswered] = useState(new Set());
  const [saved, setSaved] = useState(true);

  const total = GENERATED_QUESTIONS.length;
  const locked = stopped;
  const q = GENERATED_QUESTIONS[qIndex - 1];
  const isText = q.type === "Short answer" || q.type === "Numerical";

  useEffect(() => {
    if (locked) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [locked]);

  useEffect(() => {
    if (locked) return;
    let cancelled = false;
    const poll = async () => {
      setConn("polling");
      try {
        const status = await getLiveStatus("demo-test");
        if (!cancelled && status.stopped) setStopped(true);
      } finally {
        if (!cancelled) setConn("live");
      }
    };
    const t = setInterval(poll, LIVE_STATUS_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [locked]);

  useEffect(() => {
    if (locked) return;
    const onVis = () => {
      if (document.hidden) setFlags((f) => f + 1);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [locked]);

  useEffect(() => {
    if (selected != null || textAnswer)
      setAnswered((prev) => new Set(prev).add(qIndex));
  }, [selected, textAnswer, qIndex]);

  useEffect(() => {
    if (selected == null && !textAnswer) return;
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 700);
    return () => clearTimeout(t);
  }, [selected, textAnswer]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const warn = seconds < 5 * 60;
  const exit = () => navigate("/student");

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      {/* ── Glass top bar ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-rule bg-bg/80 px-4 py-3 backdrop-blur-xl tablet:px-8">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="grid size-7 shrink-0 place-items-center text-primary">
            <BrandMark size={28} />
          </span>
          <div className="min-w-0 truncate font-display text-[14.5px] font-semibold tracking-[-0.01em] text-ink">
            Newton's Laws — Unit Test
          </div>
          <span className="hidden shrink-0 rounded-full border border-rule-2 bg-surface/60 px-2 py-0.5 text-[12px] font-medium text-ink-2 narrow:inline">
            Physics · 11A
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2.5 font-mono text-[12px] font-medium text-ink-3 tablet:flex">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2 py-1",
                flags > 0
                  ? "border-danger/30 bg-danger-dim text-danger"
                  : "border-rule bg-surface/60 text-ink-3",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  flags > 0 ? "bg-danger" : "bg-success",
                )}
              />
              {flags === 0
                ? "Focus held"
                : `${flags} tab switch${flags > 1 ? "es" : ""}`}
            </span>
            <Conn state={conn} secs={20} />
          </div>
          <div
            className={cn(
              "font-display text-[18px] font-semibold tabular-nums tracking-[-0.01em] transition-colors",
              warn ? "text-danger" : "text-ink",
            )}
          >
            {mm}:{ss}
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10 tablet:px-8 tablet:py-14">
        <div className="w-full max-w-[680px]">
          {/* Progress — gradient fill */}
          <div className="mb-8 flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-0.5 flex-1 rounded-sm transition-colors duration-300",
                  i + 1 < qIndex
                    ? "bg-primary/60"
                    : i + 1 === qIndex
                      ? "bg-gradient-to-r from-primary to-primary-2 shadow-[0_0_8px_var(--color-primary-dim)]"
                      : "bg-rule",
                )}
              />
            ))}
          </div>

          <div className="mb-4 flex items-center justify-between font-mono text-[12px] font-medium text-ink-3">
            <span>
              Question {qIndex} of {total} · {q.type}
            </span>
            <span>{q.marks} marks</span>
          </div>

          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <AutoSaveIndicator saved={saved} />
            <QuestionNavigator
              total={total}
              current={qIndex}
              answered={answered}
              onJump={(n) => {
                setQIndex(n);
                setSelected(null);
                setTextAnswer("");
              }}
            />
          </div>

          <div className="mb-8 font-display text-[26px] leading-snug tracking-[-0.015em] text-ink tablet:text-[30px]">
            {q.text}
          </div>

          {!isText && q.options && (
            <div className="flex flex-col gap-2">
              {q.options.map((o, i) => (
                <button
                  key={i}
                  disabled={locked}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-[var(--radius-container)] border bg-surface px-5 py-4 text-left text-[15px] text-ink transition-all duration-200 disabled:cursor-not-allowed",
                    selected === i
                      ? "border-primary bg-primary-soft shadow-[var(--shadow-primary)]"
                      : "border-rule-2 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-raised)]",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6.5 shrink-0 place-items-center rounded-full font-mono text-[12px] font-semibold transition-all duration-200",
                      selected === i
                        ? "bg-primary text-on-primary"
                        : "bg-raised group-hover:bg-primary-dim group-hover:text-primary",
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{o}</span>
                </button>
              ))}
            </div>
          )}

          {isText && (
            <textarea
              disabled={locked}
              placeholder="Write your answer here…"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              className="min-h-[180px] w-full resize-y rounded-[var(--radius-container)] border border-rule-2 bg-surface px-4 py-3.5 text-[15px] leading-relaxed text-ink outline-none transition-all placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed"
            />
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
            <Button
              disabled={qIndex === 1 || locked}
              onClick={() => {
                setQIndex(qIndex - 1);
                setSelected(null);
                setTextAnswer("");
              }} variant="ghost"
            >
              ← Previous
            </Button>
            <span className="hidden font-mono text-[12px] font-medium text-ink-3 narrow:inline">
              {isText
                ? textAnswer
                  ? "✓ Answer recorded"
                  : "Type your answer"
                : selected == null
                  ? "Select an answer"
                  : "✓ Answer recorded"}
            </span>
            <Button
              disabled={locked}
              onClick={() => {
                if (qIndex === total) exit();
                else {
                  setQIndex(qIndex + 1);
                  setSelected(null);
                  setTextAnswer("");
                }
              }}
            >
              {qIndex === total ? "Submit test" : "Next →"}
            </Button>
          </div>
        </div>
      </main>

      <StopTestOverlay
        visible={stopped}
        onForceSubmit={exit}
        reason="The teacher has stopped this test for everyone."
      />
    </div>
  );
};

export default TakeTest;
