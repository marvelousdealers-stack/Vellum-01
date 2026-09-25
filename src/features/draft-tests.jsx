import React, { useState } from "react";
import { useActiveClass } from "../context/class-context";
import { usePersistentState } from "../hooks/use-persistent-state";
import { EmptyState } from "../components/ui-kit";
import {
  Icon,
  SearchIcon,
  Conn,
  TOPICS,
  NumberStepper,
  TopicInput,
} from "../shared/shared";
import { QuestionMixBuilder, DEFAULT_MIX } from "./class-management";
import { ScopeEstimate } from "./widgets";
import { useToast } from "../components/toast";

// ═══════════════════════════════════════════════════════════════
// MOCK QUESTION TEMPLATES
// ═══════════════════════════════════════════════════════════════
const MCQ_TEMPLATES = [
  {
    text: "A 5 kg block rests on a frictionless horizontal surface. A horizontal force of 20 N is applied. What is the block's acceleration?",
    options: ["2 m/s²", "4 m/s²", "10 m/s²", "25 m/s²"],
    correctIndex: 1,
  },
  {
    text: "In an isothermal expansion of an ideal gas, which quantity remains constant throughout the process?",
    options: ["Internal energy", "Pressure", "Volume", "Heat transferred"],
    correctIndex: 0,
  },
  {
    text: "Which of the following best describes inertia?",
    options: [
      "The force needed to move an object",
      "An object's resistance to change in motion",
      "The speed of an object in free fall",
      "The energy stored in a moving object",
    ],
    correctIndex: 1,
  },
  {
    text: "A ball is thrown straight up. At its highest point, what is its acceleration?",
    options: [
      "0 m/s²",
      "9.8 m/s² downward",
      "9.8 m/s² upward",
      "Impossible to determine",
    ],
    correctIndex: 1,
  },
];

const SHORT_TEMPLATES = [
  {
    text: "State Newton's Second Law of Motion and explain, in your own words, how it relates to the concept of inertia.",
    expectedAnswer:
      "The net force on an object equals its mass times its acceleration (F = ma). Inertia is the resistance of an object to any change in its motion; it is proportional to mass, so a larger mass requires a larger net force for the same acceleration.",
    rubric: [
      { label: "Correctly states the law", points: 2 },
      { label: "Connects to inertia", points: 1 },
      { label: "Uses correct terminology", points: 1 },
    ],
  },
  {
    text: "Explain why a person standing in a moving bus falls forward when the bus stops suddenly.",
    expectedAnswer:
      "When the bus stops, the person's body continues moving forward due to inertia — the body was in motion with the bus, and no forward force acted on it to change that motion.",
    rubric: [
      { label: "References inertia", points: 2 },
      { label: "Correct direction explained", points: 1 },
    ],
  },
];

const LONG_TEMPLATES = [
  {
    text: "Compare and contrast isothermal and adiabatic processes for an ideal gas. Your answer should discuss temperature, heat exchange, internal energy, and the first law of thermodynamics, and give one real-world example of each.",
    expectedAnswer:
      "In an isothermal process, temperature is held constant, so the internal energy of an ideal gas does not change (ΔU = 0); all heat added is converted to work (Q = W). In an adiabatic process, no heat is exchanged with the surroundings (Q = 0), so any work done changes the internal energy (ΔU = −W). Real-world examples: isothermal — a phase change at constant temperature; adiabatic — rapid compression in a diesel engine.",
    rubric: [
      { label: "Defines isothermal correctly", points: 3 },
      { label: "Defines adiabatic correctly", points: 3 },
      { label: "Applies first law correctly", points: 2 },
      { label: "Gives valid real-world examples", points: 2 },
    ],
  },
];

