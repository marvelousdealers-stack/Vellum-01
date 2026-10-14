import { useMemo } from "react";
import { call } from "@/api/client";
import { formatDateTime } from "@/lib/time";
import { useResource } from "./useResource";

/**
 * Written answers to review → { data: QueueItem[], isLoading, error }.
 * Real endpoint: GET /api/grading/queue. Item: { id, attemptId, questionId,
 * testId, student, roll, test, submittedAt, question, topic, answer,
 * modelAnswer, maxScore, score, aiScore|null, confidence: low|med|high|null,
 * manual, status: pending|reviewed, source, rubric, feedback, flags }.
 * `date` is added here for display.
 */
export const useGradeQueue = ({ enabled = true } = {}) => {
  const res = useResource(["grading", "queue"], {
    fetch: () => call("/grading/queue"),
    enabled,
    refetchInterval: 30_000,
  });
  const data = useMemo(
    () => (res.data ?? []).map((i) => ({ ...i, date: formatDateTime(i.submittedAt) })),
    [res.data],
  );
  return { ...res, data };
};

/**
 * A student's review of one submitted attempt.
 * → { data: Review | null, isLoading, error, locked, refetch }
 * Real endpoint: GET /api/attempts/:id/review. `locked` is true when the
 * server answers 403 NOT_RELEASED; `error` is set for anything else.
 */
export const useAttemptReview = (attemptId) => {
  const res = useResource(["review", attemptId], {
    fetch: () => call(`/attempts/${attemptId}/review`),
    enabled: Boolean(attemptId),
  });
  const locked = res.error?.code === "NOT_RELEASED";
  return {
    data: res.data ?? null,
    isLoading: res.isLoading,
    error: locked ? null : res.error,
    locked,
    refetch: res.refetch,
  };
};
