import { call } from "./client";

// ═══════════════════════════════════════════════════════════════
// TESTS API — one function per endpoint in API-CONTRACT.md ("Tests").
// Reads happen through hooks/useTests; these are the writes. Each refreshes
// the cached list afterwards, so screens update without extra code.
// ═══════════════════════════════════════════════════════════════

// Matches §7.7 of the guide: while a test is active, the student's
// browser checks in periodically to see if the teacher has stopped the
// test early. 20s is the interval the guide itself suggests.
export const LIVE_STATUS_INTERVAL_MS = 20_000;

const tests = [["tests"]];

/**
 * POST /api/tests/generate
 * `config` = DraftRulesScreen output (title?, mix, targetMarks, duration,
 * mode, difficulty, focusTopics, instruction) plus classId, cls, subject.
 * Returns the saved draft; personalized mode carries its variants inline.
 */
export const generateTest = (config) =>
  call("/tests/generate", { method: "POST", body: config, invalidates: tests });

/** POST /api/tests/:id/regenerate — rebuild questions from the stored rules. */
export const regenerateTest = (id) =>
  call(`/tests/${id}/regenerate`, { method: "POST", invalidates: tests });

/**
 * PUT /api/tests/:id — edit a draft ({ title?, questionSet?, variants? }).
 * Callers that autosave pass { refresh: false } and refresh once at the end,
 * instead of refetching the list on every pause in typing.
 */
export const saveTest = (id, patch, { refresh = true } = {}) =>
  call(`/tests/${id}`, { method: "PUT", body: patch, invalidates: refresh ? tests : [] });

/** DELETE /api/tests/:id */
export const deleteTest = (id) =>
  call(`/tests/${id}`, { method: "DELETE", invalidates: [...tests, ["attempts"]] });

/** POST /api/tests/:id/duplicate */
export const duplicateTest = (id) =>
  call(`/tests/${id}/duplicate`, { method: "POST", invalidates: tests });

/**
 * POST /api/tests/:id/publish
 * body: { availableFrom?, availableUntil?, settings? }
 *   neither time       → open now; the teacher stops it manually
 *   availableFrom      → opens then (scheduled until)
 *   availableUntil     → closes automatically then
 *   settings           → { release, aiGrading, allowBack }
 * The server rejects the publish (400) if any question is invalid.
 */
export const publishTest = (id, { availableFrom, availableUntil, settings } = {}) =>
  call(`/tests/${id}/publish`, {
    method: "POST",
    body: { availableFrom, availableUntil, settings },
    invalidates: tests,
  });

/** POST /api/tests/:id/start-now — open a scheduled test immediately. */
export const startTestNow = (id) =>
  call(`/tests/${id}/start-now`, { method: "POST", invalidates: tests });

/** POST /api/tests/:id/stop-now — close it for every student. */
export const stopTestNow = (id) =>
  call(`/tests/${id}/stop-now`, { method: "POST", invalidates: [...tests, ["attempts"]] });

/** POST /api/tests/:id/extend — add minutes to the window and to open attempts. */
export const extendTest = (id, minutes) =>
  call(`/tests/${id}/extend`, {
    method: "POST",
    body: { minutes },
    invalidates: [...tests, ["attempts"]],
  });

/**
 * GET /api/tests/:id/live-status → { stopped, closesAt, deadline }
 * `deadline` is the asking student's own, so an extension reaches a test
 * that is already open.
 */
export const getLiveStatus = (id) => call(`/tests/${id}/live-status`);
