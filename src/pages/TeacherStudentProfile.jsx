import { useNavigate, useParams } from "react-router";
import { PageError } from "@/components/common";
import { StudentProfile } from "@/components/teacher-analytics/StudentProfile";
import { STUDENTS } from "@/data/users";

// /teacher/analytics/:studentId — the id is the student's roll number (e.g. 11A-19)
// until analytics moves to real data.
const TeacherStudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const student = STUDENTS.find((s) => s.roll === studentId);
  if (!student) {
    return <PageError error={{ message: "We couldn't find that student." }} onRetry={() => navigate("/teacher/analytics")} />;
  }
  return <StudentProfile student={student} onBack={() => navigate("/teacher/analytics")} />;
};

export default TeacherStudentProfile;
