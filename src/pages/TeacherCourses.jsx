import { useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { TeacherLMS } from "@/components/teacher-courses/TeacherLMS";

const TeacherCourses = () => {
  const { courses, setCourses } = useApp();
  const navigate = useNavigate();
  return (
    <TeacherLMS
      courses={courses}
      onCoursesChange={setCourses}
      onOpenDiscussion={() => navigate("/teacher/chat")}
    />
  );
};

export default TeacherCourses;
