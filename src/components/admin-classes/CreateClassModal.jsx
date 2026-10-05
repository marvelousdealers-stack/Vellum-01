import { useState } from "react";
import { Chip, ChipRow, Field, ModalShell, inputClass } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// CREATE CLASS MODAL
// ═══════════════════════════════════════════════════════════════
export const CreateClassModal = ({
  open,
  onClose,
  onCreated,
  teachers = [],
}) => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [year, setYear] = useState("2026");
  const [assigned, setAssigned] = useState([]);

  if (!open) return null;
  const toggle = (t) =>
    setAssigned((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]));
  const reset = () => {
    setName("");
    setAssigned([]);
    setYear("2026");
  };
  const submit = () => {
    if (!name.trim()) {
      toast.push("Class name is required", "error");
      return;
    }
    onCreated?.({ name, year, teachers: assigned });
    reset();
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Create class"
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
            Create class
          </Button>
        </>
      }
    >
      <Field label="Class name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Grade 12 — Section C"
          autoFocus
          className={inputClass}
        />
      </Field>
      <Field label="Academic year">
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field
        label="Assign teachers"
        hint="Students can be enrolled after the class is created"
      >
        <ChipRow>
          {teachers.length === 0 && (
            <span className="text-[12.5px] text-ink-3">
              No teachers yet — create one first
            </span>
          )}
          {teachers.map((t) => (
            <Chip
              key={t}
              active={assigned.includes(t)}
              onClick={() => toggle(t)}
            >
              {t}
            </Chip>
          ))}
        </ChipRow>
      </Field>
    </ModalShell>
  );
};
