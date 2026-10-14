import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createUser, deleteClass, updateClass, updateUser } from "@/api/admin";
import { PageError, PageLoading } from "@/components/common";
import { AddStudentModal } from "@/components/admin-classes/AddStudentModal";
import { ClassDetail } from "@/components/admin-classes/ClassDetail";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { useClassRoster, useUsers } from "@/hooks/useAdmin";
import { useClasses } from "@/hooks/useSubjects";

// ═══════════════════════════════════════════════════════════════
// ADMIN — ONE CLASS (/admin/classes/:classId)
// ═══════════════════════════════════════════════════════════════
const AdminClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { setConfirmState } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const classesRes = useClasses();
  const rosterRes = useClassRoster(classId);
  const usersRes = useUsers();

  const loading = classesRes.isLoading || rosterRes.isLoading || usersRes.isLoading;
  if (loading) return <PageLoading />;
  const loadError = classesRes.error || rosterRes.error || usersRes.error;
  if (loadError) return <PageError error={loadError} onRetry={() => { classesRes.refetch(); rosterRes.refetch(); usersRes.refetch(); }} />;

  const cls = (classesRes.data ?? []).find((c) => c.id === classId);
  if (!cls || !rosterRes.data) {
    return <PageError error={{ message: "That class doesn't exist (it may have been deleted)." }} />;
  }
  const users = usersRes.data ?? [];
  const back = () => navigate("/admin/classes");
  const fail = (err, fallback) => toast.push(err.message || fallback, "error");

  return (
    <>
      <ClassDetail
        cls={cls}
        roster={rosterRes.data}
        teachers={users.filter((u) => u.role === "teacher")}
        onBack={back}
        onAddStudent={() => setAddOpen(true)}
        onUpdateClass={(data) => updateClass(cls.id, data)}
        onDeleteClass={() =>
          setConfirmState({
            title: `Delete "${cls.name}"?`,
            message: `This removes the class, unassigns its ${cls.studentCount} students and removes its ${cls.subjectCount} subjects. Accounts stay. It can't be deleted while it has tests. This cannot be undone.`,
            confirmLabel: "Delete class",
            onConfirm: async () => {
              try {
                await deleteClass(cls.id);
                toast.push(`Deleted "${cls.name}"`, "info");
                back();
              } catch (err) {
                fail(err, "Couldn't delete the class");
              }
            },
          })
        }
        onRemoveStudent={(s) =>
          setConfirmState({
            title: `Remove ${s.name} from ${cls.name}?`,
            message: `${s.name} will lose access to this class's tests and dashboard until they are added to a class again. Their test history and results stay intact.`,
            confirmLabel: "Remove from class",
            onConfirm: async () => {
              try {
                await updateUser(s.id, { classId: null });
                toast.push(`${s.name} removed from ${cls.name}`, "info");
              } catch (err) {
                fail(err, "Couldn't remove the student");
              }
            },
          })
        }
      />

      <AddStudentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        unassigned={users.filter((u) => u.role === "student" && !u.classId)}
        onCreate={async ({ name, email }) => {
          await createUser({ name, email, role: "student", classId: cls.id });
          toast.push(`${name} added to the class`, "success");
        }}
        onEnroll={async (userId) => {
          const u = users.find((x) => x.id === userId);
          await updateUser(userId, { classId: cls.id });
          toast.push(`${u?.name ?? "Student"} added to the class`, "success");
        }}
      />
    </>
  );
};

export default AdminClassDetail;
