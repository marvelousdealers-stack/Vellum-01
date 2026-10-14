import { call } from "./client";

// ═══════════════════════════════════════════════════════════════
// SUBJECTS API — see API-CONTRACT.md ("Classes & subjects").
// Reads happen through hooks/useSubjects (GET /classes, GET /subjects);
// these are the writes. A subject belongs to one class and carries the
// teacher's course outline text. Tests only show a subject's name, which
// the server keeps in step on rename.
// ═══════════════════════════════════════════════════════════════
const refresh = [["subjects"], ["tests"]];

/** POST /api/subjects — { classId, name, outline? } → Subject. 409 DUPLICATE_SUBJECT. */
export const createSubject = (body) =>
  call("/subjects", { method: "POST", body, invalidates: refresh });

/** PUT /api/subjects/:id — { name?, outline? } → Subject. */
export const updateSubject = (id, patch) =>
  call(`/subjects/${id}`, { method: "PUT", body: patch, invalidates: refresh });

/** DELETE /api/subjects/:id — 409 SUBJECT_IN_USE while tests reference it. */
export const deleteSubject = (id) =>
  call(`/subjects/${id}`, { method: "DELETE", invalidates: refresh });
