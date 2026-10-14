import { useState } from "react";
import { Chip, ChipRow, Field, ModalShell, inputClass } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// ADD STUDENT MODAL
// Either creates a new student account in this class, or enrolls a student
// who currently has no class. The roll number is assigned by the server.
// ═══════════════════════════════════════════════════════════════
export const AddStudentModal = ({ open, onClose, unassigned = [], onCreate, onEnroll }) => {
  const toast = useToast();
  const [mode, setMode] = useState("new");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [existingId, setExistingId] = useState("");
  const [busy, setBusy] = useState(false);
  if (!open) return null;

  const reset = () => {
    setName("");
    setEmail("");
    setExistingId("");
    setMode("new");
  };
  const submit = async () => {
    if (mode === "new" && (!name.trim() || !email.trim())) {
      toast.push("Name and email are required", "error");
      return;
    }
    if (mode === "existing" && !existingId) {
      toast.push("Choose a student", "error");
      return;
    }
    setBusy(true);
    try {
      if (mode === "new") await onCreate?.({ name, email });
      else await onEnroll?.(existingId);
      reset();
      onClose();
    } catch (err) {
      toast.push(err.message || "Couldn't add the student", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add student"
      maxWidth="480px"
      footer={
        <>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            Add to class
          </Button>
        </>
      }
    >
      <ChipRow>
        <Chip active={mode === "new"} onClick={() => setMode("new")}>
          New student
        </Chip>
        <Chip active={mode === "existing"} onClick={() => setMode("existing")}>
          Existing, no class ({unassigned.length})
        </Chip>
      </ChipRow>

      {mode === "new" ? (
        <>
          <Field label="Full name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amelia Chen"
              autoFocus
              className={inputClass}
            />
          </Field>
          <Field label="Email" hint="Their roll number is assigned automatically.">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="a.chen@westfield.edu"
              autoComplete="off"
              className={inputClass}
            />
          </Field>
          <div className="rounded-[var(--radius-control)] border border-primary/25 bg-primary-soft px-3.5 py-2.5 text-[12px] leading-relaxed text-primary">
            A temporary password will be emailed automatically
          </div>
        </>
      ) : (
        <Field label="Student">
          <select value={existingId} onChange={(e) => setExistingId(e.target.value)} className={inputClass}>
            <option value="">{unassigned.length ? "— Choose a student —" : "No students without a class"}</option>
            {unassigned.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} · {u.email}
              </option>
            ))}
          </select>
        </Field>
      )}
    </ModalShell>
  );
};
