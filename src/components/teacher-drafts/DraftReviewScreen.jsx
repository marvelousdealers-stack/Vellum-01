import { AlertTriangle, ArrowLeft, Eye, Lock, Save, FileEdit, CheckCircle2, Clock, Users } from "lucide-react";
import { QuestionEditor } from "./QuestionEditor";
import { Bento, MetricCard, SectionHeader } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { AutoSaveIndicator } from "@/components/take-test/AutoSaveIndicator";
import { createId } from "@/lib/id";
import { sumMarks, validateQuestions } from "@/lib/questions";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// REVIEW SCREEN
// ═══════════════════════════════════════════════════════════════
export const DraftReviewScreen = ({
  config,
  questions,
  onQuestionsChange,
  onBack,
  onPublish,
  onPreview,
  onSave,
  saveState,
  backLabel = "← Back to drafts",
  heading = "Review the draft",
  crumbLabel = "Review draft",
  scope = "",
  title,
  readOnly = false,
}) => {
  const toast = useToast();
  const totalMarks = sumMarks(questions);
  const issues = validateQuestions(questions);

  const update = (i, next) => {
    const copy = [...questions];
    copy[i] = next;
    onQuestionsChange(copy);
  };
  const remove = (i) => {
    onQuestionsChange(questions.filter((_, j) => j !== i));
    toast.push("Question removed", "info");
  };
  const duplicate = (i) => {
    const copy = [...questions];
    copy.splice(i + 1, 0, { ...questions[i], id: createId() });
    onQuestionsChange(copy);
    toast.push("Question duplicated", "info");
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= questions.length) return;
    const copy = [...questions];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onQuestionsChange(copy);
  };

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
        <span className="text-ink-3">/</span> {crumbLabel}
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[28px] font-semibold tablet:text-[34px] leading-[1.1] tracking-[-0.02em] text-ink">
            {title && heading === "Review the draft" ? title : heading}
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            {questions.length} questions · {totalMarks} marks ·{" "}
            {config.duration} min.{" "}
            {readOnly
              ? "This test is no longer a draft, so it can't be edited."
              : "Edit any question, answer, or mark. Mark the correct option on each multiple choice so auto-grading knows what to look for."}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {saveState && (
            <AutoSaveIndicator
              state={saveState}
              errorText="Couldn't save — retrying. Your edits are kept on this page."
            />
          )}
          {onPreview && (
            <Button
              onClick={onPreview} variant="outline"
            >
              <Eye size={13} /> Preview
            </Button>
          )}
          {onSave && (
            <Button
              onClick={() => onSave()} variant="outline"
            >
              <Save size={13} /> Save draft
            </Button>
          )}
          {onPublish && (
            <Button
              onClick={onPublish}
            >
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* KPI bento row */}
      <div className="bento mb-10">
        <MetricCard
          icon={FileEdit}
          iconTone="primary"
          label="Questions"
          value={questions.length}
          delta="Ready to review"
          deltaTone="success"
        />
        <MetricCard
          icon={CheckCircle2}
          iconTone="success"
          label="Total marks"
          value={totalMarks}
          delta={config.mode === "personal" ? "Per variant" : "For the class"}
          deltaTone="success"
        />
        <MetricCard
          icon={Clock}
          iconTone="warning"
          label="Duration"
          value={config.duration}
          unit="min"
          delta="Time limit"
          deltaTone="success"
        />
        <MetricCard
          icon={Users}
          iconTone={config.mode === "personal" ? "primary" : "neutral"}
          label="Mode"
          value={config.mode === "personal" ? "Per student" : "Whole class"}
          delta={
            config.mode === "personal"
              ? "Personalized variants"
              : "Single shared test"
          }
          deltaTone="success"
        />
      </div>

      <section className="mb-10">
        <SectionHeader label={readOnly ? "Questions" : "Questions · click any field to edit"} />
        {readOnly && (
          <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-control)] border border-rule-2 bg-raised px-4 py-3 text-[13px] text-ink-2">
            <Lock size={14} className="shrink-0 text-ink-3" />
            Read-only — students have already been given this test.
          </div>
        )}
        {!readOnly && issues.length > 0 && (
          <div
            role="status"
            className="mb-4 flex items-start gap-2 rounded-[var(--radius-control)] border border-warning/25 bg-warning-dim px-4 py-3 text-[13px] text-warning"
          >
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>
              {issues.length} {issues.length === 1 ? "issue" : "issues"} to fix before
              publishing:{" "}
              {issues
                .slice(0, 3)
                .map((i) => (i.index >= 0 ? `Q${i.index + 1} ${i.message}` : i.message))
                .join("; ")}
              {issues.length > 3 ? "…" : "."}
            </span>
          </div>
        )}
        {/* A disabled fieldset switches off every input and button inside it,
            which is all read-only mode needs. */}
        <fieldset disabled={readOnly} className="m-0 min-w-0 border-0 p-0">
          <div className="flex flex-col gap-3.5">
            {questions.map((q, i) => (
              <QuestionEditor
                key={q.id}
                q={q}
                index={i}
                total={questions.length}
                onUpdate={(next) => update(i, next)}
                onDelete={remove}
                onDuplicate={duplicate}
                onMove={move}
              />
            ))}
          </div>
        </fieldset>
      </section>

      {/* Actions bar */}
      <Bento className="flex-row flex-wrap items-center justify-between gap-3 !py-4">
        <Button
          onClick={onBack} variant="ghost"
        >
          <ArrowLeft size={13} />
          {backLabel.replace("← ", "")}
        </Button>
        <div className="flex flex-wrap gap-2">
          {onPreview && (
            <Button
              onClick={onPreview} variant="outline"
            >
              Preview as student
            </Button>
          )}
          {onSave && (
            <Button
              onClick={() => onSave()} variant="outline"
            >
              Save draft
            </Button>
          )}
          {onPublish && (
            <Button
              onClick={onPublish}
            >
              Publish test
            </Button>
          )}
        </div>
      </Bento>
    </div>
  );
};
