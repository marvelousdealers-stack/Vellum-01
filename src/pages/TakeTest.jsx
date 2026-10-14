import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { startAttempt } from "@/api/attempts";
import { EmptyState, PageError, PageLoading } from "@/components/common";
import { SubmittedScreen } from "@/components/take-test/SubmittedScreen";
import { TestIntro } from "@/components/take-test/TestIntro";
import { TestRunner } from "@/components/take-test/TestRunner";
import { useToast } from "@/context/ToastContext";
import { useStudentAttempt } from "@/hooks/useAttempts";
import { useTest } from "@/hooks/useTests";

// Student test flow: intro → running → submitted. Which of the three shows
// is decided by the attempt itself, so refreshing mid-test lands back on
// "Resume" and a finished test always shows the submitted screen. Everything
// the runner needs comes from the attempt (its own question snapshot), so a
// student never needs access to the teacher's copy of the test.
const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const testRes = useTest(testId);
  const attemptRes = useStudentAttempt(testId);
  const test = testRes.data;
  // `started` / `finished` hold the server's answers to start and submit, so
  // the screen can move on immediately instead of waiting for the lists to
  // refetch. If time runs out or the teacher stops the test while the student
  // is away, the server closes the attempt itself and it arrives submitted.
  const [started, setStarted] = useState(null);
  const [finished, setFinished] = useState(null);
  const [starting, setStarting] = useState(false);
  const listed = attemptRes.data;
  const attempt = finished ?? (listed?.status === "submitted" ? listed : (started ?? listed));

  const exit = () => navigate("/student/tests");

  if (testRes.isLoading || attemptRes.isLoading) return <PageLoading />;
  const error = testRes.error || attemptRes.error;
  if (error) {
    return <PageError error={error} onRetry={() => testRes.refetch()} />;
  }

  const visible = test && test.status !== "draft";
  if (!visible) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg p-6">
        <EmptyState
          title="Test not available"
          body="It may have been removed, or it isn't assigned to your class."
          action="Back to tests"
          onAction={exit}
        />
      </div>
    );
  }

  if (attempt?.status === "submitted") {
    return (
      <SubmittedScreen
        test={test}
        attempt={attempt}
        questions={attempt.questions ?? []}
        result={{ released: attempt.released, totals: attempt.totals }}
        onExit={exit}
      />
    );
  }

  if (started && attempt?.status === "in_progress") {
    return (
      <TestRunner
        test={test}
        attempt={attempt}
        questions={attempt.questions ?? []}
        onSubmitted={setFinished}
      />
    );
  }

  const notOpen =
    !attempt && test.status !== "live"
      ? test.status === "scheduled"
        ? "This test hasn't opened yet."
        : "This test is closed."
      : null;

  const begin = async () => {
    setStarting(true);
    try {
      setStarted(await startAttempt(test.id));
    } catch (err) {
      toast.push(err?.message || "Couldn't start the test", "error");
    } finally {
      setStarting(false);
    }
  };

  return (
    <TestIntro
      test={test}
      questionCount={test.questions}
      marks={test.marks}
      attempt={attempt}
      starting={starting}
      openError={notOpen}
      onBegin={begin}
      onExit={exit}
    />
  );
};

export default TakeTest;
