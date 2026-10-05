import { ArrowLeft, Eye, Save, FileEdit, CheckCircle2, Clock, Users } from "lucide-react";
import { QuestionEditor } from "./QuestionEditor";
import { Bento, MetricCard, SectionHeader } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { createId } from "@/lib/id";
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
  backLabel = "← Back to rules",
  heading = "Review the draft",
  crumbLabel = "Review draft",
}) => {
  const toast = useToast();
  const totalMarks = questions.reduce((s, q) => s + q.marks, 0);

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

      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Physics · Grade 11A <span className="text-ink-3">/</span> New test{" "}
        <span className="text-ink-3">/</span> {crumbLabel}
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            {heading}
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            {questions.length} questions · {totalMarks} marks ·{" "}
            {config.duration} min. Edit any question, answer, or mark. Mark the
            correct option on each multiple choice so auto-grading knows what to
            look for.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
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
        <SectionHeader label="Questions · click any field to edit" />
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
      </section>

      {/* Actions bar */}
      <Bento className="flex-row flex-wrap items-center justify-between gap-3 !py-4">
        <Button
          onClick={onBack} variant="ghost"
        >
          <ArrowLeft size={13} />
          Back to rules
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
