import { createContext, useContext, useState, useMemo } from "react";
import { CLASSES, CLASS_THREADS } from "@/data/classes";
import { LMS_COURSES, LMS_LESSONS } from "@/data/lms";
import { usePersistentState } from "@/hooks/usePersistentState";

// ═══════════════════════════════════════════════════════════════
// APP CONTEXT
//
// All cross-cutting state that used to live in Root(). Now provided
// once by <AppProvider> (which wraps <RouterProvider>), so AppShell
// and any feature page can read/write without prop drilling.
//
// Persisted (survives reload):
//   · role            — which shell/sidebar to show
//   · activeClassId   — currently selected class
//
// Transient (in-memory only):
//   · drafts, courses, threads — mock data mutated by the UI
//   · modal open/close flags
//   · rosterOverrides — admin added/removed students
// ═══════════════════════════════════════════════════════════════
const AppCtx = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp() must be used inside <AppProvider>");
  return ctx;
};

const INITIAL_DRAFTS = [
  { id: 1, title: "Newton's Laws — Unit Test",   cls: "11A", questions: 12, marks: 40, status: "draft",     lastEdited: "2 min ago" },
  { id: 2, title: "Thermodynamics — Mid-term",   cls: "11A", questions: 15, marks: 60, status: "scheduled", lastEdited: "yesterday" },
  { id: 3, title: "Bonding & Structure",         cls: "11A", questions: 10, marks: 30, status: "draft",     lastEdited: "3 days ago" },
  { id: 4, title: "Kinematics — Quiz",           cls: "11A", questions: 8,  marks: 25, status: "completed", lastEdited: "last week" },
  { id: 5, title: "Wave Optics — Quiz 2",        cls: "11A", questions: 10, marks: 30, status: "live",      lastEdited: "just now" },
];

export const AppProvider = ({ children }) => {
  // ── Persisted ──────────────────────────────────────────────
  const [role, setRole]               = usePersistentState("vellum.role", null);
  const [activeClassId, setActiveClassId] =
    usePersistentState("vellum.activeClass", "cls-11a");

  // ── Transient app data ─────────────────────────────────────
  const [drafts, setDrafts]                     = useState(INITIAL_DRAFTS);
  const [courses, setCourses]                   = useState(LMS_COURSES);
  const [courseLessons, setCourseLessons]       = useState(LMS_LESSONS);
  const [threads, setThreads]                   = useState(CLASS_THREADS);
  const [rosterOverrides, setRosterOverrides]   = useState({});

  // ── Modal + overlay state ──────────────────────────────────
  const [cmdOpen, setCmdOpen]                   = useState(false);
  const [confirmState, setConfirmState]         = useState(null);
  const [previewOpen, setPreviewOpen]           = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen]     = useState(false);
  const [openClass, setOpenClass]               = useState(null);
  const [addStudentOpen, setAddStudentOpen]     = useState(false);
  const [openDraft, setOpenDraft]               = useState(null);
  const [selectedStudent, setSelectedStudent]   = useState(null);

  // ── Mobile nav drawer ──────────────────────────────────────
  const [mobileNavOpen, setMobileNavOpen]       = useState(false);

  // ── Derived: active class object ───────────────────────────
  const classList = useMemo(
    () =>
      CLASSES.map((c) => ({
        id: c.id,
        short: c.code,
        name: c.name,
        subject: "Physics",
        students: c.students,
      })),
    []
  );

  const activeClassObj =
    classList.find((c) => c.id === activeClassId) || classList[0];

  const value = useMemo(
    () => ({
      role, setRole,
      classList, activeClassObj, activeClassId, setActiveClassId,
      drafts, setDrafts,
      courses, setCourses,
      courseLessons, setCourseLessons,
      threads, setThreads,
      rosterOverrides, setRosterOverrides,
      cmdOpen, setCmdOpen,
      confirmState, setConfirmState,
      previewOpen, setPreviewOpen,
      accountModalOpen, setAccountModalOpen,
      classModalOpen, setClassModalOpen,
      openClass, setOpenClass,
      addStudentOpen, setAddStudentOpen,
      openDraft, setOpenDraft,
      selectedStudent, setSelectedStudent,
      mobileNavOpen, setMobileNavOpen,
    }),
    [
      role, classList, activeClassObj, activeClassId,
      drafts, courses, courseLessons, threads, rosterOverrides,
      cmdOpen, confirmState, previewOpen, accountModalOpen,
      classModalOpen, openClass, addStudentOpen, openDraft,
      selectedStudent, mobileNavOpen,
    ]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
};
