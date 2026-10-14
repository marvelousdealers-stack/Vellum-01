import { useNavigate, useParams } from "react-router";
import { EmptyState, PageError, PageLoading } from "@/components/common";
import { AttemptReview } from "@/components/student-history/AttemptReview";
import { Button } from "@/components/ui/button";
import { useAttemptReview } from "@/hooks/useGrading";

const StudentAttemptReview = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, locked, refetch } = useAttemptReview(attemptId);
  const back = () => navigate("/student/history");

  if (isLoading) return <PageLoading />;
  if (error) {
    return error.status === 404 ? (
      <EmptyState
        title="Attempt not found"
        body="It may have been removed."
        action="Back to history"
        onAction={back}
      />
    ) : (
      <PageError error={error} onRetry={refetch} />
    );
  }
  if (locked) {
    return (
      <EmptyState
        title="Results aren't released yet"
        body="Your answers are in. Your teacher's settings keep results hidden until the test has closed — check back then."
        action="Back to history"
        onAction={back}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <Button variant="ghost" onClick={back} className="mb-4 -ml-3">
        ← Test history
      </Button>
      <div className="mx-auto mb-8 max-w-[860px]">
        <div className="mb-1 text-[13px] font-medium text-ink-3">
          {data.test.subject} · {data.test.cls}
        </div>
        <h1 className="font-serif text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink tablet:text-[34px]">
          {data.test.title}
        </h1>
      </div>
      <AttemptReview review={data} />
    </div>
  );
};

export default StudentAttemptReview;
