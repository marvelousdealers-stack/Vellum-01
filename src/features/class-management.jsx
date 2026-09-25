import React, { useState, useEffect, useMemo } from "react";
import { Icon, SearchIcon, STUDENT_PROFILES } from "../shared/shared";
import { useToast } from "../components/toast";

// ═══════════════════════════════════════════════════════════════
// STOP TEST OVERLAY — hard lock when teacher stops the test
// (PDF §7.7: "stop it early for every student")
// ═══════════════════════════════════════════════════════════════
export const StopTestOverlay = ({ visible, onForceSubmit, reason = "The teacher has stopped this test." }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!visible) return;
    setCountdown(3);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          onForceSubmit?.();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [visible, onForceSubmit]);

  if (!visible) return null;

  return (
    <div className="stop-overlay" role="alertdialog" aria-modal="true" aria-labelledby="stop-title">
      <div className="stop-overlay-card">
        <div className="stop-overlay-icon">
          <Icon name="warn" size={28} />
        </div>
        <h2 className="stop-overlay-title" id="stop-title">Test stopped</h2>
        <p className="stop-overlay-body">{reason}</p>
        <p className="stop-overlay-note">
          You can no longer change your answers. Any answers already recorded are being saved.
        </p>
        <div className="stop-overlay-count">
          Submitting in <span className="stop-overlay-num">{countdown}</span>
        </div>
        <button className="btn btn-solid" style={{ width: "100%", justifyContent: "center" }} onClick={onForceSubmit}>
          Submit now
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// QUESTION MIX BUILDER
// Teacher specifies count and marks per question type
// ═══════════════════════════════════════════════════════════════
const QUESTION_TYPE_META = {
  mcq:      { label: "Multiple choice",  short: "MCQ",  defaultMarks: 2,  max: 40 },
  truefalse:{ label: "True / false",     short: "T/F",  defaultMarks: 1,  max: 20 },
  short:    { label: "Short answer",     short: "Short",defaultMarks: 4,  max: 20 },
  long:     { label: "Long answer",      short: "Long", defaultMarks: 10, max: 10 },
  numerical:{ label: "Numerical",        short: "Num",  defaultMarks: 5,  max: 15 },
};

export const QuestionMixBuilder = ({ rows, onChange, targetMarks }) => {
  const totalQuestions = rows.reduce((s, r) => s + r.count, 0);
  const totalMarks = rows.reduce((s, r) => s + (r.count * r.marks), 0);

  const update = (type, patch) => {
    onChange(rows.map((r) => r.type === type ? { ...r, ...patch } : r));
  };

  const addRow = (type) => {
    const meta = QUESTION_TYPE_META[type];
    onChange([...rows, { type, count: 5, marks: meta.defaultMarks }]);
  };

  const removeRow = (type) => {
    onChange(rows.filter((r) => r.type !== type));
  };

  const available = Object.keys(QUESTION_TYPE_META).filter(
    (t) => !rows.some((r) => r.type === t)
  );

  const marksMatch = targetMarks == null || totalMarks === targetMarks;
  const marksOff = targetMarks != null ? totalMarks - targetMarks : 0;

  return (
    <div className="qmb">
      <div className="qmb-head">
        <span>Question types</span>
        <span className={"qmb-total-badge " + (marksMatch ? "ok" : "off")}>
          {totalQuestions} questions · {totalMarks} marks
        </span>
      </div>

      <div className="qmb-list">
        {rows.map((r) => {
          const meta = QUESTION_TYPE_META[r.type];
          return (
            <div key={r.type} className="qmb-row">
              <div className="qmb-type">
                <span className="qmb-type-short">{meta.short}</span>
                <span className="qmb-type-name">{meta.label}</span>
              </div>
              <div className="qmb-fields">
                <div className="qmb-stepper">
                  <button
                    type="button"
                    className="qmb-step-btn"
                    onClick={() => update(r.type, { count: Math.max(0, r.count - 1) })}
                    disabled={r.count <= 0}
                    aria-label="Decrease count"
                  >−</button>
                  <input
                    className="qmb-step-input"
                    type="text"
                    inputMode="numeric"
                    value={r.count}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, "");
                      update(r.type, { count: v === "" ? 0 : Math.min(meta.max, parseInt(v, 10)) });
                    }}
                    aria-label={`${meta.label} count`}
                  />
                  <button
                    type="button"
                    className="qmb-step-btn"
                    onClick={() => update(r.type, { count: Math.min(meta.max, r.count + 1) })}
                    disabled={r.count >= meta.max}
                    aria-label="Increase count"
                  >+</button>
                </div>
                <span className="qmb-mult">×</span>
                <input
                  className="qmb-marks-input"
                  type="text"
                  inputMode="numeric"
                  value={r.marks}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, "");
                    update(r.type, { marks: v === "" ? 1 : Math.max(1, Math.min(50, parseInt(v, 10))) });
                  }}
                  aria-label={`${meta.label} marks each`}
                />
                <span className="qmb-marks-label">marks each</span>
              </div>
              <div className="qmb-subtotal">{r.count * r.marks}</div>
              <button
                type="button"
                className="qmb-remove"
                onClick={() => removeRow(r.type)}
                aria-label={`Remove ${meta.label}`}
              >×</button>
            </div>
          );
        })}
      </div>

      {available.length > 0 && (
        <div className="qmb-add">
          <span className="qmb-add-label">Add type:</span>
          {available.map((t) => (
            <button
              key={t}
              type="button"
              className="field-quick-chip"
              onClick={() => addRow(t)}
            >
              + {QUESTION_TYPE_META[t].label}
            </button>
          ))}
        </div>
      )}

      {targetMarks != null && (
        <div className={"qmb-target " + (marksMatch ? "ok" : "off")}>
          {marksMatch
            ? `Total matches your target of ${targetMarks} marks.`
            : marksOff > 0
              ? `${marksOff} marks over your target of ${targetMarks}.`
              : `${Math.abs(marksOff)} marks under your target of ${targetMarks}.`}
        </div>
      )}
    </div>
  );
};

