import { useState } from "react";
import { AnalyticsOverview } from "@/components/teacher-analytics/AnalyticsOverview";
import { StudentProfile } from "@/components/teacher-analytics/StudentProfile";

// ─── Teacher analytics route: wraps analytics + student-profile drill-down.
const TeacherAnalytics = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  return selectedStudent ? (
    <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />
  ) : (
    <AnalyticsOverview onStudentClick={setSelectedStudent} />
  );
};

export default TeacherAnalytics;
