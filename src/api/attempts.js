import { call } from "./client";

// ═══════════════════════════════════════════════════════════════
// ATTEMPTS API — the student side of a test (API-CONTRACT.md "Attempts").
// The server decides who the student is (from the token), the deadline,
// what is graded and when results are released; the client just sends what
// the student did.
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/tests/:id/start
 * Starts the student's attempt, or returns the one they already have.
 * Rejects with code NOT_OPEN (409) or NO_VARIANT (403).
 */
export const startAttempt = (testId) =>
  call(`/tests/${testId}/start`, { invalidates: [["attempts"]] });

/**
 * PUT /api/attempts/:id/answers — best-effort backup of one answer.
 * The test page keeps answers in its own state and sends them all again on
 * submit, so a failed save is retried but never loses anything.
 */
export const saveAnswer = (attemptId, questionId, value) =>
  call(`/attempts/${attemptId}/answers`, { method: "PUT", body: { questionId, value } });

/** POST /api/tests/:id/flag — an anti-cheat event, e.g. "tab-switch". */
export const logFlag = (testId, type) =>
  call(`/tests/${testId}/flag`, { method: "POST", body: { type } });

/**
 * POST /api/tests/:id/submit  body: { reason, answers }
 * reason: "manual" | "timeout" | "stopped". Idempotent. The full answer map
 * is sent so submitting never depends on earlier saves having arrived.
 */
export const submitAttempt = (testId, { reason = "manual", answers } = {}) =>
  call(`/tests/${testId}/submit`, {
    method: "POST",
    body: { reason, answers },
    invalidates: [["attempts"], ["tests"], ["grading"], ["review"]],
  });
