import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateAccountModal } from "@/components/admin-users/CreateAccountModal";
import { ConfirmDialog, StatusDot, TableShell, Td, Th } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { USERS } from "@/data/users";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// ADMIN USERS
// ═══════════════════════════════════════════════════════════════
const AdminUsers = () => {
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmState, setConfirmState] = useState(null);

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Administration <span className="text-ink-3">/</span> Accounts
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
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
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Class</Th>
            <Th>Status</Th>
            <Th className="w-24"></Th>
          </tr>
        </thead>
        <tbody>
          {USERS.map((u) => (
            <tr
              key={u.email}
              className="border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50"
            >
              <Td className="text-[13.5px] font-medium text-ink">{u.name}</Td>
              <Td className="font-mono text-[12px] text-ink-3">{u.email}</Td>
              <Td>
                <span
                  className={cn(
                    "text-[12px] font-medium",
                    u.role === "Teacher" ? "text-primary" : "text-ink-2",
                  )}
                >
                  {u.role}
                </span>
              </Td>
              <Td className="font-mono text-[12px] tabular-nums">{u.cls}</Td>
              <Td>
                <StatusDot tone={u.status === "Active" ? "success" : "warning"}>
                  {u.status}
                </StatusDot>
              </Td>
              <Td className="text-right">
                <button
                  onClick={() =>
                    setConfirmState({
                      title: `Remove ${u.name}?`,
                      message: `This removes ${u.name}'s account from the platform. Their existing test results and history will remain in the system, but they will lose access immediately. This cannot be undone.`,
                      confirmLabel: "Remove account",
                      onConfirm: () => toast.push(`Removed ${u.name}`, "info"),
                    })
                  }
                  className="rounded-[var(--radius-control)] px-2.5 py-1 text-[12px] font-medium text-ink-3 transition-colors hover:bg-danger-dim hover:text-danger"
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
        onCreated={(data) =>
          toast.push(`${data.role} account created for ${data.name}`, "success")
        }
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
