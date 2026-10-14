import { useState, useMemo, Fragment } from "react";
import { CheckCircle2, AlertTriangle, Flag, Search as SearchIcon } from "lucide-react";
import { Chip, FilterButton, MetricCard, PageError, PageLoading, StatusDot, TableShell, Td, Th, Scope } from "@/components/common";
import { GradingDetailPanel } from "@/components/teacher-grade-review/GradingDetailPanel";
import { ManualGradingQueue } from "@/components/teacher-grade-review/ManualGradingQueue";
import { useToast } from "@/context/ToastContext";
import { approveGrades, reviewGrade } from "@/api/grades";
import { useGradeQueue } from "@/hooks/useGrading";
import { usePersistentState } from "@/hooks/usePersistentState";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

const CONF_RANK = { low: 0, med: 1, high: 2 };

const CONF_LABEL = { low: "Low", med: "Medium", high: "High" };

const TeacherGradeReview = () => {
  const toast = useToast();
  const [view, setView] = useState("review"); // "review" (AI drafts) | "manual"
  const { data: queue = [], isLoading, error, refetch } = useGradeQueue();
  const aiItems = useMemo(() => queue.filter((g) => !g.manual), [queue]);
  const manualItems = useMemo(() => queue.filter((g) => g.manual), [queue]);
  const manualPending = manualItems.filter((g) => g.status !== "reviewed").length;
  const [search, setSearch] = usePersistentState(
    "vellum.gradeReview.search",
    "",
  );
  const [filter, setFilter] = usePersistentState(
    "vellum.gradeReview.filter",
    "pending",
  );
  const [sortBy, setSortBy] = usePersistentState(
    "vellum.gradeReview.sortBy",
    "confidence",
  );
  const [sortDir, setSortDir] = usePersistentState(
    "vellum.gradeReview.sortDir",
    "asc",
  );
  const [groupBy, setGroupBy] = usePersistentState(
    "vellum.gradeReview.groupBy",
    "question",
  );
  const [expanded, setExpanded] = useState(null);
  const [approving, setApproving] = useState(false);

  const isReviewed = (g) => g.status === "reviewed";

  const filtered = useMemo(() => {
    let rows = [...aiItems];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.student.toLowerCase().includes(q) ||
          r.roll.toLowerCase().includes(q) ||
          r.test.toLowerCase().includes(q),
      );
    }
    if (filter === "pending") rows = rows.filter((r) => !isReviewed(r));
    if (filter === "low") rows = rows.filter((r) => r.confidence === "low");
    if (filter === "high") rows = rows.filter((r) => r.confidence === "high");
    if (filter === "reviewed") rows = rows.filter(isReviewed);
    if (filter === "flagged") rows = rows.filter((r) => r.flags > 0);
    rows.sort((a, b) => {
      let va, vb;
      if (sortBy === "confidence") {
        va = CONF_RANK[a.confidence];
        vb = CONF_RANK[b.confidence];
      } else if (sortBy === "student") {
        va = a.student;
        vb = b.student;
      } else if (sortBy === "score") {
        va = a.score;
        vb = b.score;
      } else {
        va = a.test;
        vb = b.test;
      }
      if (typeof va === "string")
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return rows;
  }, [aiItems, search, filter, sortBy, sortDir]);

  const groupedRows = useMemo(() => {
    if (groupBy !== "student") return null;
    const map = new Map();
    filtered.forEach((g) => {
      const key = g.student + "::" + g.test;
      if (!map.has(key))
        map.set(key, {
          key,
          student: g.student,
          roll: g.roll,
          test: g.test,
          date: g.date,
          rows: [],
        });
      map.get(key).rows.push(g);
    });
    return [...map.values()].map((grp) => {
      const totalScore = grp.rows.reduce((s, r) => s + (r.score ?? 0), 0);
      const totalMax = grp.rows.reduce((s, r) => s + r.maxScore, 0);
      const totalFlags = grp.rows.reduce((s, r) => s + r.flags, 0);
      const worstConfidence = grp.rows.reduce(
        (worst, r) =>
          CONF_RANK[r.confidence] < CONF_RANK[worst] ? r.confidence : worst,
        "high",
      );
      const reviewedCount = grp.rows.filter(isReviewed).length;
      return {
        ...grp,
        totalScore,
        totalMax,
        totalFlags,
        worstConfidence,
        reviewedCount,
        allReviewed: reviewedCount === grp.rows.length,
      };
    });
  }, [filtered, groupBy]);

  const pendingTotal = aiItems.filter((g) => !isReviewed(g)).length;
  const lowTotal = aiItems.filter((g) => g.confidence === "low" && !isReviewed(g)).length;
  const reviewedTotal = aiItems.filter(isReviewed).length;
  const flaggedTotal = aiItems.filter((g) => g.flags > 0 && !isReviewed(g)).length;
  const progressPct = aiItems.length ? Math.round((reviewedTotal / aiItems.length) * 100) : 0;
  const testCount = new Set(aiItems.map((g) => g.testId)).size;
  const approvable = aiItems.filter((g) => g.status === "pending" && g.confidence === "high");

  // Saves one mark. Throws are shown as a toast and re-thrown so a panel
  // keeps its inputs instead of closing.
  const saveMark = async (g, marks, remark, final = true) => {
    try {
      await reviewGrade(g.attemptId, g.questionId, { marks, feedback: remark, final });
      toast.push(
        final ? `${g.student} graded at ${marks} / ${g.maxScore}` : "Saved as a draft",
        final ? "success" : "info",
      );
      return true;
    } catch (err) {
      toast.push(err?.message || "Couldn't save that mark — try again", "error");
      return false;
    }
  };
  const handleSave = async (g, score, remark, final) => {
    if ((await saveMark(g, score, remark, final)) && final) setExpanded(null);
  };
  const handleSaveGrouped = (g, score, remark, final) => saveMark(g, score, remark, final);

  const bulkApprove = async () => {
    setApproving(true);
    try {
      const { approved } = await approveGrades(
        approvable.map((g) => ({ attemptId: g.attemptId, questionId: g.questionId })),
      );
      toast.push(`Approved ${approved} high-confidence ${approved === 1 ? "grade" : "grades"}`, "success");
    } catch (err) {
      toast.push(err?.message || "Couldn't approve — try again", "error");
    } finally {
      setApproving(false);
    }
  };

  if (isLoading) return <PageLoading />;
  if (error) return <PageError error={error} onRetry={refetch} />;

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-3">
        <Scope /> <span className="text-ink-3">/</span> Grade review
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[28px] font-semibold tablet:text-[34px] leading-[1.1] tracking-[-0.02em] text-ink">
            Review <span className="text-ink-3">grades</span>
          </h1>
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
            {view === "review"
              ? aiItems.length === 0
                ? "No AI-graded answers yet. They appear here once students submit."
                : `${pendingTotal} AI-graded ${pendingTotal === 1 ? "answer" : "answers"} awaiting your review across ${testCount} ${testCount === 1 ? "test" : "tests"}. Students only see a mark once you've approved it.`
              : "These tests have AI grading off, so every written answer waits here for your mark."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {[
            ["review", "AI-graded"],
            ["manual", `Manual queue${manualPending ? ` (${manualPending})` : ""}`],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                setView(id);
                setExpanded(null);
              }}
              className={cn(
                "rounded-[var(--radius-control)] border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-200",
                view === id
                  ? "border-primary bg-primary text-on-primary shadow-[var(--shadow-primary)]"
                  : "border-rule-2 text-ink-2 hover:border-rule-3 hover:bg-raised hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "manual" && <ManualGradingQueue items={manualItems} onSave={saveMark} />}

      {view === "review" && (
        <>
          <div className="bento mb-8">
            <MetricCard
              icon={CheckCircle2}
              iconTone={pendingTotal > 0 ? "warning" : "success"}
              label="Pending review"
              value={pendingTotal}
              delta={`Across ${testCount} ${testCount === 1 ? "test" : "tests"}`}
              deltaTone="success"
            />
            <MetricCard
              icon={AlertTriangle}
              iconTone="danger"
              label="Low confidence"
              value={lowTotal}
              delta="Needs your eye first"
              deltaTone="danger"
            />
            <MetricCard
              icon={Flag}
              iconTone="warning"
              label="Flagged"
              value={flaggedTotal}
              delta="Anti-cheat events"
              deltaTone="warning"
            />
            <MetricCard
              icon={CheckCircle2}
              iconTone="primary"
              label="Reviewed"
              value={`${reviewedTotal}/${aiItems.length}`}
              delta={`${progressPct}% complete`}
              deltaTone="success"
            />
          </div>

          {/* Filter rail — Tesla-style button dropdowns */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <label className="flex h-[52px] min-w-[240px] flex-1 items-center gap-2.5 rounded-[var(--radius-control)] border border-rule-2 bg-surface px-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 narrow:max-w-[360px]">
              <SearchIcon size={14} className="shrink-0 text-ink-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, roll no, or test…"
                className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3"
              />
            </label>

            <FilterButton
              label="Status"
              value={
                filter === "all"
                  ? "All"
                  : filter === "pending"
                    ? `Pending (${pendingTotal})`
                    : filter === "low"
                      ? "Low confidence"
                      : filter === "flagged"
                        ? "Flagged"
                        : "Reviewed"
              }
              active={filter !== "all"}
              onClick={() => {}}
            />
            <FilterButton
              label="Group by"
              value={groupBy === "student" ? "Student" : "Question"}
              onClick={() => {}}
            />

            <div className="ml-auto flex items-center gap-3 text-[13px] font-medium text-ink-3">
              <span>{progressPct}% reviewed</span>
              <div className="h-1.5 w-[100px] overflow-hidden rounded-full bg-rule">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filter chips below the rail for quick switching */}
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <Chip
              active={filter === "pending"}
              onClick={() => setFilter("pending")}
            >
              Pending ({pendingTotal})
            </Chip>
            <Chip active={filter === "low"} onClick={() => setFilter("low")}>
              Low confidence ({lowTotal})
            </Chip>
            <Chip
              active={filter === "flagged"}
              onClick={() => setFilter("flagged")}
            >
              Flagged ({flaggedTotal})
            </Chip>
            <Chip
              active={filter === "reviewed"}
              onClick={() => setFilter("reviewed")}
            >
              Reviewed ({reviewedTotal})
            </Chip>
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </Chip>
            <span className="mx-2 h-4 w-px bg-rule-2" />
            <Chip
              active={groupBy === "question"}
              onClick={() => {
                setGroupBy("question");
                setExpanded(null);
              }}
            >
              By question
            </Chip>
            <Chip
              active={groupBy === "student"}
              onClick={() => {
                setGroupBy("student");
                setExpanded(null);
              }}
            >
              By student
            </Chip>
          </div>

          <TableShell>
            <thead>
              <tr className="border-b border-rule-2">
                <Th>Student</Th>
                <Th>Roll no</Th>
                <Th>Test</Th>
                <Th className="text-right">AI score</Th>
                <Th>Confidence</Th>
                <Th>Status</Th>
                <Th className="text-right">Flags</Th>
                <Th className="w-10"></Th>
              </tr>
            </thead>
            <tbody>
              {(groupBy === "student" ? groupedRows : filtered).length ===
                0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-[13px] text-ink-3"
                  >
                    No submissions match these filters.
                  </td>
                </tr>
              )}

              {groupBy === "question" &&
                filtered.map((g) => {
                  const isOpen = expanded === g.id;
                  const displayedScore = g.score;
                  const tone = isReviewed(g) ? "success" : "warning";
                  const label = isReviewed(g) ? "Reviewed" : "Pending";
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
                        <Td className="text-right font-mono tabular-nums text-ink">
                          {displayedScore} / {g.maxScore}
                        </Td>
                        <Td>
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-2">
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                g.confidence === "high"
                                  ? "bg-success"
                                  : g.confidence === "med"
                                    ? "bg-warning"
                                    : "bg-danger",
                              )}
                            />
                            {CONF_LABEL[g.confidence]}
                          </span>
                        </Td>
                        <Td>
                          <StatusDot tone={tone}>{label}</StatusDot>
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
                          <td colSpan={8} className="p-0">
                            <GradingDetailPanel
                              g={g}
                              onClose={() => setExpanded(null)}
                              onSave={(score, remark, final) =>
                                handleSave(g, score, remark, final)
                              }
                            />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}

              {groupBy === "student" &&
                groupedRows.map((grp) => {
                  const isOpen = expanded === grp.key;
                  return (
                    <Fragment key={grp.key}>
                      <tr
                        onClick={() => setExpanded(isOpen ? null : grp.key)}
                        className={cn(
                          "cursor-pointer border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50",
                          isOpen && "bg-raised/60",
                        )}
                      >
                        <Td className="text-[13.5px] font-medium text-ink">
                          {grp.student}
                        </Td>
                        <Td className="font-mono text-[12px]">{grp.roll}</Td>
                        <Td>{grp.test}</Td>
                        <Td className="text-right font-mono tabular-nums text-ink">
                          {grp.totalScore} / {grp.totalMax}
                        </Td>
                        <Td>
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-2">
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                grp.worstConfidence === "high"
                                  ? "bg-success"
                                  : grp.worstConfidence === "med"
                                    ? "bg-warning"
                                    : "bg-danger",
                              )}
                            />
                            {CONF_LABEL[grp.worstConfidence]}
                          </span>
                        </Td>
                        <Td>
                          <StatusDot
                            tone={grp.allReviewed ? "success" : "warning"}
                          >
                            {grp.allReviewed
                              ? "Reviewed"
                              : `${grp.reviewedCount} / ${grp.rows.length} reviewed`}
                          </StatusDot>
                        </Td>
                        <Td className="text-right font-mono">
                          {grp.totalFlags ? (
                            <span className="rounded-full bg-warning-dim px-2 py-0.5 text-[12px] font-semibold text-warning">
                              {grp.totalFlags}
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
                            colSpan={8}
                            className="border-b border-rule bg-surface p-0"
                          >
                            <div className="bg-surface">
                              <div className="px-6 pt-5 font-display text-[13.5px] font-semibold text-ink-2 tablet:px-12">
                                {grp.student}'s full submission —{" "}
                                {grp.rows.length}{" "}
                                {grp.rows.length === 1
                                  ? "question"
                                  : "questions"}
                              </div>
                              {grp.rows.map((g, i) => (
                                <div key={g.id}>
                                  <div className="px-6 pt-4 text-[12px] font-semibold text-ink-3 tablet:px-12">
                                    Question {i + 1} of {grp.rows.length}
                                  </div>
                                  <GradingDetailPanel
                                    g={g}
                                    showClose={false}
                                    onClose={() => {}}
                                    onSave={(score, remark, final) =>
                                      handleSaveGrouped(g, score, remark, final)
                                    }
                                  />
                                </div>
                              ))}
                              <div className="flex justify-end px-6 py-5 tablet:px-12">
                                <Button
                                  onClick={() => setExpanded(null)} variant="outline"
                                >
                                  Close submission
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

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={bulkApprove} disabled={approving || approvable.length === 0}>
              {approving
                ? "Approving…"
                : `Approve ${approvable.length} high-confidence ${approvable.length === 1 ? "grade" : "grades"}`}
            </Button>
            <span className="self-center text-[12.5px] text-ink-3">
              When students see results depends on each test's release setting.
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherGradeReview;
