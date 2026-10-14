import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateAccountModal } from "@/components/admin-users/CreateAccountModal";
import { createUser, deleteUser, updateUser } from "@/api/admin";
import { ConfirmDialog, PageError, PageLoading, StatusDot, TableShell, Td, Th } from "@/components/common";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { useUsers } from "@/hooks/useAdmin";
import { useClasses } from "@/hooks/useSubjects";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// ADMIN USERS
// ═══════════════════════════════════════════════════════════════
const AdminUsers = () => {
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const { user: me } = useApp();
  const usersRes = useUsers();
  const classesRes = useClasses();

  if (usersRes.isLoading || classesRes.isLoading) return <PageLoading />;
  const loadError = usersRes.error || classesRes.error;
  if (loadError) return <PageError error={loadError} onRetry={() => { usersRes.refetch(); classesRes.refetch(); }} />;
  const users = usersRes.data ?? [];
  const classes = classesRes.data ?? [];
  const codeOf = (id) => classes.find((c) => c.id === id)?.code;
  // Students: their class code. Teachers: every class they teach.
  const classLabel = (u) =>
    u.role === "student"
      ? (u.cls ?? "—")
      : (u.classIds ?? []).map(codeOf).filter(Boolean).join(", ") || "—";
  const run = async (fn, fallback) => {
    try {
      await fn();
    } catch (err) {
      toast.push(err.message || fallback, "error");
    }
  };

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-3">
        Administration <span className="text-ink-3">/</span> Accounts
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[28px] font-semibold tablet:text-[34px] leading-[1.1] tracking-[-0.02em] text-ink">
            Accounts
          </h1>
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
            Every teacher and student in the system.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={14} /> Create account
        </Button>
      </div>

      <TableShell>
        <thead>
          <tr className="border-b border-rule-2">
            <Th>Name</Th>
            <Th className="max-narrow:hidden">Email</Th>
            <Th className="max-narrow:hidden">Role</Th>
            <Th className="max-narrow:hidden">Class</Th>
            <Th>Status</Th>
            <Th className="w-48"></Th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50"
            >
              <Td className="text-[13.5px] font-medium text-ink">
                {u.name}
                <div className="mt-0.5 text-[12px] font-normal text-ink-3 narrow:hidden">
                  {u.email}
                  <br />
                  {u.role} · Class {classLabel(u)}
                </div>
              </Td>
              <Td className="text-[12px] text-ink-3 max-narrow:hidden">{u.email}</Td>
              <Td className="max-narrow:hidden">
                <span
                  className={cn(
                    "text-[12px] font-medium",
                    u.role === "teacher" ? "text-primary" : "text-ink-2",
                  )}
                >
                  {u.role === "teacher" ? "Teacher" : "Student"}
                </span>
              </Td>
              <Td className="text-[12px] tabular-nums max-narrow:hidden">{classLabel(u)}</Td>
              <Td>
                <StatusDot tone={u.active ? "success" : "warning"}>
                  {u.active ? "Active" : "Inactive"}
                </StatusDot>
              </Td>
              <Td className="whitespace-nowrap text-right">
                {u.id !== me?.id && (
                  <button
                    onClick={() =>
                      run(
                        () => updateUser(u.id, { active: !u.active }),
                        "Couldn't update the account",
                      )
                    }
                    className="rounded-[var(--radius-control)] px-3 py-2 text-[12px] font-medium text-ink-3 transition-colors hover:bg-raised hover:text-ink"
                  >
                    {u.active ? "Deactivate" : "Reactivate"}
                  </button>
                )}
                <button
                  onClick={() =>
                    setConfirmState({
                      title: `Remove ${u.name}?`,
                      message: `This removes ${u.name}'s account from the platform. Their existing test results and history will remain in the system, but they will lose access immediately. This cannot be undone.`,
                      confirmLabel: "Remove account",
                      onConfirm: () =>
                        run(async () => {
                          await deleteUser(u.id);
                          toast.push(`Removed ${u.name}`, "info");
                        }, "Couldn't remove the account"),
                    })
                  }
                  className="rounded-[var(--radius-control)] px-3 py-2 text-[12px] font-medium text-ink-3 transition-colors hover:bg-danger-dim hover:text-danger"
                >
                  Remove
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <CreateAccountModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        classes={classes}
        onCreate={async (data) => {
          const made = await createUser(data);
          toast.push(`${made.role === "teacher" ? "Teacher" : "Student"} account created for ${made.name}`, "success");
        }}
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

export default AdminUsers;
