import { useNavigate } from "react-router";
import { QuestionBank } from "@/components/teacher-question-bank/QuestionBank";

const TeacherQuestionBank = () => {
  const navigate = useNavigate();
  return <QuestionBank onAddToDraft={() => navigate("/teacher/drafts/new")} />;
};

export default TeacherQuestionBank;
