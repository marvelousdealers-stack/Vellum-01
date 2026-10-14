// ═══════════════════════════════════════════════════════════════
// QUESTION SCHEMA — the single shape every screen and API module uses
//
//   {
//     id:             string
//     type:           "mcq" | "truefalse" | "short" | "long" | "numerical"
//     topic:          string
//     marks:          number (>= 1)
//     text:           string
//     options:        string[] | null     choice types only
//     correctIndex:   number | null       choice types only
//     expectedAnswer: string              written types (model answer)
//     rubric:         { label, points }[] written types
//   }
//
// Display labels are derived from `type` (never stored on the question), so
// they can't drift out of sync the way "MCQ" / "mcq" / "Short answer" did.
// ═══════════════════════════════════════════════════════════════
export const QUESTION_TYPES = {
  mcq: { label: "Multiple choice", short: "MCQ", kind: "choice" },
  truefalse: { label: "True / false", short: "T/F", kind: "choice" },
  short: { label: "Short answer", short: "Short", kind: "text" },
  long: { label: "Long answer", short: "Long", kind: "text" },
  numerical: { label: "Numerical", short: "Num", kind: "text" },
};

const LEGACY_TYPES = {
  MCQ: "mcq",
  "Multiple choice": "mcq",
  "True / false": "truefalse",
  "Short answer": "short",
  "Long answer": "long",
  Numerical: "numerical",
};

export const normalizeType = (type) =>
  QUESTION_TYPES[type] ? type : (LEGACY_TYPES[type] ?? "short");

export const typeLabel = (type) => QUESTION_TYPES[normalizeType(type)].label;

export const isChoice = (q) =>
  QUESTION_TYPES[normalizeType(q?.type)].kind === "choice";

export const sumMarks = (questions = []) =>
  questions.reduce((s, q) => s + (Number(q.marks) || 0), 0);

/** Coerces legacy / partial question objects into the schema above. */
export const normalizeQuestion = (q) => {
  const type = normalizeType(q.type);
  const choice = QUESTION_TYPES[type].kind === "choice";
  const defaultOptions = type === "truefalse" ? ["True", "False"] : ["", "", "", ""];
  return {
    id: q.id,
    type,
    topic: q.topic ?? "",
    marks: Number(q.marks) || 1,
    text: q.text ?? "",
    options: choice ? (q.options?.length ? [...q.options] : defaultOptions) : null,
    correctIndex: choice ? (q.correctIndex ?? null) : null,
    expectedAnswer: q.expectedAnswer ?? "",
    rubric: Array.isArray(q.rubric) ? q.rubric.map((r) => ({ ...r })) : [],
  };
};

/**
 * Problems that should block publishing. Returns [{ index, message }].
 * Kept here (not in a component) so the review banner and the publish
 * modal can never disagree about what "ready" means.
 */
export const validateQuestions = (questions = []) => {
  const issues = [];
  questions.forEach((q, index) => {
    if (!q.text?.trim()) {
      issues.push({ index, message: "question text is empty" });
    }
    if (!(Number(q.marks) >= 1)) {
      issues.push({ index, message: "marks must be at least 1" });
    }
    if (isChoice(q)) {
      if ((q.options ?? []).some((o) => !String(o).trim())) {
        issues.push({ index, message: "has an empty option" });
      }
      if (
        q.correctIndex == null ||
        q.correctIndex < 0 ||
        q.correctIndex >= (q.options?.length ?? 0)
      ) {
        issues.push({ index, message: "no correct option marked" });
      }
    }
  });
  if (questions.length === 0) {
    issues.push({ index: -1, message: "the test has no questions" });
  }
  return issues;
};
