import { useState } from "react";
import { Users, Sparkles } from "lucide-react";
import { NumberStepper } from "./NumberStepper";
import { ScopeEstimate } from "./ScopeEstimate";
import { TopicInput } from "./TopicInput";
import { Bento, Chip, ChipRow, Conn, SectionHeader } from "@/components/common";
import { DEFAULT_MIX, QuestionMixBuilder } from "@/components/common/QuestionMixBuilder";
import { useToast } from "@/context/ToastContext";
import { TOPICS } from "@/data/analytics";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// RULES SCREEN
//
// Sets the parameters for a new test. Left column is the form;
// the ScopeEstimate card (rendered by the caller in a featured
// Bento) previews what the draft will produce.
// ═══════════════════════════════════════════════════════════════
export const DraftRulesScreen = ({ onCancel, onCreate }) => {
  const toast = useToast();
  const [mix, setMix] = useState(DEFAULT_MIX);
  const [targetMarks, setTargetMarks] = useState(60);
  const [duration, setDuration] = useState(30);
  const [mode, setMode] = useState("class");
  const [difficulty, setDifficulty] = useState("balanced");
  const [focusTopics, setFocusTopics] = useState([
    "Newton's Laws of Motion",
    "Thermodynamics",
  ]);
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const [queued, setQueued] = useState(false);

  const MAX_CHARS = 400;
  const suggestions = TOPICS.map((t) => ({
    name: t.name,
    meta: `${t.accuracy}%`,
  }));
  const totalQuestions = mix.reduce((s, r) => s + r.count, 0);
  const totalMarks = mix.reduce((s, r) => s + r.count * r.marks, 0);

  const quickInserts = [
    { label: "More applied", text: "Make this more applied." },
    { label: "More theoretical", text: "Keep this more theoretical." },
    {
      label: "Include numericals",
      text: "Include at least two numerical problems.",
    },
    {
      label: "Simpler language",
      text: "Use simpler, everyday language in the questions.",
    },
    { label: "Exam-style", text: "Match the style of past exam papers." },
  ];

  const appendQuick = (text) =>
    setInstruction((prev) =>
      (prev + (prev ? " " : "") + text).slice(0, MAX_CHARS),
    );

  const handleCreate = async () => {
    if (totalQuestions === 0) {
      toast.push("Add at least one question type first", "error");
      return;
    }
    const config = {
      mix,
      targetMarks,
      duration,
      mode,
      difficulty,
      focusTopics,
      instruction,
    };
    setBusy(true);
    if (mode === "personal") setQueued(true);
    try {
      await onCreate(config);
    } catch (err) {
      toast.push(
        err?.message || "Couldn't generate the test — try again",
        "error",
      );
    } finally {
      setBusy(false);
      setQueued(false);
    }
  };

  const charsLeft = MAX_CHARS - instruction.length;
  const counterTone =
    charsLeft < 40
      ? "text-danger"
      : charsLeft < 120
        ? "text-warning"
        : "text-ink-3";

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Physics · Grade 11A <span className="text-ink-3">/</span> New test{" "}
        <span className="text-ink-3">/</span> Rules
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Set the rules
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            One screen, one job. Set how many of each question type you want,
            how many marks they carry, and any guidance for the AI. You'll
            review the draft on the next screen.
          </p>
        </div>
        <Conn state="live" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        {/* ═══ Form column ═══ */}
        <div className="flex min-w-0 flex-col gap-5">
          <Bento>
            <SectionHeader label="Test structure" />

            {/* Question mix */}
            <div className="mb-6">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <span className="text-[13.5px] font-medium text-ink">
                  Question mix
                </span>
                <span className="font-mono text-[12.5px] font-medium tabular-nums text-primary">
                  {totalMarks} marks
                </span>
              </div>
              <QuestionMixBuilder
                rows={mix}
                onChange={setMix}
                targetMarks={targetMarks}
              />
            </div>

            {/* Target total */}
            <div className="mb-6">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <span className="text-[13.5px] font-medium text-ink">
                  Target total
                </span>
                <span className="font-mono text-[12.5px] font-medium tabular-nums text-primary">
                  {targetMarks} marks
                </span>
              </div>
              <NumberStepper
                value={targetMarks}
                onChange={setTargetMarks}
                min={10}
                max={200}
                step={5}
                suffix="marks"
              />
            </div>

            {/* Duration */}
            <div className="mb-6">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <span className="text-[13.5px] font-medium text-ink">
                  Duration
                </span>
                <span className="font-mono text-[12.5px] font-medium tabular-nums text-primary">
                  {duration} min
                </span>
              </div>
              <NumberStepper
                value={duration}
                onChange={setDuration}
                min={10}
                max={180}
                step={5}
                suffix="min"
              />
            </div>

            {/* Delivery mode */}
            <div className="mb-6">
              <div className="mb-3 text-[13.5px] font-medium text-ink">
                Delivery mode
              </div>
              <ChipRow>
                <Chip
                  active={mode === "class"}
                  onClick={() => setMode("class")}
                >
                  Whole class
                </Chip>
                <Chip
                  active={mode === "personal"}
                  onClick={() => setMode("personal")}
                >
                  Per student
                </Chip>
              </ChipRow>
              {mode === "personal" && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-soft px-3 py-1.5 text-[12px] font-medium text-primary">
                  <Users size={12} />
                  Each student gets a different set, weighted to their weak
                  topics
                </div>
              )}
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <div className="mb-3 text-[13.5px] font-medium text-ink">
                Difficulty
              </div>
              <ChipRow>
                {["gentle", "balanced", "challenging"].map((d) => (
                  <Chip
                    key={d}
                    active={difficulty === d}
                    onClick={() => setDifficulty(d)}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </Chip>
                ))}
              </ChipRow>
            </div>

            {/* Focus topics */}
            <div className="mb-6">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <span className="text-[13.5px] font-medium text-ink">
                  Focus topics
                </span>
                <span className="font-mono text-[12.5px] font-medium tabular-nums text-primary">
                  {focusTopics.length}/6
                </span>
              </div>
              <TopicInput
                value={focusTopics}
                onChange={setFocusTopics}
                suggestions={suggestions}
                max={6}
                placeholder="Pick a topic or type your own, then press Enter…"
              />
            </div>

            {/* Free-text guidance */}
            <div className="border-t border-rule pt-6">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <label
                  htmlFor="guidance"
                  className="text-[13.5px] font-medium text-ink"
                >
                  Free-text guidance
                </label>
                <span
                  className={cn(
                    "font-mono text-[12px] font-medium tabular-nums",
                    counterTone,
                  )}
                >
                  {instruction.length} / {MAX_CHARS}
                </span>
              </div>
              <textarea
                id="guidance"
                value={instruction}
                onChange={(e) =>
                  setInstruction(e.target.value.slice(0, MAX_CHARS))
                }
                placeholder="e.g. Make this more applied; include at least two numerical problems."
                maxLength={MAX_CHARS}
                rows={4}
                className="w-full min-h-[96px] rounded-[var(--radius-control)] border border-rule-2 bg-sunken px-3.5 py-3 text-[14px] leading-relaxed text-ink outline-none transition-all placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-1.5 text-[12px] leading-relaxed text-ink-3">
                Optional. The AI treats this as a soft hint and may not follow
                every instruction literally.
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {quickInserts.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => appendQuick(q.text)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                      instruction.includes(q.text)
                        ? "border-primary bg-primary-dim text-primary"
                        : "border-dashed border-rule-2 text-ink-2 hover:border-solid hover:border-ink-3 hover:text-ink",
                    )}
                  >
                    + {q.label}
                  </button>
                ))}
              </div>
            </div>
          </Bento>

          {/* Scope estimate — featured treatment */}
          <Bento variant="featured" className="!p-0 overflow-hidden">
            <ScopeEstimate
              mix={mix}
              totalMarks={totalMarks}
              targetMarks={targetMarks}
              duration={duration}
              mode={mode}
            />
          </Bento>

          {/* Queued banner */}
          {queued && (
            <Bento className="flex-row items-center gap-3.5 border-warning/30 bg-warning-dim">
              <span className="size-4 shrink-0 animate-spin-slow rounded-full border-2 border-warning border-t-transparent" />
              <div>
                <strong className="block text-[13.5px] font-semibold text-warning">
                  Queued for generation
                </strong>
                <span className="mt-0.5 block text-[12.5px] text-warning/85">
                  Rate limit pacing — 2 of 32 tests in this batch.
                </span>
              </div>
            </Bento>
          )}

          {/* Actions bar */}
          <Bento className="flex-row flex-wrap items-center justify-between gap-3 !py-4">
            <Button
              onClick={onCancel}
              disabled={busy} variant="ghost"
            >
              Cancel
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[12.5px] tabular-nums text-ink-3">
                {totalQuestions} questions · {totalMarks} marks · {duration} min
              </span>
              <Button
                onClick={handleCreate}
                disabled={busy}
              >
                {busy ? (
                  <>
                    <span className="size-3 animate-spin-fast rounded-full border-2 border-current border-t-transparent" />
                    {queued ? "Queued…" : "Generating…"}
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    Create test
                  </>
                )}
              </Button>
            </div>
          </Bento>
        </div>
      </div>
    </div>
  );
};
