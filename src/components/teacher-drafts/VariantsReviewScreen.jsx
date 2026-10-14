import { useState } from "react";
import { ArrowLeft, Eye, Users, CheckCircle2, FileEdit, Search as SearchIcon } from "lucide-react";
import { DraftReviewScreen } from "./DraftReviewScreen";
import { Chip, ChipRow, EmptyState, MetricCard, StatusDot, Td, Th } from "@/components/common";
import { sumMarks, validateQuestions } from "@/lib/questions";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// VARIANTS REVIEW SCREEN
// ═══════════════════════════════════════════════════════════════
export const VariantsReviewScreen = ({
  config,
  variants,
  onVariantsChange,
  onBack,
  onPreview,
  onPublishAll,
  backLabel = "← Back to drafts",
  scope = "",
  title,
  readOnly = false,
  saveState,
}) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [reviewed, setReviewed] = useState(() => new Set());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Taken from the variants themselves (not config.mix) so the numbers stay
  // right after the teacher adds, removes or re-marks questions.
  const marksPerVariant = sumMarks(variants[0]?.questions);
  const questionsPerVariant = variants[0]?.questions.length ?? 0;
  const invalidCount = variants.filter(
    (v) => validateQuestions(v.questions).length > 0,
  ).length;

  const openVariant = (i) => {
    setOpenIndex(i);
    setReviewed((prev) => new Set(prev).add(variants[i].studentName));
  };

  if (openIndex !== null) {
    const v = variants[openIndex];
    return (
      <DraftReviewScreen
        config={config}
        questions={v.questions}
        onQuestionsChange={(qs) => {
          const copy = [...variants];
          copy[openIndex] = { ...v, questions: qs };
          onVariantsChange(copy);
        }}
        onBack={() => setOpenIndex(null)}
        onPreview={onPreview ? () => onPreview(openIndex) : undefined}
        onSave={readOnly ? undefined : () => setOpenIndex(null)}
        scope={scope}
        readOnly={readOnly}
        saveState={saveState}
        backLabel="← Back to student list"
        heading={`Review — ${v.studentName}`}
        crumbLabel={`Review draft · ${v.studentName}`}
      />
    );
  }

  const filtered = variants.filter((v) => {
    const matchesQuery = v.studentName
      .toLowerCase()
      .includes(query.toLowerCase());
    const isReviewed = reviewed.has(v.studentName);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "reviewed" && isReviewed) ||
      (statusFilter === "unreviewed" && !isReviewed);
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <Button
        onClick={onBack} variant="ghost" size="sm" className="mb-3"
      >
        <ArrowLeft size={13} />
        {backLabel.replace("← ", "")}
      </Button>

      <div className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-3">
        {scope && <>{scope} <span className="text-ink-3">/</span> </>}Drafts{" "}
        <span className="text-ink-3">/</span> Review variants
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[28px] font-semibold tablet:text-[34px] leading-[1.1] tracking-[-0.02em] text-ink">
            {title ? `${title} — student variants` : "Review each student's test"}
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            {variants.length} personalized variants · {questionsPerVariant}{" "}
            questions · {marksPerVariant} marks each. Spot-check a few, fix
            anything that looks off, then publish all at once — you don't need
            to open every one.
            {invalidCount > 0 &&
              ` ${invalidCount} ${invalidCount === 1 ? "variant has" : "variants have"} issues that will block publishing.`}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {onPreview && (
            <Button onClick={() => onPreview(0)} variant="outline">
              <Eye size={13} /> Preview
            </Button>
          )}
          {onPublishAll && (
            <Button onClick={onPublishAll}>
              Publish all {variants.length} →
            </Button>
          )}
        </div>
      </div>

      {/* KPI bento */}
      <div className="bento mb-10">
        <MetricCard
          icon={Users}
          iconTone="primary"
          label="Students"
          value={variants.length}
          delta="Personalized"
          deltaTone="success"
        />
        <MetricCard
          icon={CheckCircle2}
          iconTone="success"
          label="Reviewed"
          value={reviewed.size}
          unit={`/ ${variants.length}`}
          delta="Your spot-checks"
          deltaTone="success"
        />
        <MetricCard
          icon={FileEdit}
          iconTone="neutral"
          label="Questions each"
          value={questionsPerVariant}
          delta="Uniform across variants"
          deltaTone="success"
        />
        <MetricCard
          icon={CheckCircle2}
          iconTone="warning"
          label="Marks each"
          value={marksPerVariant}
          delta="Equal weight"
          deltaTone="success"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex h-10 min-w-[240px] flex-1 items-center gap-2.5 rounded-[var(--radius-control)] border border-rule-2 bg-surface px-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 narrow:max-w-[360px]">
          <SearchIcon size={14} className="shrink-0 text-ink-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student…"
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3"
          />
        </label>
        <ChipRow>
          {["all", "reviewed", "unreviewed"].map((f) => (
            <Chip
              key={f}
              active={statusFilter === f}
              onClick={() => setStatusFilter(f)}
            >
              {f === "all"
                ? "All"
                : f === "reviewed"
                  ? "Reviewed"
                  : "Not reviewed"}
            </Chip>
          ))}
        </ChipRow>
      </div>

      {/* Student list — table shell with card shadow */}
      <div className="overflow-hidden rounded-[var(--radius-container)] border border-rule bg-surface shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-rule-2">
                <Th>Student</Th>
                <Th>Weak topic targeted</Th>
                <Th className="text-right">Questions</Th>
                <Th className="text-right">Marks</Th>
                <Th>Status</Th>
                <Th className="w-12"></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-0">
                    <EmptyState
                      compact
                      title="No students match"
                      body="Try a different name or clear the filter."
                    />
                  </td>
                </tr>
              )}
              {filtered.map((v) => {
                const isReviewed = reviewed.has(v.studentName);
                const idx = variants.indexOf(v);
                return (
                  <tr
                    key={v.studentName}
                    onClick={() => openVariant(idx)}
                    className="cursor-pointer border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50"
                  >
                    <Td className="text-[13.5px] font-medium text-ink">
                      {v.studentName}
                    </Td>
                    <Td>
                      {v.weakTopic ? (
                        <span className="rounded-full border border-warning/25 bg-warning-dim px-2 py-0.5 text-[12px] font-medium text-warning">
                          {v.weakTopic}
                        </span>
                      ) : (
                        <span className="text-ink-3">—</span>
                      )}
                    </Td>
                    <Td className="text-right font-mono tabular-nums">
                      {v.questions.length}
                    </Td>
                    <Td className="text-right font-mono tabular-nums">
                      {v.questions.reduce((s, q) => s + q.marks, 0)}
                    </Td>
                    <Td>
                      <StatusDot tone={isReviewed ? "success" : "warning"}>
                        {isReviewed ? "Reviewed" : "Not reviewed"}
                      </StatusDot>
                    </Td>
                    <Td className="text-right text-ink-3">→</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
