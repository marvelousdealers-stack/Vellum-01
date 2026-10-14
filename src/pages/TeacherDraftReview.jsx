import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { EmptyState, PageError, PageLoading } from "@/components/common";
import { DraftReviewScreen } from "@/components/teacher-drafts/DraftReviewScreen";
import { VariantsReviewScreen } from "@/components/teacher-drafts/VariantsReviewScreen";
import { PublishTestModal } from "@/components/teacher-drafts/PublishTestModal";
import { useToast } from "@/context/ToastContext";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { useTest } from "@/hooks/useTests";

// Review step of the generate → review → publish flow (§7.6: "the teacher
// reviews the drafted test, can edit any question, and only then
// publishes it"). Edits live in local state and are autosaved to the server
// (see useDraftAutosave); publishing flushes them first so the server
// validates exactly what the teacher sees.
const TeacherDraftReview = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: loaded, isLoading, error, refetch } = useTest(testId);
  const { edits, change, flush, state: saveState } = useDraftAutosave(testId);
  const [publishOpen, setPublishOpen] = useState(false);

  if (isLoading) return <PageLoading />;
  if (error) return <PageError error={error} onRetry={refetch} />;
  if (!loaded) {
    return (
      <EmptyState
        title="Test not found"
        body="It may have been deleted, or the link is out of date."
        action="Back to drafts"
        onAction={() => navigate("/teacher/drafts")}
      />
    );
  }

  // The server's copy until the teacher edits something; then their edits.
  const test = { ...loaded, ...edits };
  const readOnly = loaded.status === "live" || loaded.status === "completed";
  const scope = `${test.subject} · ${test.cls}`;
  const config = { duration: 30, mix: [], ...test.config, mode: test.mode };
  const toList = () => navigate("/teacher/drafts");

  // Send pending edits first, so what's previewed or published is what's saved.
  const afterSaving = async (next) => {
    try {
      await flush();
      next();
    } catch (err) {
      toast.push(err?.message || "Couldn't save your changes — try again", "error");
    }
  };
  const preview = (variant = 0) =>
    afterSaving(() =>
      navigate(`/teacher/preview/${test.id}${variant ? `?v=${variant}` : ""}`),
    );
  const askPublish = () => afterSaving(() => setPublishOpen(true));

  const shared = {
    config,
    scope,
    title: test.title,
    readOnly,
    saveState: readOnly ? undefined : saveState,
    onBack: toList,
    backLabel: "← Back to drafts",
    onPublish: readOnly ? undefined : askPublish,
  };

  return (
    <>
      {test.mode === "personal" ? (
        <VariantsReviewScreen
          {...shared}
          variants={test.variants ?? []}
          onVariantsChange={(variants) => change({ variants })}
          onPreview={preview}
          onPublishAll={shared.onPublish}
        />
      ) : (
        <DraftReviewScreen
          {...shared}
          questions={test.questionSet ?? []}
          onQuestionsChange={(questionSet) => change({ questionSet })}
          onPreview={() => preview(0)}
          onSave={
            readOnly
              ? undefined
              : () =>
                  afterSaving(() => {
                    toast.push("Draft saved", "success");
                    toList();
                  })
          }
        />
      )}

      <PublishTestModal
        test={test}
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublished={toList}
      />
    </>
  );
};

export default TeacherDraftReview;
