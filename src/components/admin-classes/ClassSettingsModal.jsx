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
  currentTeacherIds = [],
  onSave,
  onDelete,
}) => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    if (!open) return;
    setName(cls?.name || "");
    setAssigned(currentTeacherIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cls?.id]);

  if (!open) return null;

  const toggleTeacher = (t) =>
    setAssigned((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]));
  const submit = async () => {
    if (!name.trim()) {
      toast.push("Class name is required", "error");
      return;
    }
    setBusy(true);
    try {
      await onSave?.({ name: name.trim(), teacherIds: assigned });
      toast.push("Class settings saved", "success");
      onClose();
    } catch (err) {
      toast.push(err.message || "Couldn't save the class", "error");
    } finally {
      setBusy(false);
    }
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
            disabled={busy}
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
              key={t.id}
              active={assigned.includes(t.id)}
              onClick={() => toggleTeacher(t.id)}
            >
              {t.name}
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
              Unassigns its students and removes its subjects. Blocked while the
              class still has tests. Cannot be undone.
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
