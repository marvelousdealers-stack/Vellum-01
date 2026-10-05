import { useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { StudentLMS } from "@/components/student-courses/StudentLMS";

const StudentCourses = () => {
  const { courses, courseLessons, setCourseLessons } = useApp();
  const navigate = useNavigate();
  return (
    <StudentLMS
      courses={courses}
      lessons={courseLessons}
      onLessonsChange={(courseId, next) =>
        setCourseLessons((prev) => ({ ...prev, [courseId]: next }))
      }
      onOpenDiscussion={() => navigate("/student/chat")}
    />
  );
};

export default StudentCourses;
