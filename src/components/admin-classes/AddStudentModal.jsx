import { useState } from "react";
import { Field, ModalShell, inputClass } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// ADD STUDENT MODAL
// ═══════════════════════════════════════════════════════════════
export const AddStudentModal = ({ open, onClose, onAdded }) => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");

  if (!open) return null;
  const reset = () => {
    setName("");
    setRoll("");
    setEmail("");
  };
  const submit = () => {
    if (!name.trim() || !roll.trim()) {
      toast.push("Name and roll number are required", "error");
      return;
    }
    onAdded?.({ name, roll, email, avg: 0, status: "Active" });
    toast.push(`${name} added to the class`, "success");
    reset();
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add student"
      maxWidth="480px"
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
            Add to class
          </Button>
        </>
      }
    >
      <Field label="Full name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Amelia Chen"
          autoFocus
          className={inputClass}
        />
      </Field>
      <Field label="Roll number">
        <input
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          placeholder="e.g. 11A-33"
          className={inputClass}
        />
      </Field>
      <Field label="Email (optional)">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="a.chen@westfield.edu"
          className={inputClass}
        />
      </Field>
      <div className="rounded-[var(--radius-control)] border border-primary/25 bg-primary-soft px-3.5 py-2.5 text-[12px] leading-relaxed text-primary">
        A temporary password will be emailed if an email is provided
      </div>
    </ModalShell>
  );
};
