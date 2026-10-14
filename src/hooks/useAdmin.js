import { call } from "@/api/client";
import { useResource } from "./useResource";

/**
 * Every teacher and student → { data: [{ id, name, email, role, active, cls?, classId?, roll?, classIds? }] }.
 * Real endpoint: GET /api/users (admin only; optional ?role=).
 */
export const useUsers = ({ enabled = true } = {}) =>
  useResource(["users"], { fetch: () => call("/users"), enabled });

/**
 * One class's people → { data: { teachers: [{ id, name, email, classCount }],
 * students: [{ id, name, roll, email, active, average }] } }.
 * Real endpoint: GET /api/classes/:id/roster (admin only). `average` is the
 * student's mean % across submitted tests, or null before their first one.
 */
export const useClassRoster = (classId) =>
  useResource(["classes", classId, "roster"], {
    fetch: () => call(`/classes/${classId}/roster`),
    enabled: !!classId,
  });
