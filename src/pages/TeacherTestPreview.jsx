import { useNavigate, useParams, useSearchParams } from "react-router";
import { EmptyState, PageError, PageLoading } from "@/components/common";
import { TestPreview } from "@/components/teacher-question-bank/TestPreview";
import { useTest } from "@/hooks/useTests";

// Fullscreen "what students see" view for a stored test. For personalized
// tests ?v=<n> picks which student's variant to show.
const TeacherTestPreview = () => {
  const { testId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { data: test, isLoading, error, refetch } = useTest(testId);

  if (isLoading) return <PageLoading />;
  if (error) return <PageError error={error} onRetry={refetch} />;
  if (!test) {
    return (
      <EmptyState
        title="Test not found"
        body="It may have been deleted."
        action="Back to drafts"
        onAction={() => navigate("/teacher/drafts")}
      />
    );
  }

  const variant = test.mode === "personal" ? test.variants?.[Number(params.get("v")) || 0] : null;
  const questions = variant ? variant.questions : (test.questionSet ?? []);

  return (
    <TestPreview
      title={test.title}
      forStudent={variant?.studentName}
      questions={questions}
      onExit={() => navigate(`/teacher/drafts/${test.id}`)}
    />
  );
};

export default TeacherTestPreview;
