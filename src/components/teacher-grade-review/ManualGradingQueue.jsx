import { useState, useMemo, Fragment } from "react";
import { CheckCircle2, Sparkles, FileEdit, Clock } from "lucide-react";
import { EmptyState, MetricCard, TableShell, Td, Th } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { GRADE_QUEUE } from "@/data/tests";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// MANUAL GRADING QUEUE
// ═══════════════════════════════════════════════════════════════
export const ManualGradingQueue = ({ onEnableAI }) => {
  const toast = useToast();
  const [expanded, setExpanded] = useState(null);
  const [scores, setScores] = useState({});
  const [remarks, setRemarks] = useState({});

  const queue = useMemo(
    () =>
      GRADE_QUEUE.filter((g) => !g.reviewed).map((g) => ({
        ...g,
        aiScore: null,
        confidence: null,
      })),
    [],
  );

  return (
    <div>
      <div className="bento mb-10">
        <MetricCard
          icon={CheckCircle2}
          iconTone="warning"
          label="In queue"
          value={queue.length}
          delta="Awaiting your mark"
          deltaTone="warning"
        />
        <MetricCard
          icon={Sparkles}
          iconTone="neutral"
          label="Graded by AI"
          value={0}
          delta="AI grading is off"
          deltaTone="warning"
        />
        <MetricCard
          icon={FileEdit}
          iconTone="primary"
          label="Written answers"
          value={12}
          delta="Across 3 tests"
          deltaTone="success"
        />
        <MetricCard
          icon={Clock}
          iconTone="neutral"
          label="Average time"
          value={2}
          unit="min"
          delta="Per answer"
          deltaTone="success"
        />
      </div>

      <section className="mb-8">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-rule-2 pb-3.5">
          <h2 className="font-display text-[15px] font-semibold tracking-[-0.01em] text-ink">
            Manual queue
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[12px] text-ink-3">
              AI grading is off for this test
            </span>
            <Button
              onClick={onEnableAI} variant="outline" size="sm"
            >
              Re-enable AI grading
            </Button>
          </div>
        </div>

        {queue.length === 0 ? (
          <EmptyState
            title="All caught up"
            body="Every written answer has been graded. Nothing in the manual queue."
          />
        ) : (
          <TableShell>
            <thead>
              <tr className="border-b border-rule-2">
                <Th>Student</Th>
                <Th>Roll no</Th>
                <Th>Test</Th>
                <Th className="text-right">Max marks</Th>
                <Th className="text-right">Flags</Th>
                <Th className="w-12"></Th>
              </tr>
            </thead>
            <tbody>
              {queue.map((g) => {
                const isOpen = expanded === g.id;
                const displayed = scores[g.id] ?? "";
                return (
                  <Fragment key={g.id}>
                    <tr
                      onClick={() => setExpanded(isOpen ? null : g.id)}
                      className={cn(
                        "cursor-pointer border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50",
                        isOpen && "bg-raised/60",
                      )}
                    >
                      <Td className="text-[13.5px] font-medium text-ink">
                        {g.student}
                      </Td>
                      <Td className="font-mono text-[12px]">{g.roll}</Td>
                      <Td>{g.test}</Td>
                      <Td className="text-right font-mono tabular-nums">
                        {g.maxScore}
                      </Td>
                      <Td className="text-right font-mono">
                        {g.flags ? (
                          <span className="rounded-full bg-warning-dim px-2 py-0.5 text-[12px] font-semibold text-warning">
                            {g.flags}
                          </span>
                        ) : (
                          "—"
                        )}
                      </Td>
                      <Td className="text-right text-ink-3">
                        {isOpen ? "↓" : "→"}
                      </Td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td
                          colSpan={6}
                          className="border-b border-rule bg-surface p-6 tablet:p-8"
                        >
                          <div className="mx-auto max-w-[800px]">
                            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <div className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink">
                                  {g.student}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-2 text-[12.5px] text-ink-3">
                                  <span className="font-mono">
                                    Roll {g.roll}
                                  </span>
                                  <span className="text-ink-3">·</span>
                                  <span>{g.test}</span>
                                  <span className="text-ink-3">·</span>
                                  <span className="font-mono">{g.date}</span>
                                </div>
                              </div>
                              <span className="rounded-full border border-rule-2 bg-raised px-2.5 py-1 text-[12px] font-medium text-ink-3">
                                Manual grading
                              </span>
                            </div>

                            <div className="mb-5 rounded-[var(--radius-container)] border border-rule bg-sunken px-4 py-3.5">
                              <div className="mb-1.5 text-[12px] font-semibold text-ink-3">
                                Question
                              </div>
                              <div className="font-display text-[15px] leading-snug text-ink-2">
                                {g.question}
                              </div>
                              <div className="mb-1.5 mt-4 text-[12px] font-semibold text-ink-3">
                                Student's answer
                              </div>
                              <div className="border-l-2 border-primary pl-3 font-display text-[16px] leading-relaxed text-ink">
                                {g.answer}
                              </div>
                            </div>

                            <div className="mb-4 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
                              <span className="text-[12.5px] font-medium text-ink-3">
                                Your mark
                              </span>
                              <input
                                type="text"
                                inputMode="decimal"
                                placeholder="—"
                                value={displayed}
                                onChange={(e) => {
                                  const v = e.target.value.replace(
                                    /[^0-9.]/g,
                                    "",
                                  );
                                  setScores((prev) => ({ ...prev, [g.id]: v }));
                                }}
                                className="w-[80px] rounded-[var(--radius-control)] border border-rule-2 bg-sunken px-3 py-2 text-center font-display text-[17px] font-semibold tabular-nums text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                              />
                              <span className="text-[13.5px] text-ink-3">
                                / {g.maxScore}
                              </span>
                              <Button variant="outline" size="sm" className="ml-auto">
                                Open rubric
                              </Button>
                            </div>

                            <textarea
                              rows={2}
                              placeholder="Add a remark for the student…"
                              value={remarks[g.id] || ""}
                              onChange={(e) =>
                                setRemarks((prev) => ({
                                  ...prev,
                                  [g.id]: e.target.value,
                                }))
                              }
                              className="mb-4 w-full resize-y rounded-[var(--radius-control)] border border-rule-2 bg-sunken px-3 py-2.5 text-[13.5px] leading-relaxed text-ink outline-none transition-all placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />

                            <div className="flex flex-wrap gap-2 border-t border-rule pt-4">
                              <Button
                                onClick={() =>
                                  toast.push(
                                    `${g.student} graded at ${displayed || "—"} / ${g.maxScore}`,
                                    "success",
                                  )
                                }
                              >
                                Save mark &amp; move to next
                              </Button>
                              <Button
                                onClick={() =>
                                  toast.push("Saved without releasing", "info")
                                } variant="outline"
                              >
                                Save without releasing
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </TableShell>
        )}
      </section>
    </div>
  );
};
