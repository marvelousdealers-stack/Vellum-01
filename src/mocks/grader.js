import { isChoice } from "@/lib/questions";

// ═══════════════════════════════════════════════════════════════
// MOCK GRADER
//
// Stands in for the backend's grading step (§7.9): objective questions are
// compared directly; written answers go to an LLM against the rubric and
// come back as { marks, confidence, rubric verdicts, feedback }. This mock
// scores by how many of the model answer's key words the student used — good
// enough to exercise every state of the review screen (strong, partial,
// weak, blank; high and low confidence). Nothing outside src/api imports it.
// ═══════════════════════════════════════════════════════════════
const STOP = new Set([
  "that", "this", "with", "from", "which", "their", "there", "then", "than",
  "they", "have", "will", "when", "what", "into", "because", "about", "would",
  "should", "using", "used", "also", "each", "does", "your",
]);

const words = (text) => String(text ?? "").toLowerCase().match(/[a-z0-9²³.=]+/g) ?? [];

const keywords = (text) => [
  ...new Set(words(text).filter((w) => /\d/.test(w) || (w.length >= 4 && !STOP.has(w)))),
];

const round2 = (n) => Math.round(n * 100) / 100;
const roundHalf = (n) => Math.round(n * 2) / 2;

/** One written answer → AI suggestion. Pure and deterministic. */
export const gradeWritten = (q, answer) => {
  const max = q.marks;
  const source = q.rubric?.length ? q.rubric : [{ label: "Answer addresses the question", points: max }];
  const total = source.reduce((s, r) => s + r.points, 0) || 1;
  const scale = max / total;
  const text = String(answer ?? "").trim();

  const spread = (marks) => {
    let left = marks;
    return source.map((r) => {
      const points = round2(r.points * scale);
      const awarded = round2(Math.min(points, left));
      left = round2(left - awarded);
      return { label: r.label, points, awarded };
    });
  };

  if (!text) {
    return { marks: 0, confidence: 0.95, rubric: spread(0), feedback: "No answer was given." };
  }

  const expected = keywords(q.expectedAnswer || q.text);
  const given = new Set(keywords(text));
  const hits = expected.filter((w) => given.has(w)).length;
  const coverage = expected.length ? hits / expected.length : 0.5;
  const marks = Math.min(max, roundHalf(coverage * max));

  // Near the extremes the grader is sure; in the middle, or when the answer
  // is too short to judge, it isn't.
  let confidence = coverage <= 0.1 || coverage >= 0.85 ? 0.9 : coverage < 0.35 || coverage > 0.65 ? 0.72 : 0.5;
  if (words(text).length < 4) confidence = Math.min(confidence, 0.55);

  const feedback =
    coverage >= 0.85
      ? "Covers the key points of the model answer."
      : coverage >= 0.35
        ? "Partly correct — some key points from the model answer are missing."
        : "Misses most of the key points from the model answer.";

  return { marks, confidence, rubric: spread(marks), feedback };
};

/**
 * Grades for a whole attempt: { [questionId]: Grade } (shape in lib/grading.js).
 * aiGrading false → written answers are left "pending" for the teacher.
 */
export const buildGrades = (questions, answers, { aiGrading }) => {
  const grades = {};
  questions.forEach((q) => {
    const answer = answers?.[q.id];
    if (isChoice(q)) {
      grades[q.id] = {
        marks: answer === q.correctIndex ? q.marks : 0,
        max: q.marks,
        status: "final",
        source: "auto",
        confidence: null,
        rubric: null,
        feedback: "",
      };
    } else if (aiGrading) {
      const r = gradeWritten(q, answer);
      grades[q.id] = {
        marks: r.marks,
        aiMarks: r.marks,
        max: q.marks,
        status: "ai_draft",
        source: "ai",
        confidence: r.confidence,
        rubric: r.rubric,
        feedback: r.feedback,
      };
    } else {
      grades[q.id] = {
        marks: null,
        max: q.marks,
        status: "pending",
        source: "manual",
        confidence: null,
        rubric: null,
        feedback: "",
      };
    }
  });
  return grades;
};
