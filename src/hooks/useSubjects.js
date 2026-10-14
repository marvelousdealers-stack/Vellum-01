import { call } from "@/api/client";
import { useResource } from "./useResource";

/**
 * Classes the signed-in user can see → { data: [{ id, code, name, studentCount }] }.
 * Real endpoint: GET /api/classes — teachers get the classes they teach,
 * students their own class, admins every class.
 */
export const useClasses = ({ enabled = true } = {}) =>
  useResource(["classes"], { fetch: () => call("/classes"), enabled });

/**
 * Subjects across the user's classes → { data: [{ id, classId, name, outline }] }.
 * Real endpoint: GET /api/subjects (optional ?classId=). Order = creation
 * order, so the first subject of a class is its default.
 */
export const useSubjects = ({ enabled = true } = {}) =>
  useResource(["subjects"], { fetch: () => call("/subjects"), enabled });
