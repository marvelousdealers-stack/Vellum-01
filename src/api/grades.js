import { call } from "./client";

// ═══════════════════════════════════════════════════════════════
// GRADING API (API-CONTRACT.md "Grading"). Marking itself happens on the
// server when a student submits; these are the teacher's calls on top of it.
// Reads: hooks/useGrading (queue) and useAttemptReview (student review).
// ═══════════════════════════════════════════════════════════════
const refresh = [["grading"], ["attempts"], ["review"]];

/**
 * PATCH /api/grades/:attemptId/:questionId  body: { marks, feedback?, final }
 *   final true  → accept or override: it now counts for the student
 *   final false → save as a draft, still waiting
 * Rejects with code INVALID_MARKS (400) outside 0..max.
 */
export const reviewGrade = (attemptId, questionId, { marks, feedback = "", final = true }) =>
  call(`/grades/${attemptId}/${questionId}`, {
    method: "PATCH",
    body: { marks, feedback, final },
    invalidates: refresh,
  });

/**
 * POST /api/grading/approve  body: { items: [{ attemptId, questionId }] }
 * Accepts AI marks unchanged. Returns { approved }.
 */
export const approveGrades = (items) =>
  call("/grading/approve", { method: "POST", body: { items }, invalidates: refresh });