const NUM_TEMPLATES = [
  {
    text: "A car of mass 1200 kg decelerates uniformly from 25 m/s to rest in 8 seconds. Calculate the magnitude of the average braking force.",
    expectedAnswer:
      "a = (0 − 25) / 8 = −3.125 m/s². F = 1200 × 3.125 = 3750 N directed opposite to the motion.",
    rubric: [
      { label: "Correct deceleration", points: 1 },
      { label: "Correct force magnitude", points: 2 },
      { label: "Correct units and direction", points: 2 },
    ],
  },
  {
    text: "A ball is thrown vertically upward with an initial speed of 15 m/s. Calculate the maximum height it reaches. Take g = 10 m/s².",
    expectedAnswer:
      "Using v² = u² − 2gh at the highest point (v = 0): h = u² / 2g = 225 / 20 = 11.25 m.",
    rubric: [
      { label: "Correct kinematic equation", points: 1 },
      { label: "Correct substitution", points: 1 },
      { label: "Correct final answer (11.25 m)", points: 1 },
    ],
  },
];

const pickTemplate = (type, index) => {
  const pools = {
    mcq: MCQ_TEMPLATES,
    truefalse: MCQ_TEMPLATES,
    short: SHORT_TEMPLATES,
    long: LONG_TEMPLATES,
    numerical: NUM_TEMPLATES,
  };
  const pool = pools[type] || SHORT_TEMPLATES;
  return pool[index % pool.length];
};

const TYPE_LABEL = {
  mcq: "Multiple choice",
  truefalse: "True / false",
  short: "Short answer",
  long: "Long answer",
  numerical: "Numerical",
};

export const buildQuestions = (mix) => {
  const out = [];
  let id = 1;
  let seed = 0;
  mix.forEach((row) => {
    for (let i = 0; i < row.count; i++) {
      const tpl = pickTemplate(row.type, seed++);
      out.push({
        id: id++,
        type: row.type,
        typeLabel: TYPE_LABEL[row.type] || "Question",
        marks: row.marks,
        text: tpl.text,
        options: tpl.options ? [...tpl.options] : null,
        correctIndex: tpl.correctIndex ?? null,
        expectedAnswer: tpl.expectedAnswer ?? "",
        rubric: tpl.rubric ? tpl.rubric.map((r) => ({ ...r })) : [],
        topic: TOPICS[i % TOPICS.length].name,
      });
    }
  });
  return out;
};

