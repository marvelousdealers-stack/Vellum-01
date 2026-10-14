import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { useTests } from "@/hooks/useTests";
import {
  deleteTest,
  duplicateTest,
  regenerateTest,
  startTestNow,
  stopTestNow,
} from "@/api/tests";
import { PageError, PageLoading } from "@/components/common";
import { DraftsList } from "@/components/teacher-drafts/DraftsList";
import { PublishTestModal } from "@/components/teacher-drafts/PublishTestModal";

const TeacherDrafts = () => {
  const { setConfirmState } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const { data: tests, isLoading, error, refetch } = useTests();
  const [publishing, setPublishing] = useState(null);

  // Wraps an async action with a consistent error toast.
  const run = async (fn, successMessage) => {
    try {
      await fn();
      if (successMessage) toast.push(successMessage, "success");
    } catch (err) {
      toast.push(err?.message || "Something went wrong — try again", "error");
    }
  };

  if (isLoading) return <PageLoading />;
  if (error) return <PageError error={error} onRetry={refetch} />;

  return (
    <>
      <DraftsList
        drafts={tests}
        onOpen={(d) => navigate(`/teacher/drafts/${d.id}`)}
        onNew={() => navigate("/teacher/drafts/new")}
        onPublish={(d) => setPublishing(d.id)}
        onLiveView={(d) => navigate(`/teacher/live?test=${d.id}`)}
        onStartNow={(d) =>
          run(() => startTestNow(d.id), `"${d.title}" is now open to students`)
        }
        onStop={(d) =>
          setConfirmState({
            title: `Stop "${d.title}" now?`,
            message:
              "Every student currently taking it will be submitted automatically within about 20 seconds.",
            confirmLabel: "Stop test",
            onConfirm: () => run(() => stopTestNow(d.id), "Test stopped"),
          })
        }
        onDelete={(d) =>
          setConfirmState({
            title: `Delete "${d.title}"?`,
            message:
              "This test and its questions will be removed. You can't undo this.",
            confirmLabel: "Delete test",
            onConfirm: () => run(() => deleteTest(d.id), `Deleted "${d.title}"`),
          })
        }
        onRegenerate={(d) =>
          setConfirmState({
            title: `Regenerate "${d.title}"?`,
            message:
              "All questions are replaced with a fresh set built from the same rules. Any edits you made are lost.",
            confirmLabel: "Regenerate",
            onConfirm: () => {
              toast.push("Regenerating…", "info", { duration: 1500 });
              return run(() => regenerateTest(d.id), "New questions ready to review");
            },
          })
        }
        onDuplicate={(d) =>
          run(() => duplicateTest(d.id), `Duplicated as "${d.title} (copy)"`)
        }
      />
      <PublishTestModal
        key={publishing ?? "none"}
        test={tests.find((t) => t.id === publishing) ?? null}
        open={publishing != null}
        onClose={() => setPublishing(null)}
        onPublished={() => setPublishing(null)}
      />
    </>
  );
};

export default TeacherDrafts;
