import { useNavigate } from "react-router";
import { generateTest } from "@/api/tests";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { Scope } from "@/components/common";
import { DraftRulesScreen } from "@/components/teacher-new-test/DraftRulesScreen";

const TeacherNewTest = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { activeSubject } = useApp();

  return (
    <DraftRulesScreen
      scope={<Scope />}
      onCancel={() => navigate("/teacher/drafts")}
      onCreate={async (config) => {
        // Throws on failure; DraftRulesScreen shows the error toast.
        const test = await generateTest({
          ...config,
          subjectId: activeSubject.id,
        });
        toast.push(
          config.mode === "personal"
            ? "Personalized tests generated — spot-check a few, then publish"
            : "Draft ready — review the questions, then publish",
          "success",
        );
        navigate(`/teacher/drafts/${test.id}`, { replace: true });
      }}
    />
  );
};

export default TeacherNewTest;
