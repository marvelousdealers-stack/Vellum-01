import { call } from "./client";

// ═══════════════════════════════════════════════════════════════
// ADMIN API — see API-CONTRACT.md ("Admin: accounts & classes").
// Reads happen through hooks/useAdmin (GET /users, GET /classes/:id/roster)
// and hooks/useSubjects (GET /classes). These are the writes; each refreshes
// the lists it affects. Admin only — everyone else gets 403.
// ═══════════════════════════════════════════════════════════════
const people = [["users"], ["classes"]];

/** POST /api/users — { name, email, role: "teacher"|"student", classId? (student), classIds? (teacher) } */
export const createUser = (body) => call("/users", { method: "POST", body, invalidates: people });

/**
 * PUT /api/users/:id — { active? } or, for a student, { classId } (null = unassign).
 * `409 CANNOT_CHANGE_SELF` / `CANNOT_CHANGE_ADMIN`.
 */
export const updateUser = (id, patch) =>
  call(`/users/${id}`, { method: "PUT", body: patch, invalidates: people });

/** DELETE /api/users/:id — test history stays; the account and its class links go. */
export const deleteUser = (id) => call(`/users/${id}`, { method: "DELETE", invalidates: people });

/** POST /api/classes — { name, teacherIds? }. The server derives `code` ("Grade 11 — Section A" → "11A"). */
export const createClass = (body) => call("/classes", { method: "POST", body, invalidates: people });

/** PUT /api/classes/:id — { name?, teacherIds? } (the code never changes). */
export const updateClass = (id, patch) =>
  call(`/classes/${id}`, { method: "PUT", body: patch, invalidates: people });

/** DELETE /api/classes/:id — `409 CLASS_IN_USE` while the class has tests. Students are unassigned; its subjects go. */
export const deleteClass = (id) =>
  call(`/classes/${id}`, { method: "DELETE", invalidates: [...people, ["subjects"]] });
