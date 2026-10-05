import { useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { CLASS_ROSTERS } from "@/data/classes";
import { AddStudentModal } from "@/components/admin-classes/AddStudentModal";
import { ClassDetail } from "@/components/admin-classes/ClassDetail";
import { ClassList } from "@/components/admin-classes/ClassList";

// ═══════════════════════════════════════════════════════════════
// ADMIN — CLASSES PAGE
//
// Split into list + detail based on `openClass` in app context.
// Both states share the same route entry so back/forward and
// refresh keep the user in the right place (state lives in
// AppProvider, which persists across route changes).
// ═══════════════════════════════════════════════════════════════
const AdminClasses = () => {
  const {
    openClass,
    setOpenClass,
    rosterOverrides,
    setRosterOverrides,
    addStudentOpen,
    setAddStudentOpen,
    setConfirmState,
  } = useApp();
  const toast = useToast();
  const navigate = useNavigate();

  if (!openClass) return <ClassList />;

  const getRoster = () =>
    rosterOverrides[openClass.name] ||
    CLASS_ROSTERS[openClass.name] || { teachers: [], students: [] };

  return (
    <>
      <ClassDetail
        cls={openClass}
        roster={getRoster()}
        onBack={() => {
          setOpenClass(null);
          navigate("/admin/classes");
        }}
        onStudentClick={(s) =>
          toast.push(`Opening profile for ${s.name}`, "info")
        }
        onAddStudent={() => setAddStudentOpen(true)}
        onUpdateClass={(data) => {
          toast.push(`Class renamed to "${data.name}"`, "success");
          setOpenClass({ ...openClass, name: data.name });
        }}
        onDeleteClass={() =>
          setConfirmState({
            title: `Delete "${openClass.name}"?`,
            message: `This removes the class and unassigns its ${openClass.students} students. Test history remains in the system but becomes inaccessible. This cannot be undone.`,
            confirmLabel: "Delete class",
            onConfirm: () => {
              toast.push(`Deleted "${openClass.name}"`, "info");
              setOpenClass(null);
              navigate("/admin/classes");
            },
          })
        }
        onRemoveStudent={(s) =>
          setConfirmState({
            title: `Remove ${s.name} from ${openClass.name}?`,
            message: `${s.name} has ${s.avg}% average in this class. Removing them will hide this class from their dashboard and unassign them from any tests attached to it. Their test history and past results remain intact and can be restored later.`,
            confirmLabel: "Remove from class",
            onConfirm: () => {
              const cur = getRoster();
              const next = {
                ...cur,
                students: cur.students.filter((x) => x.roll !== s.roll),
              };
              setRosterOverrides((prev) => ({
                ...prev,
                [openClass.name]: next,
              }));
              toast.push(`${s.name} removed from ${openClass.name}`, "info");
            },
          })
        }
      />

      <AddStudentModal
        open={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        onAdded={(s) => {
          const cur = getRoster();
          const next = { ...cur, students: [...cur.students, s] };
          setRosterOverrides((prev) => ({
            ...prev,
            [openClass.name]: next,
          }));
        }}
      />
    </>
  );
};

export default AdminClasses;
