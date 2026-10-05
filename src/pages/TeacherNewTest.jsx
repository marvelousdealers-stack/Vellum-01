import { useNavigate } from "react-router";
import { useToast } from "@/context/ToastContext";
import { DraftRulesScreen } from "@/components/teacher-new-test/DraftRulesScreen";

const TeacherNewTest = () => {
  const navigate = useNavigate();
  const toast = useToast();
  return (
    <DraftRulesScreen
      onCancel={() => navigate("/teacher/drafts")}
      onCreate={async () => {
        toast.push("Test generated", "success");
        navigate("/teacher/drafts");
      }}
    />
  );
};

export default TeacherNewTest;
