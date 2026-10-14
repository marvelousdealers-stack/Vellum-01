import { useMemo } from "react";
import { call } from "@/api/client";
import { useResource } from "./useResource";
import { useTests } from "./useTests";

/**
 * The signed-in student's own attempts → { data: Attempt[], isLoading, error }.
 * Real endpoint: GET /api/attempts (scoped by the token). Each attempt has its
 * `questions` (no answer key), `answers`, `flags`, `deadline`, `status`, and
 * the server's word on results: `released` and `totals` (null until released).
 */
export const useMyAttempts = () =>
  useResource(["attempts", "mine"], {
    fetch: () => call("/attempts"),
    refetchInterval: 30_000,
  });

/** The student's attempt at one test, if they have started it. */
export const useStudentAttempt = (testId) => {
  const { data, ...rest } = useMyAttempts();
  const attempt = useMemo(
    () => (data ?? []).find((a) => a.testId === testId) ?? null,
    [data, testId],
  );
  return { ...rest, data: attempt };
};

/**
 * Teacher's live roster for one test → { data: Row[], isLoading, error }.
 * Real endpoint: GET /api/tests/:id/attempts — one row per student in the
 * class: { student: { id, name, roll }, attempt: { id, status, startedAt,
 * deadline, submittedAt, submitReason, progress: { answered, total },
 * flags: [{ type, at }] } | null }. Polled every 20 s.
 */
export const useTestRoster = (testId) =>
  useResource(["attempts", "test", testId], {
    fetch: () => call(`/tests/${testId}/attempts`),
    refetchInterval: 20_000,
    enabled: Boolean(testId),
  });

/**
 * What a student sees on the Tests page, bucketed:
 *   open      — live and not submitted (start or resume)
 *   upcoming  — published, window not open yet
 *   done      — submitted (carries the server's `released` / `totals`)
 *   missed    — window closed and they never started
 * Each entry is { test, attempt|null }. Bucketing is presentation; every
 * fact it uses (status, deadline, released) comes from the server.
 */
export const useStudentTests = () => {
  const testsRes = useTests();
  const attemptsRes = useMyAttempts();
  const tests = testsRes.data;
  const attempts = attemptsRes.data;

  const data = useMemo(() => {
    const out = { open: [], upcoming: [], done: [], missed: [] };
    tests.forEach((test) => {
      const attempt = (attempts ?? []).find((a) => a.testId === test.id) ?? null;
      if (attempt?.status === "submitted") {
        out.done.push({ test, attempt, released: attempt.released, totals: attempt.totals });
      } else if (attempt?.status === "in_progress" || test.status === "live") {
        // An in-progress attempt on an ended test is closed by the server;
        // until the next refresh it is simply not listed as open.
        if (test.status === "live") out.open.push({ test, attempt });
      } else if (test.status === "scheduled") {
        out.upcoming.push({ test, attempt });
      } else if (!attempt) {
        out.missed.push({ test, attempt });
      }
    });
    out.done.sort((a, b) => b.attempt.submittedAt - a.attempt.submittedAt);
    out.upcoming.sort((a, b) => a.test.schedule.availableFrom - b.test.schedule.availableFrom);
    return out;
  }, [tests, attempts]);

  return {
    data,
    isLoading: testsRes.isLoading || attemptsRes.isLoading,
    error: testsRes.error || attemptsRes.error,
    refetch: () => Promise.all([testsRes.refetch(), attemptsRes.refetch()]),
  };
};
