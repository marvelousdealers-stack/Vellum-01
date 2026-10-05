import { useApp } from "@/context/AppContext";
import { ClassDiscussion } from "@/components/common/discussion/ClassDiscussion";

const TeacherDiscussion = () => {
  const { threads, setThreads } = useApp();
  return (
    <ClassDiscussion
      role="teacher"
      threads={threads}
      onThreadsChange={setThreads}
    />
  );
};

export default TeacherDiscussion;
