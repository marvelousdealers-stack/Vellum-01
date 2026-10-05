import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Field, ModalShell, inputClass } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// CREATE ACCOUNT MODAL
// ═══════════════════════════════════════════════════════════════
export const CreateAccountModal = ({ open, onClose, onCreated }) => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Teacher");
  const [cls, setCls] = useState("");

  if (!open) return null;
  const reset = () => {
    setName("");
    setEmail("");
    setRole("Teacher");
    setCls("");
  };
  const submit = () => {
    if (!name.trim() || !email.trim()) {
      toast.push("Name and email are required", "error");
      return;
    }
    onCreated?.({ name, email, role, cls });
    reset();
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Create account"
      maxWidth="520px"
      footer={
        <>
          <Button
            onClick={onClose} variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
          >
            Create account
          </Button>
        </>
      }
    >
      <Field label="Full name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dr. A. Mensah"
          autoFocus
          className={inputClass}
        />
      </Field>
      <Field label="Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="a.mensah@westfield.edu"
          autoComplete="off"
          className={inputClass}
        />
      </Field>
      <Field label="Role">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputClass}
        >
          <option>Teacher</option>
          <option>Student</option>
        </select>
      </Field>
      {role === "Student" && (
        <Field label="Class">
          <select
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className={inputClass}
          >
            <option value="">— Choose a class —</option>
            <option>Grade 11 — Section A</option>
            <option>Grade 11 — Section B</option>
            <option>Grade 10 — Section A</option>
          </select>
        </Field>
      )}
      <div className="mt-2 flex items-start gap-2 rounded-[var(--radius-control)] border border-primary/25 bg-primary-soft px-3.5 py-2.5 text-[12px] leading-relaxed text-primary">
        <Sparkles size={13} className="mt-0.5 shrink-0" />
        <span>A temporary password will be emailed automatically</span>
      </div>
    </ModalShell>
  );
};
