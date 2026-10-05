import { useApp } from "@/context/AppContext";
import { ClassDiscussion } from "@/components/common/discussion/ClassDiscussion";

const StudentDiscussion = () => {
  const { threads, setThreads } = useApp();
  return (
    <ClassDiscussion
      role="student"
      threads={threads}
      onThreadsChange={setThreads}
    />
  );
};

export default StudentDiscussion;
