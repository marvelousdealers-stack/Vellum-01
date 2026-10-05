import { useState, useEffect } from "react";
import { Chip, ChipRow, Field, ModalShell, inputClass } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// CLASS SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════
export const ClassSettingsModal = ({
  open,
  onClose,
  cls,
  availableTeachers = [],
  currentTeachers = [],
  onSave,
  onDelete,
}) => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [year, setYear] = useState("2026");
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    if (!open) return;
    setName(cls?.name || "");
    setYear("2026");
    setAssigned(currentTeachers);
  }, [open, cls, currentTeachers]);

  if (!open) return null;

  const toggleTeacher = (t) =>
    setAssigned((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]));
  const submit = () => {
    if (!name.trim()) {
      toast.push("Class name is required", "error");
      return;
    }
    onSave?.({ name: name.trim(), academicYear: year, teachers: assigned });
    toast.push("Class settings saved", "success");
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Class settings"
      maxWidth="640px"
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
            Save changes
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
        label="Assigned teachers"
        hint="Removing a teacher unassigns them from this class but keeps their account active."
      >
        <ChipRow>
          {availableTeachers.length === 0 && (
            <span className="text-[12.5px] text-ink-3">
              No teachers available — create one first.
            </span>
          )}
          {availableTeachers.map((t) => (
            <Chip
              key={t}
              active={assigned.includes(t)}
              onClick={() => toggleTeacher(t)}
            >
              {t}
            </Chip>
          ))}
        </ChipRow>
      </Field>

      <div className="mt-7 border-t border-rule pt-5">
        <div className="mb-3 text-[12px] font-semibold text-danger">
          Danger zone
        </div>
        <div className="flex flex-col items-start gap-4 rounded-[var(--radius-container)] border border-danger/30 bg-danger-dim p-4 narrow:flex-row narrow:items-center">
          <div className="min-w-0 flex-1">
            <strong className="mb-0.5 block text-[13.5px] font-semibold text-ink">
              Delete this class
            </strong>
            <span className="block text-[12px] leading-relaxed text-ink-2">
              Unassigns all students and teachers. Test history remains in the
              system but becomes inaccessible. Cannot be undone.
            </span>
          </div>
          <Button
            onClick={() => {
              onClose();
              onDelete?.();
            }} variant="destructive" size="sm"
          >
            Delete class
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};