// ═══════════════════════════════════════════════════════════════
// RULES SCREEN — full-width, one job
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

  const appendQuick = (text) => {
    setInstruction((prev) =>
      (prev + (prev ? " " : "") + text).slice(0, MAX_CHARS),
    );
  };

  const handleCreate = () => {
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
    if (mode === "personal") {
      setQueued(true);
      setBusy(true);
      setTimeout(() => {
        setQueued(false);
        setBusy(false);
        onCreate(config);
      }, 2200);
    } else {
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        onCreate(config);
      }, 1400);
    }
  };

  const charsLeft = MAX_CHARS - instruction.length;
  const counterClass = charsLeft < 40 ? "full" : charsLeft < 120 ? "warn" : "";

  return (
    <div className="main-pad">
      <div className="crumbs">
        Physics · Grade 11A <b>/</b> New test <b>/</b> Rules
      </div>
      <div
        className="hstack"
        style={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <h1 className="title">Set the rules</h1>
          <p className="lede">
            One screen, one job. Set how many of each question type you want,
            how many marks they carry, and any guidance for the AI. You'll
            review the draft on the next screen.
          </p>
        </div>
        <Conn state="live" />
      </div>

      <div className="draft-form">
        <div className="panel">
          <div className="panel-title">Test structure</div>

          <div className="rule-row">
            <div className="rule-label">
              <span>Question mix</span>
              <span className="val">{totalMarks} marks</span>
            </div>
            <QuestionMixBuilder
              rows={mix}
              onChange={setMix}
              targetMarks={targetMarks}
            />
          </div>

          <div className="rule-row">
            <div className="rule-label">
              <label htmlFor="target-marks" style={{ cursor: "pointer" }}>
                Target total
              </label>
              <span className="val">{targetMarks} marks</span>
            </div>
            <NumberStepper
              id="target-marks"
              value={targetMarks}
              onChange={setTargetMarks}
              min={10}
              max={200}
              step={5}
              suffix="marks"
            />
          </div>

          <div className="rule-row">
            <div className="rule-label">
              <label htmlFor="q-duration" style={{ cursor: "pointer" }}>
                Duration
              </label>
              <span className="val">{duration} min</span>
            </div>
            <NumberStepper
              id="q-duration"
              value={duration}
              onChange={setDuration}
              min={10}
              max={180}
              step={5}
              suffix="minutes"
            />
          </div>

          <div className="rule-row">
            <div className="rule-label">
              <span>Delivery mode</span>
            </div>
            <div className="chip-row">
              <button
                className={"chip" + (mode === "class" ? " on" : "")}
                onClick={() => setMode("class")}
              >
                Whole class
              </button>
              <button
                className={"chip" + (mode === "personal" ? " on" : "")}
                onClick={() => setMode("personal")}
              >
                Per student
              </button>
            </div>
            {mode === "personal" && (
              <div className="pill accent" style={{ marginTop: 10 }}>
                Each student gets a different set, weighted to their weak topics
              </div>
            )}
          </div>

          <div className="rule-row">
            <div className="rule-label">
              <span>Difficulty</span>
            </div>
            <div className="chip-row">
              {["gentle", "balanced", "challenging"].map((d) => (
                <button
                  key={d}
                  className={"chip" + (difficulty === d ? " on" : "")}
                  onClick={() => setDifficulty(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="rule-row">
            <div className="rule-label">
              <span>Focus topics</span>
              <span className="val">{focusTopics.length}/6</span>
            </div>
            <TopicInput
              value={focusTopics}
              onChange={setFocusTopics}
              suggestions={suggestions}
              max={6}
              placeholder="Type a topic or pick from the list…"
            />
          </div>

          <div className="rule-row">
            <div className="field-textarea">
              <div className="field-textarea-head">
                <label htmlFor="guidance">Free-text guidance</label>
                <span className={"field-textarea-counter " + counterClass}>
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
              />
              <div className="field-textarea-hint">
                Optional. The AI treats this as a soft hint and may not follow
                every instruction literally.
              </div>
              <div className="field-quick">
                {quickInserts.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    className={
                      "field-quick-chip" +
                      (instruction.includes(q.text) ? " on" : "")
                    }
                    onClick={() => appendQuick(q.text)}
                  >
                    + {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ScopeEstimate
          mix={mix}
          totalMarks={totalMarks}
          targetMarks={targetMarks}
          duration={duration}
          mode={mode}
        />

        {queued && (
          <div className="draft-queued" role="status">
            <span className="draft-queued-spinner" />
            <div>
              <strong>Queued for generation</strong>
              <div className="draft-queued-sub">
                Rate limit pacing — 2 of 32 tests in this batch.
              </div>
            </div>
          </div>
        )}

        <div className="draft-actions-bar">
          <button className="btn btn-text" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <div className="draft-actions-right">
            <span className="draft-summary">
              {totalQuestions} questions · {totalMarks} marks · {duration} min
            </span>
            <button
              className="btn btn-solid"
              onClick={handleCreate}
              disabled={busy}
            >
              {busy ? (queued ? "Queued…" : "Generating…") : "Create test"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// QUESTION EDITOR
// ═══════════════════════════════════════════════════════════════
const QuestionEditor = ({
  q,
  index,
  total,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
}) => {
  const isMCQ = q.type === "mcq" || q.type === "truefalse";
  const isWritten = !isMCQ;

  const updateField = (patch) => onUpdate({ ...q, ...patch });
  const updateOption = (i, val) => {
    const opts = [...q.options];
    opts[i] = val;
    updateField({ options: opts });
  };

  return (
    <div className="qe-card">
      <div className="qe-head">
        <div className="qe-head-left">
          <span className="qe-num">Q{index + 1}</span>
          <span className="qe-type">{q.typeLabel}</span>
          <span className="pill accent" style={{ fontSize: 11 }}>
            {q.topic}
          </span>
        </div>
        <div className="qe-head-right">
          <div className="qe-marks-field">
            <input
              className="qe-marks-input"
              value={q.marks}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                updateField({
                  marks: v === "" ? 1 : Math.max(1, parseInt(v, 10)),
                });
              }}
              aria-label="Marks"
            />
            <span className="qe-marks-label">marks</span>
          </div>
          <div className="qe-actions">
            <button
              className="q-act"
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
              title="Move up"
            >
              ↑
            </button>
            <button
              className="q-act"
              onClick={() => onMove(index, 1)}
              disabled={index === total - 1}
              title="Move down"
            >
              ↓
            </button>
            <button className="q-act" onClick={() => onDuplicate(index)}>
              Duplicate
            </button>
            <button className="q-act" onClick={() => onDelete(index)}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <textarea
        className="qe-text"
        value={q.text}
        onChange={(e) => updateField({ text: e.target.value })}
        rows={2}
      />

      {isMCQ && q.options && (
        <div className="qe-options">
          <div className="qe-options-head">
            <span>Options</span>
            <span className="qe-options-hint">
              Click the circle to mark the correct answer
            </span>
          </div>
          {q.options.map((opt, i) => {
            const isCorrect = q.correctIndex === i;
            return (
              <div
                key={i}
                className={"qe-option" + (isCorrect ? " correct" : "")}
              >
                <button
                  type="button"
                  className="qe-correct-radio"
                  onClick={() => updateField({ correctIndex: i })}
                  aria-label={`Mark option ${String.fromCharCode(65 + i)} as correct`}
                >
                  <span className="qe-radio-dot" />
                </button>
                <span className="qe-option-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <input
                  className="qe-option-input"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                />
                {isCorrect && <span className="qe-correct-badge">Correct</span>}
              </div>
            );
          })}
          <div className="qe-correct-note">
            Used by auto-grading. Students never see this marker.
          </div>
        </div>
      )}

      {isWritten && (
        <div className="qe-written">
          <div className="qe-field">
            <label className="qe-field-label">
              Expected answer / model response
            </label>
            <textarea
              className="qe-textarea"
              value={q.expectedAnswer}
              onChange={(e) => updateField({ expectedAnswer: e.target.value })}
              placeholder="What a full-mark answer should say. Used by the AI grader and shown to you during review."
            />
          </div>
          {q.rubric.length > 0 && (
            <div className="qe-field">
              <label className="qe-field-label">
                Rubric ({q.rubric.reduce((s, r) => s + r.points, 0)} pts)
              </label>
              <div className="qe-rubric">
                {q.rubric.map((r, i) => (
                  <div key={i} className="qe-rubric-row">
                    <span className="qe-rubric-label">{r.label}</span>
                    <span className="qe-rubric-points">{r.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
    const cloned = { ...questions[i], id: Date.now() };
    copy.splice(i + 1, 0, cloned);
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
    <div className="main-pad">
      <button
        className="btn btn-text"
        onClick={onBack}
        style={{ padding: "6px 0", marginBottom: 12 }}
      >
        ← Back to rules
      </button>
      <div className="crumbs">
        Physics · Grade 11A <b>/</b> New test <b>/</b> Review draft
      </div>

      <div
        className="hstack"
        style={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <div>
          <h1 className="title">Review the draft</h1>
          <p className="lede">
            {questions.length} questions · {totalMarks} marks ·{" "}
            {config.duration} min. Edit any question, answer, or mark. Mark the
            correct option on each multiple choice so auto-grading knows what to
            look for.
          </p>
        </div>
        <div className="hstack" style={{ gap: 8, flexShrink: 0 }}>
          <button className="btn btn-line" onClick={onPreview}>
            Preview as student
          </button>
          <button className="btn btn-line" onClick={() => onSave?.()}>
            Save draft
          </button>
          <button className="btn btn-solid" onClick={onPublish}>
            Publish
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">Questions</div>
          <div className="kpi-num">{questions.length}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Total marks</div>
          <div className="kpi-num">{totalMarks}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Duration</div>
          <div className="kpi-num">
            {config.duration}
            <span className="den"> min</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Mode</div>
          <div className="kpi-num" style={{ fontSize: 18, marginTop: 6 }}>
            {config.mode === "personal" ? "Per student" : "Whole class"}
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Questions</h2>
          <span className="sec-note">Click any field to edit</span>
        </div>
        <div className="qe-list">
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

        <div className="draft-actions-bar" style={{ marginTop: 24 }}>
          <button className="btn btn-text" onClick={onBack}>
            ← Back to rules
          </button>
          <div className="draft-actions-right">
            <button className="btn btn-line" onClick={onPreview}>
              Preview as student
            </button>
            <button className="btn btn-line" onClick={() => onSave?.()}>
              Save draft
            </button>
            <button className="btn btn-solid" onClick={onPublish}>
              Publish test
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
// ═══════════════════════════════════════════════════════════════
// DRAFTS LIST
// ═══════════════════════════════════════════════════════════════
const STATUS_META = {
  draft: { label: "Draft", cls: "pending" },
  scheduled: { label: "Scheduled", cls: "accent" },
  live: { label: "Live now", cls: "flagged" },
  completed: { label: "Completed", cls: "reviewed" },
};

export const DraftsList = ({
  drafts,
  onOpen,
  onPublish,
  onSchedule,
  onDelete,
  onNew,
  onRegenerate,
  onDuplicate,
}) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAllClasses, setShowAllClasses] = useState(false);
  const { activeClass } = useActiveClass();

  // Class-scoped view: by default show only drafts for the active class.
  // When the user toggles "Show all classes", the class filter is dropped.
  const classScoped =
    showAllClasses || !activeClass
      ? drafts
      : drafts.filter((d) => d.cls === activeClass.short);

  // Counts are computed on the class-scoped set so the KPIs match the list.
  const counts = {
    draft: classScoped.filter((d) => d.status === "draft").length,
    scheduled: classScoped.filter((d) => d.status === "scheduled").length,
    live: classScoped.filter((d) => d.status === "live").length,
    completed: classScoped.filter((d) => d.status === "completed").length,
  };

  // Apply the status chip + search filters on top of the class scope.
  const filtered = classScoped
    .filter((d) => filter === "all" || d.status === filter)
    .filter(
      (d) =>
        !search.trim() ||
        d.title.toLowerCase().includes(search.trim().toLowerCase()),
    );

  // Determine the empty state message based on WHY the list is empty.
  // Three distinct cases, three distinct messages.
  const isEmptyStateKind =
    drafts.length === 0
      ? "no-drafts-at-all"
      : filtered.length === 0 && filter !== "all"
        ? "no-match-filter"
        : filtered.length === 0 && search.trim()
          ? "no-match-search"
          : filtered.length === 0 && !showAllClasses && classScoped.length === 0
            ? "no-class-drafts"
            : null;

  const emptyCopy = {
    "no-drafts-at-all": {
      title: "No drafts yet",
      body: "Draft your first test and it'll appear here.",
      action: "New test",
      onAction: onNew,
    },
    "no-match-filter": {
      title: `No ${filter === "completed" ? "completed" : filter} drafts`,
      body: "Try a different filter or clear it to see all drafts.",
      action: "Show all",
      onAction: () => setFilter("all"),
    },
    "no-match-search": {
      title: "No drafts match your search",
      body: "Try a shorter query or clear the search.",
      action: "Clear search",
      onAction: () => setSearch(""),
    },
    "no-class-drafts": {
      title: `No drafts in ${activeClass?.name || "this class"}`,
      body: `Drafts belong to the class they were created in. Either start a new test for ${activeClass?.name || "this class"}, or view drafts from all classes.`,
      action: "Show all classes",
      onAction: () => setShowAllClasses(true),
    },
  }[isEmptyStateKind];

  return (
    <div className="main-pad">
      <div className="crumbs">
        {activeClass?.subject || "Physics"} ·{" "}
        {activeClass?.name || "Grade 11 — Section A"} <b>/</b> Drafts
      </div>
      <div
        className="hstack"
        style={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <h1 className="title">
            Drafts <span className="soft">&amp; scheduled</span>
          </h1>
          <p className="lede">
            Every test you've drafted, plus ones already scheduled or live.
            Publish a draft, schedule it for later, or open it to edit.
          </p>
        </div>
        <button className="btn btn-solid" onClick={onNew}>
          + New test
        </button>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">Drafts</div>
          <div className="kpi-num">{counts.draft}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Scheduled</div>
          <div className="kpi-num">{counts.scheduled}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Live now</div>
          <div className="kpi-num alert">{counts.live}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Completed</div>
          <div className="kpi-num">{counts.completed}</div>
        </div>
      </div>

      <div className="gr-filter-bar">
        <label className="gr-search">
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drafts by title…"
          />
        </label>
        {["all", "draft", "scheduled", "live", "completed"].map((f) => (
          <button
            key={f}
            className={"gr-filter-chip" + (filter === f ? " on" : "")}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : STATUS_META[f].label}
          </button>
        ))}

        {/* Show-all-classes escape hatch — only appears when the class
            filter is hiding drafts, so the user always has a way back. */}
        {!showAllClasses &&
          activeClass &&
          drafts.length > classScoped.length && (
            <button
              className="gr-filter-chip"
              onClick={() => setShowAllClasses(true)}
              title="Include drafts from other classes"
            >
              All classes ({drafts.length})
            </button>
          )}
        {showAllClasses && (
          <button
            className="gr-filter-chip on"
            onClick={() => setShowAllClasses(false)}
            title="Show only the active class"
          >
            {activeClass?.short} only
          </button>
        )}
      </div>

      <table className="gr-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Class</th>
            <th className="col-num">Questions</th>
            <th className="col-num">Marks</th>
            <th>Source</th>
            <th>Status</th>
            <th>Last edited</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && emptyCopy && (
            <tr>
              <td colSpan={8} style={{ padding: 0, borderBottom: "none" }}>
                <EmptyState
                  title={emptyCopy.title}
                  body={emptyCopy.body}
                  action={emptyCopy.action}
                  onAction={emptyCopy.onAction}
                  compact
                />
              </td>
            </tr>
          )}
          {filtered.map((d) => {
            const meta = STATUS_META[d.status];
            return (
              <tr key={d.id} onClick={() => onOpen(d)}>
                <td className="col-student">
                  {d.title}
                  {d.regeneratedAt && (
                    <small
                      style={{
                        display: "block",
                        fontSize: 11,
                        color: "var(--ink-4)",
                        marginTop: 2,
                      }}
                    >
                      Regenerated {d.regeneratedAt}
                    </small>
                  )}
                </td>
                <td style={{ fontSize: 12.5 }}>{d.cls}</td>
                <td className="col-num">{d.questions}</td>
                <td className="col-num">{d.marks}</td>
                <td>
                  {d.questionSet && d.questionSet.length > 0 ? (
                    <span className="pill accent" style={{ fontSize: 11 }}>
                      AI-generated
                    </span>
                  ) : (
                    <span className="pill" style={{ fontSize: 11 }}>
                      Settings only
                    </span>
                  )}
                </td>
                <td>
                  <span className={"status-badge " + meta.cls}>
                    {meta.label}
                  </span>
                </td>
                <td style={{ fontSize: 12.5 }}>{d.lastEdited}</td>
                <td style={{ textAlign: "right" }}>
                  <div className="draft-row-actions">
                    <button
                      className="btn btn-text btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(d);
                      }}
                    >
                      Open
                    </button>
                    {d.status === "draft" && (
                      <>
                        <button
                          className="btn btn-text btn-sm"
                          data-action="regenerate"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRegenerate?.(d);
                          }}
                        >
                          Regenerate
                        </button>
                        <button
                          className="btn btn-text btn-sm"
                          data-action="duplicate"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate?.(d);
                          }}
                        >
                          Duplicate
                        </button>
                        <button
                          className="btn btn-text btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPublish(d);
                          }}
                        >
                          Publish
                        </button>
                      </>
                    )}
                    {d.status === "live" && (
                      <button
                        className="btn btn-text btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Open live view
                      </button>
                    )}
                    <button
                      className="btn btn-text btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(d);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
