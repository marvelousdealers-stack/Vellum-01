import { useEffect, useMemo, useState } from "react";
import { call } from "@/api/client";
import { timeAgo } from "@/lib/time";
import { useResource } from "./useResource";

// Re-renders now and then so "5 min ago" labels stay current.
const useNow = (intervalMs) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
};

/**
 * All tests the current user can see → { data: Test[], isLoading, error, refetch }.
 * Real endpoint: GET /api/tests — teachers get their own tests (with
 * questions); students get their class's published tests without questions.
 * Both include `status` (draft | scheduled | live | completed — the server's
 * word, from the schedule and any manual stop), `questionCount` and
 * `totalMarks`. The list is re-fetched every 30 s so a scheduled test going
 * live, or a test closing, shows up on its own.
 *
 * Added for display: `questions` / `marks` (aliases of the counts) and
 * `lastEdited` (relative time).
 */
export const useTests = () => {
  const res = useResource(["tests"], {
    fetch: () => call("/tests"),
    refetchInterval: 30_000,
  });
  const now = useNow(30_000);
  const data = useMemo(
    () =>
      (res.data ?? []).map((t) => ({
        ...t,
        questions: t.questionCount ?? 0,
        marks: t.totalMarks ?? 0,
        lastEdited: timeAgo(t.updatedAt, now),
      })),
    [res.data, now],
  );
  return { ...res, data };
};

/** One test by id → { data: Test | null, isLoading, error }. */
export const useTest = (id) => {
  const { data: all, ...rest } = useTests();
  const data = useMemo(() => all.find((t) => t.id === id) ?? null, [all, id]);
  return { ...rest, data };
};