export const DEFAULT_MIX = [
  { type: "mcq",   count: 10, marks: 2 },
  { type: "short", count: 5,  marks: 4 },
  { type: "long",  count: 2,  marks: 10 },
];

// ═══════════════════════════════════════════════════════════════
// CLASS SETTINGS MODAL
// Rename a class, change the academic year, reassign teachers, or
// delete the class. The delete action reuses the global confirm
// dialog from Root so the warning is consistent.
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
    <div className="modal-bg" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Class settings</h2>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body" style={{ maxHeight: "66vh", overflowY: "auto" }}>
          <div className="fld">
            <label>Class name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grade 12 — Section C"
              autoFocus
            />
          </div>

          <div className="fld">
            <label>Academic year</label>
            <input value={year} onChange={(e) => setYear(e.target.value)} />
          </div>

          <div className="fld">
            <label>Assigned teachers</label>
            <div className="chip-row" style={{ marginTop: 4 }}>
              {availableTeachers.length === 0 && (
                <span className="dim" style={{ fontSize: 12.5 }}>
                  No teachers available — create one first.
                </span>
              )}
              {availableTeachers.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={"chip " + (assigned.includes(t) ? "on" : "")}
                  onClick={() => toggleTeacher(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="fld-hint">
              Removing a teacher unassigns them from this class but keeps their account active.
            </div>
          </div>

          <div className="settings-danger">
            <div className="settings-danger-title">Danger zone</div>
            <div className="settings-danger-body">
              <div>
                <strong>Delete this class</strong>
                <span>
                  Unassigns all students and teachers. Test history remains in the
                  system but becomes inaccessible. Cannot be undone.
                </span>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => { onClose(); onDelete?.(); }}
              >
                Delete class
              </button>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn btn-text" onClick={onClose}>Cancel</button>
          <button className="btn btn-solid" onClick={submit}>Save changes</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CLASS DETAIL — admin drill-down (teachers + students)
// ═══════════════════════════════════════════════════════════════
export const ClassDetail = ({
  cls,
  roster,
  onBack,
  onStudentClick,
  onAddStudent,
  onRemoveStudent,
  onUpdateClass,
  onDeleteClass,
}) => {
  const toast = useToast();
  const [tab, setTab] = useState("students");
  const [search, setSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return roster.students;
    const q = search.trim().toLowerCase();
    return roster.students.filter(s =>
      s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q)
    );
  }, [roster.students, search]);

  const stats = useMemo(() => {
    const active = roster.students.filter(s => s.status === "Active").length;
    const avg = roster.students.length
      ? Math.round(roster.students.reduce((sum, s) => sum + s.avg, 0) / roster.students.length)
      : 0;
    return { active, avg, total: roster.students.length };
  }, [roster.students]);

  return (
    <div className="main-pad">
      <button className="btn btn-text" onClick={onBack} style={{ padding: "6px 0", marginBottom: 12 }}>
        ← Back to classes
      </button>
      <div className="crumbs">Administration <b>/</b> Classes <b>/</b> {cls.name}</div>

      <div className="hstack" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
        <div>
          <h1 className="title">{cls.name}</h1>
          <p className="lede">
            {roster.teachers.length} teacher{roster.teachers.length !== 1 ? "s" : ""} assigned ·
            {" "}{stats.total} student{stats.total !== 1 ? "s" : ""} enrolled · {cls.subjects} subjects
          </p>
        </div>
                <div className="hstack" style={{ gap: 8 }}>
          <button className="btn btn-line" onClick={() => setSettingsOpen(true)}>
            Class settings
          </button>
          <button className="btn btn-solid" onClick={onAddStudent}>
            + Add student
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi"><div className="kpi-label">Students</div><div className="kpi-num">{stats.total}</div>
          <div className="kpi-sub">{stats.active} active</div></div>
        <div className="kpi"><div className="kpi-label">Teachers</div><div className="kpi-num">{roster.teachers.length}</div>
          <div className="kpi-sub">Assigned to this class</div></div>
        <div className="kpi"><div className="kpi-label">Class average</div><div className="kpi-num">{stats.avg}<span className="pct">%</span></div>
          <div className="kpi-sub">Across all subjects</div></div>
        <div className="kpi"><div className="kpi-label">Subjects</div><div className="kpi-num">{cls.subjects}</div></div>
      </div>

      <div className="gr-filter-bar">
        <div className="chip-row">
          <button className={"chip" + (tab === "students" ? " on" : "")} onClick={() => setTab("students")}>
            Students ({stats.total})
          </button>
          <button className={"chip" + (tab === "teachers" ? " on" : "")} onClick={() => setTab("teachers")}>
            Teachers ({roster.teachers.length})
          </button>
        </div>
        {tab === "students" && (
          <>
            <label className="gr-search" style={{ marginLeft: 12 }}>
              <SearchIcon />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                     placeholder="Search by name or roll no…" />
            </label>
            <div className="gr-progress" style={{ marginLeft: "auto" }}>
              <span>{filteredStudents.length} shown</span>
            </div>
          </>
        )}
      </div>

      {tab === "students" && (
        <table className="gr-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll no</th>
              <th>Email</th>
              <th className="col-num">Avg</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "48px 24px", color: "var(--ink-3)" }}>
                No students match this search.
              </td></tr>
            )}
            {filteredStudents.map((s) => (
              <tr key={s.roll} onClick={() => onStudentClick?.(s)}>
                <td className="col-student">{s.name}</td>
                <td style={{ fontSize: 12.5 }}>{s.roll}</td>
                <td style={{ fontSize: 12.5 }}>{s.email}</td>
                <td className="col-num">{s.avg}%</td>
                <td>
                  <span className={"pill " + (s.status === "Active" ? "good" : "warn")}>{s.status}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    className="btn btn-text btn-sm"
                    onClick={(e) => { e.stopPropagation(); onRemoveStudent?.(s); }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "teachers" && (
        <div className="rowlist">
          {roster.teachers.map((t, i) => (
            <div key={i} className="rowitem" style={{ gridTemplateColumns: "40px 1.4fr 1.2fr 1fr auto" }}>
              <div className="av" style={{ width: 36, height: 36, fontSize: 12 }}>
                {t.name.split(" ").map(x => x[0]).join("").slice(0, 2)}
              </div>
              <div className="rowname">{t.name}<small>{t.email}</small></div>
              <div className="rowmeta" style={{ textAlign: "left" }}>
                {t.subjects.map((s, j) => <span key={j} className="pill" style={{ marginRight: 4 }}>{s}</span>)}
              </div>
              <div className="rowmeta"><b>{t.classes}</b> classes</div>
              <button className="btn btn-text btn-sm" onClick={() => toast.push(`Editing ${t.name}`, "info")}>
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
      <ClassSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        cls={cls}
        availableTeachers={["Dr. R. Chen", "Mrs. L. Park", "Mr. D. Osei"]}
        currentTeachers={roster.teachers.map((t) => t.name)}
        onSave={(data) => {
          onUpdateClass?.(data);
          setSettingsOpen(false);
        }}
        onDelete={() => {
          setSettingsOpen(false);
          onDeleteClass?.();
        }}
          />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ADD STUDENT MODAL (used inside ClassDetail)
// ═══════════════════════════════════════════════════════════════
export const AddStudentModal = ({ open, onClose, onAdded, classOptions = [] }) => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");

  if (!open) return null;
  const reset = () => { setName(""); setRoll(""); setEmail(""); };
  const submit = () => {
    if (!name.trim() || !roll.trim()) { toast.push("Name and roll number are required", "error"); return; }
    onAdded?.({ name, roll, email, avg: 0, status: "Active" });
    toast.push(`${name} added to the class`, "success");
    reset(); onClose();
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Add student</h2>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="fld"><label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amelia Chen" autoFocus /></div>
          <div className="fld"><label>Roll number</label>
            <input value={roll} onChange={(e) => setRoll(e.target.value)} placeholder="e.g. 11A-33" /></div>
          <div className="fld"><label>Email (optional)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="a.chen@westfield.edu" /></div>
          <div className="pill accent" style={{ marginTop: 6 }}>
            A temporary password will be emailed if an email is provided
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-text" onClick={onClose}>Cancel</button>
          <button className="btn btn-solid" onClick={submit}>Add to class</button>
        </div>
      </div>
    </div>
  );
};