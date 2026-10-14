import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { CreateClassModal } from "./CreateClassModal";
import { createClass, deleteClass } from "@/api/admin";
import { Bento, ConfirmDialog, PageError, PageLoading } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { useUsers } from "@/hooks/useAdmin";
import { useClasses } from "@/hooks/useSubjects";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// ADMIN CLASSES
// ═══════════════════════════════════════════════════════════════
export const ClassList = () => {
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const navigate = useNavigate();
  const classesRes = useClasses();
  const usersRes = useUsers();

  if (classesRes.isLoading || usersRes.isLoading) return <PageLoading />;
  const loadError = classesRes.error || usersRes.error;
  if (loadError) {
    return <PageError error={loadError} onRetry={() => { classesRes.refetch(); usersRes.refetch(); }} />;
  }
  const classes = classesRes.data ?? [];
  const teacherChoices = (usersRes.data ?? []).filter((u) => u.role === "teacher");

  const openDetail = (c) => navigate(`/admin/classes/${c.id}`);

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-3">
        Administration <span className="text-ink-3">/</span> Classes
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[28px] font-semibold tablet:text-[34px] leading-[1.1] tracking-[-0.02em] text-ink">
            Classes
          </h1>
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
            Assign teachers, enroll students, keep sections organized. Click a
            class to see its full roster.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={14} /> Create class
        </Button>
      </div>

      <div className="grid gap-4 tablet:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {classes.map((c) => (
          <Bento
            key={c.id}
            onClick={() => openDetail(c)}
            className="group cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary-dim font-mono text-[12px] font-bold tracking-wider text-primary">
                {c.code}
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmState({
                      title: `Delete "${c.name}"?`,
                      message: `This removes the class and unassigns its ${c.studentCount} students and ${c.teachers.length} teacher(s) and removes its ${c.subjectCount} subjects. Their accounts stay active. It can't be deleted while it has tests. This cannot be undone.`,
                      confirmLabel: "Delete class",
                      onConfirm: async () => {
                        try {
                          await deleteClass(c.id);
                          toast.push(`Deleted "${c.name}"`, "info");
                        } catch (err) {
                          toast.push(err.message || "Couldn't delete the class", "error");
                        }
                      },
                    });
                  }}
                  className="rounded-[var(--radius-control)] px-2 py-0.5 text-[12px] font-medium text-ink-3 transition-colors hover:bg-danger-dim hover:text-danger"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
                {c.name}
              </div>
              <div className="mt-1 font-mono text-[12.5px] text-ink-3">
                <b className="font-semibold text-ink">{c.studentCount}</b> students
                · <b className="font-semibold text-ink">{c.subjectCount}</b>{" "}
                subjects
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.teachers.map((t) => (
                <span
                  key={t.id}
                  className="rounded-full border border-rule-2 bg-surface/60 px-2 py-0.5 text-[12px] font-medium text-ink-2"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </Bento>
        ))}
      </div>

      <CreateClassModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={async (data) => {
          const made = await createClass(data);
          toast.push(`Class "${made.name}" created`, "success");
        }}
        teachers={teacherChoices}
      />
      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        onConfirm={() => confirmState?.onConfirm?.()}
        onClose={() => setConfirmState(null)}
      />
    </div>
  );
};
