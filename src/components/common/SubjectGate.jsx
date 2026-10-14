import { useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { resolvePath } from "@/routes/paths";
import { EmptyState } from "./EmptyState";
import { PageError, PageLoading } from "./QueryState";

// Wraps teacher pages that act on one subject (materials, new test): waits for
// classes/subjects to load, and points to Subjects when the class has none.
export const SubjectGate = ({ children }) => {
  const navigate = useNavigate();
  const { activeSubject, activeClassObj, scopeLoading, scopeError } = useApp();
  if (scopeLoading) return <PageLoading />;
  if (scopeError) return <PageError error={scopeError} />;
  if (!activeSubject) {
    return (
      <div className="mx-auto max-w-[760px] px-5 py-10">
        <EmptyState
          title="Add a subject first"
          body={`${activeClassObj?.name ?? "This class"} has no subjects yet. Create one, then come back.`}
          action="Go to Subjects"
          onAction={() => navigate(resolvePath("teacher", "subjects"))}
        />
      </div>
    );
  }
  return children;
};
