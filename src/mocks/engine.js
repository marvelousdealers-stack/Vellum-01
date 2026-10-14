import { isChoice } from "@/lib/questions";

// ═══════════════════════════════════════════════════════════════
// SERVER RULES (fake backend only)
//
// Everything here is behaviour a real backend owns: what status a test is
// in, who may see what, when results are released, how an attempt is graded
// and totalled. The frontend never imports this folder's code — it only ever
// sees the responses (src/mocks/handlers.js), exactly as it will with the real
// server. See API-CONTRACT.md for the rules a real backend must implement.
// ═══════════════════════════════════════════════════════════════
export const DEFAULT_SETTINGS = {
  release: "after_close", // "immediately" | "after_close"
  aiGrading: true,
  allowBack: true,
};
export const settingsOf = (test) => ({ ...DEFAULT_SETTINGS, ...(test.settings ?? {}) });

/** draft | scheduled | live | completed — from what the teacher did and the clock. */
export const statusOf = (test, now = Date.now()) => {
  if (test.status === "draft") return "draft";
  if (test.stoppedAt && test.stoppedAt <= now) return "completed";
  const s = test.schedule;
  if (s?.availableUntil && now >= s.availableUntil) return "completed";
  if (s?.availableFrom && now < s.availableFrom) return "scheduled";
  return "live";
};

export const variantIndexFor = (test, studentName) =>
  (test.variants ?? []).findIndex((v) => v.studentName === studentName);

export const questionsFor = (test, variantIndex) =>
  test.mode === "personal"
    ? (test.variants?.[variantIndex]?.questions ?? [])
    : (test.questionSet ?? []);

export const sumMarks = (qs = []) => qs.reduce((s, q) => s + (Number(q.marks) || 0), 0);

export const deadlineFor = (test, startedAt) => {
  const limit = startedAt + (test.config?.duration ?? 30) * 60_000;
  const close = test.schedule?.availableUntil;
  return close ? Math.min(limit, close) : limit;
};

export const confidenceLabel = (c) =>
  c == null ? null : c < 0.6 ? "low" : c < 0.8 ? "med" : "high";

/** Totals count only final marks, so unreviewed AI output never reaches a student. */
export const totalsOf = (questions = [], grades = {}) => {
  let earned = 0;
  let max = 0;
  let notFinal = 0;
  questions.forEach((q) => {
    max += q.marks;
    const g = grades?.[q.id];
    if (g?.status === "final") earned += g.marks;
    else notFinal += 1;
  });
  return { earned, max, complete: notFinal === 0, notFinal };
};

export const isReleased = (test, attempt, now = Date.now()) =>
  attempt.status === "submitted" &&
  (settingsOf(test).release === "immediately" || statusOf(test, now) === "completed");

// ── response shapes ──────────────────────────────────────────────
export const stripQuestion = (q) => ({
  id: q.id,
  type: q.type,
  topic: q.topic,
  marks: q.marks,
  text: q.text,
  options: q.options,
});

const counts = (test) => {
  const qs = test.mode === "personal" ? (test.variants?.[0]?.questions ?? []) : (test.questionSet ?? []);
  return { questionCount: qs.length, totalMarks: sumMarks(qs) };
};

/** Teacher: the whole test. */
export const testForTeacher = (test, now) => ({
  ...test,
  settings: settingsOf(test),
  status: statusOf(test, now),
  ...counts(test),
});

/** Student: metadata only — no questions, variants or answer keys. */
export const testForStudent = (test, now) => ({
  id: test.id,
  title: test.title,
  subject: test.subject,
  classId: test.classId,
  cls: test.cls,
  mode: test.mode,
  status: statusOf(test, now),
  schedule: test.schedule,
  settings: settingsOf(test),
  config: { duration: test.config?.duration ?? 30 },
  publishedAt: test.publishedAt,
  stoppedAt: test.stoppedAt,
  updatedAt: test.updatedAt,
  ...counts(test),
});

/** Student's own attempt: question text only, plus what they may know about results. */
export const attemptForStudent = (attempt, test, now) => {
  const released = test ? isReleased(test, attempt, now) : false;
  const { grades, ...rest } = attempt;
  return {
    ...rest,
    questions: (attempt.questions ?? []).map(stripQuestion),
    released,
    totals: released ? totalsOf(attempt.questions, grades) : null,
  };
};

export const tabSwitches = (attempt) => attempt.flags.filter((f) => f.type === "tab-switch");
export const answeredIn = (attempt) =>
  (attempt.questions ?? []).filter((q) => {
    const a = attempt.answers?.[q.id];
    return isChoice(q) ? Number.isInteger(a) : typeof a === "string" && a.trim().length > 0;
  }).length;
