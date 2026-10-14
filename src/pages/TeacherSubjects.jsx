import { useState } from "react";
import { Plus } from "lucide-react";
import { createSubject, deleteSubject, updateSubject } from "@/api/subjects";
import { Field, LoadingButton, PageError, PageLoading, Scope, inputClass } from "@/components/common";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";

// ═══════════════════════════════════════════════════════════════
// SUBJECTS
// The subjects taught in the active class. Everything else (materials,
// tests, question bank) is filed under one of these.
// ═══════════════════════════════════════════════════════════════
const SubjectRow = ({ subject, onSaved }) => {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(subject.name);
  const [outline, setOutline] = useState(subject.outline ?? "");
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const run = async (fn, done) => {
    setBusy(true);
    try {
      await fn();
      done?.();
    } catch (err) {
      toast.push(err.message || "Something went wrong", "error");
    } finally {
      setBusy(false);
    }
  };

  const save = () =>
    run(
      () => updateSubject(subject.id, { name, outline }),
      () => {
        setEditing(false);
        toast.push("Subject saved", "success");
        onSaved?.();
      },
    );

  const remove = () =>
    run(() => deleteSubject(subject.id), () => toast.push(`${subject.name} deleted`, "success"));

  if (!editing) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-rule bg-surface px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-semibold text-ink">{subject.name}</div>
          <div className="text-[12px] text-ink-3">
            {subject.outline ? `Outline · ${subject.outline.length.toLocaleString()} characters` : "No outline yet"}
          </div>
        </div>
        {confirming ? (
          <>
            <span className="text-[12.5px] text-ink-2">Delete {subject.name}?</span>
            <LoadingButton variant="danger" loading={busy} onClick={remove}>Delete</LoadingButton>
            <LoadingButton variant="ghost" disabled={busy} onClick={() => setConfirming(false)}>Keep</LoadingButton>
          </>
        ) : (
          <>
            <LoadingButton variant="secondary" onClick={() => setEditing(true)}>Edit</LoadingButton>
            <LoadingButton variant="ghost" onClick={() => setConfirming(true)}>Delete</LoadingButton>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 rounded-xl border border-primary/40 bg-surface p-4">
      <Field label="Name">
        <input className={inputClass} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Course outline" hint="Optional. Paste the syllabus text; materials you upload add to it later.">
        <textarea
          className={`${inputClass} min-h-40`}
          value={outline}
          onChange={(e) => setOutline(e.target.value)}
        />
      </Field>
      <div className="flex justify-end gap-2">
        <LoadingButton
          variant="ghost"
          disabled={busy}
          onClick={() => {
            setName(subject.name);
            setOutline(subject.outline ?? "");
            setEditing(false);
          }}
        >
          Cancel
        </LoadingButton>
        <LoadingButton loading={busy} onClick={save}>Save</LoadingButton>
      </div>
    </div>
  );
};

const TeacherSubjects = () => {
  const toast = useToast();
  const { activeClassObj, classSubjects, scopeLoading, scopeError } = useApp();
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);

  if (scopeLoading) return <PageLoading />;
  if (scopeError) return <PageError error={scopeError} />;

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim() || adding) return;
    setAdding(true);
    try {
      await createSubject({ classId: activeClassObj.id, name });
      setName("");
      toast.push("Subject added", "success");
    } catch (err) {
      toast.push(err.message || "Couldn't add the subject", "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mx-auto max-w-[860px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-3">
        {activeClassObj ? activeClassObj.name : "Class"} <span>/</span> Subjects
      </div>
      <h1 className="mb-1 font-display text-[26px] font-semibold tracking-tight text-ink">Subjects</h1>
      <p className="mb-6 text-[13.5px] text-ink-2">
        What {activeClassObj?.short ?? "this class"} studies. Switch between them from the sidebar.
        {" "}Working in <Scope />.
      </p>

      <form onSubmit={add} className="mb-6 flex gap-2">
        <input
          className={`${inputClass} flex-1`}
          placeholder="New subject, e.g. Biology"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          aria-label="New subject name"
        />
        <LoadingButton type="submit" loading={adding} disabled={!name.trim()}>
          <Plus size={14} /> Add subject
        </LoadingButton>
      </form>

      <div className="grid gap-2.5">
        {classSubjects.map((s) => (
          <SubjectRow key={s.id} subject={s} />
        ))}
        {classSubjects.length === 0 && (
          <div className="rounded-xl border border-dashed border-rule-2 p-8 text-center text-[13px] text-ink-3">
            No subjects yet. Add the first one above.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherSubjects;
