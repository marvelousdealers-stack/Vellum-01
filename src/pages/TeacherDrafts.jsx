import { useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { DraftsList } from "@/components/teacher-drafts/DraftsList";

const TeacherDrafts = () => {
  const { drafts, setDrafts, setOpenDraft, setConfirmState } = useApp();
  const toast = useToast();
  const navigate = useNavigate();

  return (
    <DraftsList
      drafts={drafts}
      onOpen={(d) => {
        setOpenDraft(d);
        navigate("/teacher/drafts/new");
      }}
      onNew={() => navigate("/teacher/drafts/new")}
      onPublish={(d) => toast.push(`Publishing "${d.title}"…`, "success")}
      onSchedule={(d) => toast.push(`Scheduling "${d.title}"…`, "info")}
      onDelete={(d) =>
        setConfirmState({
          title: `Delete "${d.title}"?`,
          message:
            "This draft and its questions will be removed. You can't undo this.",
          confirmLabel: "Delete draft",
          onConfirm: () => {
            setDrafts((prev) => prev.filter((x) => x.id !== d.id));
            toast.push(`Deleted "${d.title}"`, "info");
          },
        })
      }
      onRegenerate={() => {}}
      onDuplicate={() => {}}
    />
  );
};

export default TeacherDrafts;
