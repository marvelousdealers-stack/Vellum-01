import React, { useState, useEffect, useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./styles/base";
import responsive from "./styles/responsive";
import { MobileTopBar } from "./components/mobile-top-bar";
import polish from "./styles/polish";
import themeLoveable from "./styles/theme-loveable";
import { AnimatedNumber } from "./hooks/use-animated-number";
import {
  TREND,
  TOPICS,
  STUDENTS,
  CLASSES,
  USERS,
  UPLOAD_FILES,
  EXTRACTED_TOPICS,
  CLUSTERS,
  GENERATED_QUESTIONS,
  PAST_ATTEMPTS,
  ATTEMPT_DETAIL,
  LIVE_STUDENTS,
  GRADE_QUEUE,
  LMS_COURSES,
  MY_LESSONS,
  QUESTION_BANK,
  CLASS_ROSTERS,
  LMS_LESSONS,
  CLASS_THREADS,
  Spark,
  Trend,
  SmallMultiple,
  DotPlot,
  Conn,
  Icon,
  SearchIcon,
  NumberStepper,
  TopicInput,
} from "./shared/shared";
import { ToastProvider, useToast } from "./components/toast";
import {
  StudentProfile,
  QuestionBank,
  TestPreview,
  CreateAccountModal,
  CreateClassModal,
  ExtractedTextReview,
  ManualGradingQueue,
} from "./features/grading";
import {
  LiveActivityFeed,
  ScopeEstimate,
  GradingDetailPanel,
  QuestionNavigator,
  AutoSaveIndicator,
  groupLessonsIntoModules,
  ModuleHeader,
  DiscussionPreview,
} from "./features/widgets";
import {
  StopTestOverlay,
  QuestionMixBuilder,
  DEFAULT_MIX,
  ClassDetail,
  AddStudentModal,
} from "./features/class-management";
import {
  DraftRulesScreen,
  DraftReviewScreen,
  DraftsList,
  buildQuestions,
} from "./features/draft-tests";
import { TeacherHome } from "./features/overview";
import { TeacherLMS, StudentLMS } from "./features/lms";
import { ClassDiscussion } from "./features/chat";
import {
  ConfirmDialog,
  CommandPalette,
  SkeletonRow,
  SkeletonCard,
  EmptyState,
  LoadingButton,
  Kbd,
  SearchHint,
  VIEW_TITLES,
  formatRelativeTime,
  BrandMark,
} from "./components/ui-kit";
import {
  usePersistentState,
  useRecentViews,
  useDocumentTitle,
  useDebouncedValue,
} from "./hooks/use-persistent-state";
import { ClassContext } from "./context/class-context";
import { ClassSwitcher } from "./components/class-switcher";
import { CLASS_STATS, classShort } from "./context/class-context";

// ═══════════════════════════════════════════════════════════════
// SIDEBAR (with mobile drawer)
// ═══════════════════════════════════════════════════════════════
const Side = ({
  role,
  view,
  setView,
  user,
  onLogout,
  mobileOpen,
  onClose,
  onSearch,
  classes,
  activeClassId,
  onClassChange,
}) => {
  const pendingCount = GRADE_QUEUE.filter(
    (g) => g.status === "pending" || g.status === "flagged",
  ).length;

  // Grouped navigation — max 4 groups, max 9 items total per role.
  // Grouping + section labels reduce cognitive load from the previous
  // flat 11-item list (see research: Ant Design, Vercel redesign).
  const navGroups =
    {
      admin: [
        {
          label: null,
          items: [{ id: "admin", label: "Overview", count: null }],
        },
        {
          label: "Manage",
          items: [
            { id: "users", label: "Accounts", count: 93 },
            { id: "classes", label: "Classes", count: 3 },
          ],
        },
      ],
      teacher: [
        {
          label: null,
          items: [{ id: "home", label: "Overview", count: null }],
        },
        {
          label: "Content",
          items: [
            { id: "materials", label: "Materials", count: 12 },
            { id: "bank", label: "Question bank", count: QUESTION_BANK.length },
          ],
        },
        {
          label: "Assess",
          items: [
            { id: "drafts", label: "Drafts", count: 3 },
            { id: "live", label: "Live test", count: "●" },
            { id: "review", label: "Grade review", count: pendingCount },
          ],
        },
        {
          label: "Teach",
          items: [
            { id: "lms", label: "Courses", count: null },
            { id: "chat", label: "Discussion", count: 5 },
          ],
        },
        {
          label: "Insights",
          items: [{ id: "analytics", label: "Analytics", count: null }],
        },
      ],
      student: [
        {
          label: null,
          items: [
            { id: "home", label: "Overview", count: null },
            { id: "take", label: "Take test", count: 1 },
          ],
        },
        {
          label: "Learn",
          items: [
            { id: "history", label: "History", count: 6 },
            { id: "lms", label: "Courses", count: 3 },
            { id: "chat", label: "Discussion", count: 5 },
          ],
        },
        {
          label: "Insights",
          items: [{ id: "analytics", label: "Progress", count: null }],
        },
      ],
    }[role] || [];

  // Flatten for keyboard / search purposes only
  const nav = navGroups.flatMap((g) => g.items);

  const home = role === "admin" ? "admin" : "home";

  const goTo = (id) => {
    setView(id);
    onClose?.();
  };

  return (
    <>
      {mobileOpen && (
        <div className="side-backdrop" onClick={onClose} aria-hidden="true" />
      )}
      <aside className={"side" + (mobileOpen ? " open" : "")}>
        <button
          className="side-brand as-button"
          onClick={() => goTo(home)}
          title="Home"
        >
          <span className="logo-mark">
            <BrandMark size={28} />
          </span>
          <div className="logo-name">
           Vellum
          </div>
        </button>

        {role === "teacher" && classes && classes.length > 0 && (
          <ClassSwitcher
            classes={classes}
            activeId={activeClassId}
            onChange={onClassChange}
          />
        )}

        <div className="side-nav">
          {navGroups.map((group, gi) => (
            <div key={gi} className="side-nav-group">
              {group.label && (
                <div className="side-group-label">{group.label}</div>
              )}
              {group.items.map((n) => (
                <button
                  key={n.id}
                  className={"side-item" + (view === n.id ? " on" : "")}
                  onClick={() => goTo(n.id)}
                >
                  <span className="side-dot" />
                  <span>{n.label}</span>
                  {n.count != null && (
                    <span
                      className={
                        "count" +
                        (n.id === "review" && pendingCount > 0 ? " alert" : "")
                      }
                    >
                      {n.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="side-foot">
          <div className="av">{user.initials}</div>
          <div className="who" style={{ flex: 1 }}>
            {user.name}
            <br />
            <small>{user.meta}</small>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Sign out">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
        <div className="side-search">
          <SearchHint onClick={onSearch} />
        </div>
      </aside>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════
const Login = ({ onLogin }) => {
  const [role, setRole] = useState("teacher");
  return (
    <div className="login">
      <div className="login-left">
        <div
          className="side-brand"
          style={{ padding: 0, border: "none", marginBottom: 0 }}
        >
          <span className="logo-mark">
            <BrandMark size={28} />
          </span>
          <div className="logo-name">
            Vellum
          </div>
        </div>
        <div>
          <h1 className="login-wordmark">
            Assessment
            <span className="cursor" />
          </h1>
          <p className="login-tag">
            Read a course outline in any form. Weigh what recurs. Draft a test.
            Grade against a rubric. Show every student where they actually
            stand.
          </p>
        </div>
        <div className="login-meta">WESTFIELD ACADEMY · SPRING TERM · 2026</div>
      </div>
      <div className="login-right">
        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(role);
          }}
        >
          <h2>Sign in</h2>
          <p className="sub">Use your school account.</p>
          <div className="role-select">
            {["admin", "teacher", "student"].map((r) => (
              <button
                key={r}
                type="button"
                className={"role-btn" + (role === r ? " on" : "")}
                onClick={() => setRole(r)}
              >
                <div className="rt">{r[0].toUpperCase() + r.slice(1)}</div>
                <div className="rs">
                  {r === "admin"
                    ? "Manage"
                    : r === "teacher"
                      ? "Build & grade"
                      : "Take & review"}
                </div>
              </button>
            ))}
          </div>
          <div className="fld">
            <label>Email</label>
            <input type="email" defaultValue="r.chen@westfield.edu" />
          </div>
          <div className="fld">
            <label>Password</label>
            <input type="password" defaultValue="••••••••••" />
          </div>
          <button
            className="btn btn-solid"
            style={{ width: "100%", justifyContent: "center" }}
            type="submit"
          >
            Continue
          </button>
          <div className="login-foot">Demo · any credentials work</div>
        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MATERIALS
// ═══════════════════════════════════════════════════════════════
const Materials = ({ setView }) => {
  const [phase, setPhase] = useState("idle");
  const [visibleTopics, setVisibleTopics] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    if (phase !== "processing") return;
    const t = setTimeout(() => setPhase("extracted"), 2600);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "extracted") return;
    setVisibleTopics(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setVisibleTopics(i);
      if (i >= EXTRACTED_TOPICS.length) clearInterval(t);
    }, 140);
    return () => clearInterval(t);
  }, [phase]);

  const fileStatus = (i) => {
    if (phase === "idle") return { label: "Queued", cls: "wait" };
    if (phase === "extracted") return { label: "Extracted", cls: "done" };
    if (i === 0) return { label: "Extracted", cls: "done" };
    if (i === 1) return { label: "Reading", cls: "working" };
    return { label: "Queued", cls: "wait" };
  };

  return (
    <div className="main-pad">
      <div className="crumbs">
        Physics · Grade 11A <b>/</b> Materials
      </div>
      <div
        className="hstack"
        style={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <h1 className="title">
            Feed it <span className="soft">anything</span>
          </h1>
          <p className="lede">
            Paste text, drop a typed PDF, or photograph a whiteboard. Each item
            is read the way that suits it. Past papers are optional.
          </p>
        </div>
        <Conn state={phase === "processing" ? "polling" : "live"} />
      </div>

      <div className="up-grid">
        <div>
          <div
            className={"dropzone" + (phase !== "idle" ? " over" : "")}
            onClick={() => phase === "idle" && setPhase("processing")}
          >
            <div className="dz-icon">
              <Icon name="upload" size={38} />
            </div>
            <h3>Drop files or paste text</h3>
            <p>PDF · JPG · PNG · HEIC · plain text — mixed in one submission</p>
            <div className="dz-formats">
              <span className="pill accent">Course outline</span>
              <span className="pill">Past paper</span>
              <span className="pill">Reference</span>
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            {UPLOAD_FILES.map((f, i) => {
              const st = fileStatus(i);
              return (
                <div key={i} className="file-row">
                  <div className={"file-tag " + f.kind.toLowerCase()}>
                    {f.kind}
                  </div>
                  <div className="file-name">
                    {f.label}
                    <small>{f.meta}</small>
                    {phase === "processing" && i === 1 && (
                      <div className="bar" />
                    )}
                  </div>
                  <div className={"file-status " + st.cls}>{st.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Extracted topics</div>
          {phase === "idle" && (
            <p className="dim" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Topics will appear here once your materials are read. Each is
              weighed by how often it recurs across past papers, and by how much
              of the outline it covers.
            </p>
          )}
          {phase === "processing" && (
            <p className="dim" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Reading materials and grouping questions by topic…
            </p>
          )}
          {phase === "extracted" && (
            <>
              {EXTRACTED_TOPICS.slice(0, visibleTopics).map((t, i) => (
                <div
                  key={i}
                  className="topic-line"
                  style={{
                    opacity: 0,
                    animation: "qin 400ms cubic-bezier(0.2,0,0,1) forwards",
                  }}
                >
                  <span className="t-name">
                    {t.name}
                    {t.thin && (
                      <span
                        className="pill warn"
                        style={{ marginLeft: 8, fontSize: 10 }}
                      >
                        Thin · web
                      </span>
                    )}
                  </span>
                  <span className="t-count">{t.weight}×</span>
                  <span className="t-bar">
                    <span style={{ width: `${t.weight * 12}%` }} />
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  gap: 8,
                  flexDirection: "column",
                }}
              >
                <button
                  className="btn btn-line"
                  style={{ justifyContent: "center" }}
                  onClick={() => setReviewOpen(true)}
                >
                  Review extracted text
                </button>
                <button
                  className="btn btn-solid"
                  style={{ justifyContent: "center" }}
                  onClick={() => setView("clusters")}
                >
                  Review recurring questions →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ExtractedTextReview
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={(edits) => console.log("Saved:", edits)}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CLUSTERS
// ═══════════════════════════════════════════════════════════════
const Clusters = ({ setView }) => (
  <div className="main-pad">
    <div className="crumbs">
      Physics · Grade 11A <b>/</b> Recurring questions
    </div>
    <div
      className="hstack"
      style={{ justifyContent: "space-between", alignItems: "flex-start" }}
    >
      <div>
        <h1 className="title">
          Recurring <span className="soft">questions</span>
        </h1>
        <p className="lede">
          Across 5 past papers we found 18 distinct questions, clustered by
          meaning. Each cluster's size biases the next test toward topics that
          matter.
        </p>
      </div>
      <Conn state="live" />
    </div>

    <div className="kpis">
      <div className="kpi">
        <div className="kpi-label">Past papers</div>
        <div className="kpi-num">5</div>
        <div className="kpi-sub">2020 – 2024</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">Questions found</div>
        <div className="kpi-num">18</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">Clusters</div>
        <div className="kpi-num">5</div>
        <div className="kpi-sub">By cosine similarity</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">Strongest signal</div>
        <div className="kpi-num">
          8<span className="den">×</span>
        </div>
        <div className="kpi-sub">Newton's 2nd Law</div>
      </div>
    </div>

    <section className="sec">
      <div className="sec-head">
        <h2 className="sec-title">Clusters, largest first</h2>
        <span className="sec-note">Click to see the questions inside</span>
      </div>
      <div className="rowlist">
        {CLUSTERS.map((c, i) => (
          <div
            key={i}
            className="rowitem"
            style={{ gridTemplateColumns: "2fr 1fr 1fr auto" }}
          >
            <div className="rowname">
              {c.label}
              <small>"{c.sample}"</small>
            </div>
            <div className="rowmeta">
              <b>{c.count}</b> variants
              <br />
              across {c.years} years
            </div>
            <div className="rowmeta">
              <span
                className={
                  "pill " + (c.count >= 6 ? "mark" : c.count >= 4 ? "warn" : "")
                }
              >
                {c.count >= 6 ? "High weight" : c.count >= 4 ? "Medium" : "Low"}
              </span>
            </div>
            <div className="rowgo">→</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
        <button className="btn btn-solid" onClick={() => setView("draft")}>
          Draft a test →
        </button>
        <button className="btn btn-line">Refine split</button>
      </div>
    </section>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// PUBLISH MODAL
// ═══════════════════════════════════════════════════════════════
const PublishModal = ({ open, onClose, onPublish }) => {
  const [mode, setMode] = useState("now");
  const [opensAt, setOpensAt] = useState("");
  const [closesAt, setClosesAt] = useState("");

  if (!open) return null;

  const handlePublish = () => {
    if (mode === "schedule" && (!opensAt || !closesAt)) {
      // Nothing to worry about for the prototype — just proceed.
    }
    onPublish?.({
      mode,
      opensAt: mode === "schedule" ? opensAt : null,
      closesAt: mode === "schedule" ? closesAt : null,
    });
    onClose?.();
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Publish test</h2>
          <button className="modal-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="rule-row">
            <div className="rule-label">
              <span>When does it open?</span>
            </div>
            <div className="chip-row">
              <button
                className={"chip" + (mode === "now" ? " on" : "")}
                onClick={() => setMode("now")}
              >
                Start now
              </button>
              <button
                className={"chip" + (mode === "schedule" ? " on" : "")}
                onClick={() => setMode("schedule")}
              >
                Schedule window
              </button>
            </div>
          </div>

          {mode === "schedule" && (
            <div className="modal-grid-2" style={{ marginTop: 8 }}>
              <div className="fld">
                <label>Opens at</label>
                <input
                  type="datetime-local"
                  value={opensAt}
                  onChange={(e) => setOpensAt(e.target.value)}
                />
              </div>
              <div className="fld">
                <label>Closes at</label>
                <input
                  type="datetime-local"
                  value={closesAt}
                  onChange={(e) => setClosesAt(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="rule-row" style={{ marginTop: 20 }}>
            <div className="rule-label">
              <span>Anti-cheat</span>
            </div>
            <div className="chip-row">
              <span className="pill accent">Focus-loss logging</span>
              <span className="pill accent">One question at a time</span>
              <span className="pill accent">
                Shuffled questions &amp; options
              </span>
            </div>
          </div>
        </div>

        <div className="publish-notify-note">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16v16H4z M22 6l-10 7L2 6" />
          </svg>
          <span>
            When you publish, all enrolled students receive an in-app
            notification and an email at their school address.
          </span>
        </div>

        <div className="modal-foot">
          <button className="btn btn-text" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-solid" onClick={handlePublish}>
            {mode === "now" ? "Publish & start now" : "Schedule & publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DRAFT
// ═══════════════════════════════════════════════════════════════
const Draft = ({ onPreview, onSaveDraft, initialDraft, activeClassShort }) => {
  const [stage, setStage] = useState(initialDraft ? "review" : "rules");
  const [config, setConfig] = useState(
    initialDraft ? { duration: 30, mode: "class" } : null,
  );
  const [questions, setQuestions] = useState(initialDraft?.questionSet || []);
  const [publishOpen, setPublishOpen] = useState(false);

  const handleCreate = (cfg) => {
    setConfig(cfg);
    setQuestions(buildQuestions(cfg.mix));
    setStage("review");
  };

  const handleBack = () => setStage("rules");

  if (stage === "rules") {
    return <DraftRulesScreen onCancel={() => {}} onCreate={handleCreate} />;
  }

  return (
    <>
      <DraftReviewScreen
        config={config}
        questions={questions}
        onQuestionsChange={setQuestions}
        onBack={handleBack}
        onPreview={onPreview}
        onPublish={() => setPublishOpen(true)}
        onSave={() =>
          onSaveDraft?.({
            title: "Newton's Laws — Unit Test",
            cls: "11A",
            questions: questions.length,
            marks: questions.reduce((s, q) => s + q.marks, 0),
            status: "draft",
            questionSet: questions,
          })
        }
      />
      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublish={(payload) => {
          onSaveDraft?.({
            title: "Newton's Laws — Unit Test",
            cls: activeClassShort || "11A",
            questions: questions.length,
            marks: questions.reduce((s, q) => s + q.marks, 0),
            status: payload.mode === "now" ? "live" : "scheduled",
            mode: payload.mode,
            questionSet: questions,
          });
        }}
      />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// LIVE CONTROL
// ═══════════════════════════════════════════════════════════════
const LiveControl = () => {
  const toast = useToast();
  const [running, setRunning] = useState(true);
  const [stopping, setStopping] = useState(false);
  const [students, setStudents] = useState(LIVE_STUDENTS);
  const [tick, setTick] = useState(12);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTick(12);
      setStudents((prev) =>
        prev.map((s) =>
          s.status === "active" && Math.random() > 0.9
            ? { ...s, status: "submitted", progress: 10 }
            : s,
        ),
      );
    }, 8000);
    const c = setInterval(() => setTick((t) => Math.max(1, t - 1)), 1000);
    return () => {
      clearInterval(t);
      clearInterval(c);
    };
  }, [running]);

  const stop = () => {
    setStopping(true);
    setTimeout(() => {
      setRunning(false);
      setStopping(false);
      setStudents((prev) =>
        prev.map((s) =>
          s.status === "active"
            ? { ...s, status: "submitted", progress: 10 }
            : s,
        ),
      );
      toast.push("Test stopped — all students submitted", "info");
    }, 1500);
  };

  const active = students.filter((s) => s.status === "active").length;
  const done = students.filter((s) => s.status === "submitted").length;
  const flagged = students.filter((s) => s.flags > 0).length;

  return (
    <div className="main-pad">
      <div className="crumbs">
        Physics · Grade 11A <b>/</b> Live test
      </div>
      <div
        className="hstack"
        style={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <h1 className="title">
            Newton's Laws <span className="soft">— Unit Test</span>
          </h1>
          <p className="lede">
            {running
              ? "Test is live. Students are working."
              : "Test has been stopped. All answers submitted."}
          </p>
        </div>
        <Conn state={running ? "live" : "down"} secs={tick} />
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">Active now</div>
          <div className="kpi-num">
            {active}
            <span className="den"> / 32</span>
          </div>
          <div className="kpi-sub">Working on the test</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Submitted</div>
          <div className="kpi-num">{done}</div>
          <div className="kpi-sub">Answers received</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Flagged</div>
          <div className="kpi-num alert">{flagged}</div>
          <div className="kpi-sub">Tab switches detected</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Time remaining</div>
          <div className="kpi-num">
            23<span className="den"> min</span>
          </div>
          <div className="kpi-sub">Since 18:00</div>
        </div>
      </div>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Live roster</h2>
          <span className="sec-note">Updates every 20s · {tick}s ago</span>
        </div>
        <table className="dtable">
          <thead>
            <tr>
              <th>Student</th>
              <th className="num">Progress</th>
              <th>Status</th>
              <th className="num">Flags</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td className="nm">{s.name}</td>
                <td className="num">{s.progress}/10</td>
                <td>
                  <span
                    className={
                      "pill " +
                      (s.status === "submitted"
                        ? "good"
                        : s.status === "flagged"
                          ? "mark"
                          : "accent")
                    }
                  >
                    {s.status === "submitted"
                      ? "Submitted"
                      : s.status === "flagged"
                        ? "Flagged"
                        : "Active"}
                  </span>
                </td>
                <td className="num">
                  {s.flags ? <span className="pill warn">{s.flags}</span> : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {running && (
        <div
          className="sec"
          style={{ display: "flex", gap: 10, alignItems: "center" }}
        >
          <button className="btn btn-solid" onClick={stop} disabled={stopping}>
            {stopping ? "Stopping…" : "Stop test for everyone"}
          </button>
          <button className="btn btn-line">Extend by 10 minutes</button>
          <span
            className="dim"
            style={{ fontSize: 11.5, fontWeight: 500, marginLeft: "auto" }}
          >
            Students will submit automatically
          </span>
        </div>
      )}

      {!running && (
        <div className="sec" style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-solid">Review submissions →</button>
          <button className="btn btn-line">Restart test</button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// GRADE REVIEW
// ═══════════════════════════════════════════════════════════════
const GradeReview = () => {
  const toast = useToast();
  const [aiOn, setAiOn] = useState(true);
  const [search, setSearch] = usePersistentState(
    "vellum.gradeReview.search",
    "",
  );
  const [filter, setFilter] = usePersistentState(
    "vellum.gradeReview.filter",
    "pending",
  );
  const [sortBy, setSortBy] = usePersistentState(
    "vellum.gradeReview.sortBy",
    "confidence",
  );
  const [sortDir, setSortDir] = usePersistentState(
    "vellum.gradeReview.sortDir",
    "asc",
  );
  const [expanded, setExpanded] = useState(null);
  const [overrides, setOverrides] = useState({});
  const [remarks, setRemarks] = useState({});

  const filtered = useMemo(() => {
    let rows = [...GRADE_QUEUE];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.student.toLowerCase().includes(q) ||
          r.roll.toLowerCase().includes(q) ||
          r.test.toLowerCase().includes(q),
      );
    }
    if (filter === "pending")
      rows = rows.filter((r) => r.status !== "reviewed");
    if (filter === "low") rows = rows.filter((r) => r.confidence === "low");
    if (filter === "high") rows = rows.filter((r) => r.confidence === "high");
    if (filter === "reviewed")
      rows = rows.filter((r) => r.status === "reviewed");
    if (filter === "flagged") rows = rows.filter((r) => r.flags > 0);
    rows.sort((a, b) => {
      let va, vb;
      if (sortBy === "confidence") {
        const rank = { low: 0, med: 1, high: 2 };
        va = rank[a.confidence];
        vb = rank[b.confidence];
      } else if (sortBy === "student") {
        va = a.student;
        vb = b.student;
      } else if (sortBy === "score") {
        va = a.aiScore;
        vb = b.aiScore;
      } else {
        va = a.test;
        vb = b.test;
      }
      if (typeof va === "string")
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return rows;
  }, [search, filter, sortBy, sortDir]);

  const pendingTotal = GRADE_QUEUE.filter(
    (g) => g.status !== "reviewed",
  ).length;
  const lowTotal = GRADE_QUEUE.filter((g) => g.confidence === "low").length;
  const reviewedTotal = GRADE_QUEUE.filter(
    (g) => g.status === "reviewed",
  ).length;
  const flaggedTotal = GRADE_QUEUE.filter((g) => g.flags > 0).length;
  const progressPct = Math.round((reviewedTotal / GRADE_QUEUE.length) * 100);

  const toggleSort = (key) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  };
  const confLabel = (c) =>
    c === "low" ? "Low" : c === "med" ? "Medium" : "High";

  return (
    <div className="main-pad">
      <div className="crumbs">
        Physics · Grade 11A <b>/</b> Grade review
      </div>
      <div
        className="hstack"
        style={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <div>
          <h1 className="title">
            Review <span className="soft">grades</span>
          </h1>
          <p className="lede">
            {aiOn
              ? `${pendingTotal} submissions awaiting review across ${new Set(GRADE_QUEUE.map((g) => g.test)).size} tests.`
              : "AI grading is off. Written answers are going straight to your manual queue."}
          </p>
        </div>
        <div className="hstack" style={{ gap: 12 }}>
          <span className="dim" style={{ fontSize: 11.5, fontWeight: 500 }}>
            AI grading
          </span>
          <button
            className={"chip" + (aiOn ? " on" : "")}
            onClick={() => setAiOn(!aiOn)}
          >
            {aiOn ? "On" : "Off · manual queue"}
          </button>
        </div>
      </div>

      {!aiOn && <ManualGradingQueue onEnableAI={() => setAiOn(true)} />}

      {aiOn && (
        <>
          <div className="kpis">
            <div className="kpi">
              <div className="kpi-label">Pending review</div>
              <div className="kpi-num alert">{pendingTotal}</div>
              <div className="kpi-sub">
                Across {new Set(GRADE_QUEUE.map((g) => g.test)).size} tests
              </div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Low confidence</div>
              <div className="kpi-num alert">{lowTotal}</div>
              <div className="kpi-sub">Needs your eye first</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Flagged submissions</div>
              <div className="kpi-num">{flaggedTotal}</div>
              <div className="kpi-sub">Anti-cheat events logged</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Reviewed</div>
              <div className="kpi-num">
                {reviewedTotal}
                <span className="den"> / {GRADE_QUEUE.length}</span>
              </div>
              <div className="kpi-sub">{progressPct}% complete</div>
            </div>
          </div>

          <div className="gr-filter-bar">
            <label className="gr-search">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student, roll no, or test name…"
              />
            </label>
            <button
              className={"gr-filter-chip" + (filter === "pending" ? " on" : "")}
              onClick={() => setFilter("pending")}
            >
              Pending <span className="fc-count">{pendingTotal}</span>
            </button>
            <button
              className={"gr-filter-chip" + (filter === "low" ? " on" : "")}
              onClick={() => setFilter("low")}
            >
              Low confidence <span className="fc-count">{lowTotal}</span>
            </button>
            <button
              className={"gr-filter-chip" + (filter === "high" ? " on" : "")}
              onClick={() => setFilter("high")}
            >
              High confidence
            </button>
            <button
              className={"gr-filter-chip" + (filter === "flagged" ? " on" : "")}
              onClick={() => setFilter("flagged")}
            >
              Flagged <span className="fc-count">{flaggedTotal}</span>
            </button>
            <button
              className={
                "gr-filter-chip" + (filter === "reviewed" ? " on" : "")
              }
              onClick={() => setFilter("reviewed")}
            >
              Reviewed <span className="fc-count">{reviewedTotal}</span>
            </button>
            <button
              className={"gr-filter-chip" + (filter === "all" ? " on" : "")}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <div className="gr-progress">
              <span>{progressPct}% reviewed</span>
              <div className="gr-progress-track">
                <div
                  className="gr-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="gr-table-wrap">
            <table className="gr-table">
              <thead>
                <tr>
                  <th
                    onClick={() => toggleSort("student")}
                    className={sortBy === "student" ? "sorted" : ""}
                  >
                    Student{" "}
                    <span className="sort-arrow">
                      {sortBy === "student"
                        ? sortDir === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </th>
                  <th>Roll no</th>
                  <th
                    onClick={() => toggleSort("test")}
                    className={sortBy === "test" ? "sorted" : ""}
                  >
                    Test{" "}
                    <span className="sort-arrow">
                      {sortBy === "test"
                        ? sortDir === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort("score")}
                    className={sortBy === "score" ? "sorted" : ""}
                  >
                    AI score{" "}
                    <span className="sort-arrow">
                      {sortBy === "score"
                        ? sortDir === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort("confidence")}
                    className={sortBy === "confidence" ? "sorted" : ""}
                  >
                    Confidence{" "}
                    <span className="sort-arrow">
                      {sortBy === "confidence"
                        ? sortDir === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </th>
                  <th>Status</th>
                  <th className="col-num">Flags</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "48px 24px",
                        color: "var(--ink-3)",
                      }}
                    >
                      No submissions match these filters.
                    </td>
                  </tr>
                )}
                {filtered.map((g) => {
                  const isOpen = expanded === g.id;
                  const conf = g.confidence;
                  const displayedScore = overrides[g.id] ?? g.aiScore;
                  return (
                    <React.Fragment key={g.id}>
                      <tr
                        className={isOpen ? "selected" : ""}
                        onClick={() => setExpanded(isOpen ? null : g.id)}
                      >
                        <td className="col-student">{g.student}</td>
                        <td style={{ fontSize: 12.5 }}>{g.roll}</td>
                        <td>{g.test}</td>
                        <td className="col-num">
                          {displayedScore} / {g.maxScore}
                        </td>
                        <td>
                          <span className={"conf-dot " + conf} />
                          {confLabel(conf)}
                        </td>
                        <td>
                          <span
                            className={
                              "status-badge " +
                              (g.status === "reviewed"
                                ? "reviewed"
                                : g.status === "flagged"
                                  ? "flagged"
                                  : "pending")
                            }
                          >
                            {g.status === "reviewed"
                              ? "Reviewed"
                              : g.status === "flagged"
                                ? "Flagged"
                                : "Pending"}
                          </span>
                        </td>
                        <td className="col-num">
                          {g.flags ? (
                            <span className="pill warn">{g.flags}</span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td
                          style={{ color: "var(--ink-4)", textAlign: "right" }}
                        >
                          {isOpen ? "↓" : "→"}
                        </td>
                      </tr>

                      {isOpen && (
                        <tr>
                          <td colSpan={8} style={{ padding: 0 }}>
                            <GradingDetailPanel
                              g={g}
                              onClose={() => setExpanded(null)}
                              onSave={() => setExpanded(null)}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            className="sec"
            style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}
          >
            <button
              className="btn btn-solid"
              onClick={() =>
                toast.push("Bulk approved 6 high-confidence grades", "success")
              }
            >
              Bulk approve high confidence
            </button>
            <button
              className="btn btn-line"
              onClick={() =>
                setConfirmState({
                  title: "Release results to students?",
                  message:
                    "Once released, students will see their marks, the AI's feedback, and any remarks you've added. They will also receive an in-app notification. Results can be un-released later if needed.",
                  confirmLabel: "Release results",
                  onConfirm: () => {
                    toast.push(
                      "Results released — 32 students notified",
                      "success",
                    );
                  },
                })
              }
            >
              Release results to students
            </button>
            <button className="btn btn-text">Download marked PDF</button>
          </div>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TEACHER ANALYTICS
// ═══════════════════════════════════════════════════════════════
const TeacherAnalytics = ({ onStudentClick }) => {
  const ref = useRef();
  const print = useReactToPrint({ contentRef: ref });
  const last = TREND[TREND.length - 1];
  return (
    <div className="main-pad" ref={ref}>
      <div className="print-header">
        <h1>Physics — Grade 11A · Class Analytics</h1>
        <div className="meta">
          Westfield Academy ·{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="crumbs no-print">
        Physics · Grade 11A <b>/</b> Analytics
      </div>
      <div
        className="hstack no-print"
        style={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <h1 className="title">
            Analytics <span className="soft">· T1 – T6</span>
          </h1>
          <p className="lede">
            Everything the class has done this term, in one place.
          </p>
        </div>
        <Conn state="live" secs={12} />
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">Class average</div>
          <div className="kpi-num">
            {last.class}
            <span className="pct">%</span>
          </div>
          <div className="kpi-sub">+12 since T1</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Spread (σ)</div>
          <div className="kpi-num">±{last.spread}</div>
          <div className="kpi-sub">Narrowing</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Topics below target</div>
          <div className="kpi-num alert">2</div>
          <div className="kpi-sub">of 6</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Tests graded</div>
          <div className="kpi-num">6</div>
          <div className="kpi-sub">100% of attempts</div>
        </div>
      </div>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Topic accuracy</h2>
          <span className="sec-note">Sorted weakest first</span>
        </div>
        <div className="analysis">
          <div className="chart-frame">
            <div className="chart-cap">Class accuracy by topic</div>
            <div className="chart-desc">
              Each dot is a topic. The horizontal rule marks 75%, the curriculum
              target.
            </div>
            <DotPlot rows={TOPICS} />
          </div>
          <div>
            <p className="finding">
              <strong>Wave Optics (46%)</strong> and{" "}
              <strong>Electromagnetism (58%)</strong> are the only topics below
              the 75% target.
            </p>
            <p className="finding">
              The strongest topics can safely receive less weight in the next
              draft.
            </p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Topic trajectories</h2>
          <span className="sec-note">T1 → T6</span>
        </div>
        <div className="sm-grid">
          {[...TOPICS]
            .sort((a, b) => a.accuracy - b.accuracy)
            .map((t, i) => (
              <SmallMultiple key={i} topic={t} />
            ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Trend &amp; distribution</h2>
          <span className="sec-note">Class average &amp; spread</span>
        </div>
        <div className="chart-pair">
          <div className="chart-frame">
            <div className="chart-cap">Class average</div>
            <div className="chart-desc">Orange dot marks the latest test.</div>
            <Trend
              data={TREND}
              focal={last.class}
              series={[
                {
                  key: "class",
                  color: "#5B9BD5",
                  width: 2,
                  label: "Class average",
                },
              ]}
            />
          </div>
          <div className="chart-frame">
            <div className="chart-cap">Spread over time</div>
            <div className="chart-desc">Standard deviation.</div>
            <Trend
              data={TREND}
              focal={last.spread}
              series={[
                { key: "spread", color: "#D9A63E", width: 1.5, label: "σ" },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Students</h2>
          <span className="sec-note">
            Sorted by overall · click to open profile
          </span>
        </div>
        <table className="dtable">
          <thead>
            <tr>
              <th>Student</th>
              <th className="num">Overall</th>
              <th>Weakest</th>
              <th>Strongest</th>
              <th className="num">Flags</th>
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map((s, i) => (
              <tr
                key={i}
                onClick={() => onStudentClick?.(s)}
                style={{ cursor: "pointer" }}
              >
                <td className="nm">{s.name}</td>
                <td className="num">{s.overall}%</td>
                <td>
                  <span className="pill mark">{s.weak}</span>
                </td>
                <td>
                  <span className="pill good">{s.strong}</span>
                </td>
                <td className="num">
                  {s.flags ? <span className="pill warn">{s.flags}</span> : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="sec no-print" style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-solid" onClick={print}>
          Export as PDF
        </button>
        <button className="btn btn-line">Filter by test</button>
        <button className="btn btn-text">Export CSV</button>
      </div>
      <div className="print-footer">
        Vellum · Class Analytics · Westfield Academy · Page 1
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// STUDENT ANALYTICS
// ═══════════════════════════════════════════════════════════════
const StudentAnalytics = () => {
  const ref = useRef();
  const print = useReactToPrint({ contentRef: ref });
  const last = TREND[TREND.length - 1];
  const own = TOPICS.map((t) => ({
    ...t,
    accuracy:
      t.accuracy +
      (t.name === "Newton's Laws" ? 3 : t.name === "Wave Optics" ? -8 : 2),
  }));
  return (
    <div className="main-pad" ref={ref}>
      <div className="print-header">
        <h1>Maya Okafor — Physics Progress</h1>
        <div className="meta">
          Westfield Academy · Grade 11A ·{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="crumbs no-print">
        My progress <b>/</b> Physics
      </div>
      <h1 className="title">
        Your progress <span className="soft">· Physics</span>
      </h1>
      <p className="lede">
        Six tests so far. You started below the class. You finished three points
        ahead.
      </p>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">Your average</div>
          <div className="kpi-num">
            {last.maya}
            <span className="pct">%</span>
          </div>
          <div className="kpi-sub">+18 since T1</div>
          <div className="kpi-spark">
            <Spark data={TREND.map((d) => d.maya)} color="#3DB87F" />
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Class average</div>
          <div className="kpi-num">
            {last.class}
            <span className="pct">%</span>
          </div>
          <div className="kpi-sub">You're 2 pts ahead</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Strongest</div>
          <div className="kpi-num" style={{ fontSize: 18, marginTop: 6 }}>
            Newton's Laws
          </div>
          <div className="kpi-sub">95%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Needs work</div>
          <div className="kpi-num alert" style={{ fontSize: 18, marginTop: 6 }}>
            Wave Optics
          </div>
          <div className="kpi-sub">38%</div>
        </div>
      </div>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Your score vs. the class</h2>
          <span className="sec-note">T1 → T6</span>
        </div>
        <div className="chart-frame">
          <div className="chart-cap">You (solid) · Class average (dashed)</div>
          <div className="chart-desc">
            The lines cross at T4. You've been ahead since.
          </div>
          <Trend
            data={TREND}
            focal={last.maya}
            series={[
              { key: "maya", color: "#5B9BD5", width: 2.2, label: "You" },
              {
                key: "class",
                color: "#62625F",
                width: 1.2,
                dash: "4 4",
                label: "Class average",
              },
            ]}
          />
        </div>
      </section>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Your topic profile</h2>
          <span className="sec-note">Small multiples</span>
        </div>
        <div className="sm-grid">
          {[...own]
            .sort((a, b) => a.accuracy - b.accuracy)
            .map((t, i) => (
              <SmallMultiple key={i} topic={t} />
            ))}
        </div>
      </section>

      <div className="sec no-print" style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-solid" onClick={print}>
          Export as PDF
        </button>
        <button className="btn btn-line">Full test history</button>
      </div>
      <div className="print-footer">
        Vellum · Student Progress Report · Maya Okafor · Confidential
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TEST HISTORY
// ═══════════════════════════════════════════════════════════════
const TestHistory = () => {
  const [openId, setOpenId] = useState(null);
  return (
    <div className="main-pad">
      <div className="crumbs">
        My progress <b>/</b> Test history
      </div>
      <h1 className="title">
        Your test <span className="soft">history</span>
      </h1>
      <p className="lede">
        Six attempts this term. Open any one to see every question, every mark,
        and every remark.
      </p>

      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">All attempts</h2>
          <span className="sec-note">Sorted by date</span>
        </div>
        <div className="rowlist">
          {PAST_ATTEMPTS.map((a) => (
            <React.Fragment key={a.id}>
              <div
                className="rowitem"
                style={{ gridTemplateColumns: "2fr 1fr 1fr auto" }}
                onClick={() => setOpenId(openId === a.id ? null : a.id)}
              >
                <div className="rowname">
                  {a.test}
                  <small>
                    {a.date} ·{" "}
                    {a.flagged > 0
                      ? `${a.flagged} anti-cheat flag`
                      : "No flags"}
                  </small>
                </div>
                <div className="rowmeta">
                  <b style={{ fontSize: 20 }}>{a.score}</b>
                  <span style={{ color: "var(--ink-3)" }}> / {a.total}</span>
                </div>
                <div className="rowmeta">
                  <span
                    className={
                      "pill " +
                      (a.score >= 80 ? "good" : a.score >= 65 ? "warn" : "mark")
                    }
                  >
                    {a.score >= 80
                      ? "Strong"
                      : a.score >= 65
                        ? "Solid"
                        : "Needs work"}
                  </span>
                </div>
                <div className="rowgo">{openId === a.id ? "↓" : "→"}</div>
              </div>

              {openId === a.id && (
                <div
                  style={{
                    padding: "20px 0 24px",
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <div className="sec-note" style={{ marginBottom: 14 }}>
                    Question-by-question breakdown
                  </div>
                  {ATTEMPT_DETAIL.map((q, j) => (
                    <div
                      key={j}
                      style={{
                        padding: "14px 0",
                        borderBottom:
                          j < ATTEMPT_DETAIL.length - 1
                            ? "1px solid var(--rule)"
                            : "none",
                      }}
                    >
                      <div
                        className="hstack"
                        style={{
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            color: "var(--ink-3)",
                          }}
                        >
                          Q{j + 1} · {q.type} · {q.topic}
                        </div>
                        <div
                          className={
                            "pill " +
                            (q.earned === q.marks
                              ? "good"
                              : q.earned > 0
                                ? "warn"
                                : "mark")
                          }
                        >
                          {q.earned} / {q.marks}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 13.5,
                          color: "var(--ink-2)",
                          lineHeight: 1.5,
                          marginBottom: 10,
                        }}
                      >
                        {q.text}
                      </div>
                      <div
                        style={{
                          background: "var(--bg)",
                          borderLeft: "3px solid var(--accent)",
                          padding: "10px 14px",
                          borderRadius: 4,
                          fontSize: 13,
                          color: "var(--ink)",
                          lineHeight: 1.55,
                        }}
                      >
                        <strong
                          style={{
                            color: "var(--ink-3)",
                            fontSize: 11,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          Your answer
                        </strong>
                        {q.answer}
                      </div>
                      {q.remark && (
                        <div
                          style={{
                            marginTop: 10,
                            fontSize: 12.5,
                            color: "var(--ink-2)",
                            fontStyle: "italic",
                          }}
                        >
                          <strong
                            style={{ color: "var(--ink)", fontStyle: "normal" }}
                          >
                            Teacher remark.
                          </strong>{" "}
                          {q.remark}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TAKE TEST — with stop-test hard lock
// ═══════════════════════════════════════════════════════════════
const Take = ({ onExit }) => {
  const [selected, setSelected] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [qIndex, setQIndex] = useState(1);
  const [seconds, setSeconds] = useState(23 * 60 + 47);
  const [flags, setFlags] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [conn, setConn] = useState("live");
  const [answered, setAnswered] = useState(new Set());
  const [saved, setSaved] = useState(true);

  const total = 10;
  const locked = stopped;
  const q = GENERATED_QUESTIONS[(qIndex - 1) % GENERATED_QUESTIONS.length];
  const isText = q.type === "Short answer" || q.type === "Numerical";

  useEffect(() => {
    if (locked) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [locked]);

  useEffect(() => {
    if (locked) return;
    const t = setInterval(() => {
      setConn((c) => (c === "live" ? "polling" : "live"));
    }, 5000);
    return () => clearInterval(t);
  }, [locked]);

  useEffect(() => {
    if (locked) return;
    const onVis = () => {
      if (document.hidden) setFlags((f) => f + 1);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [locked]);

  useEffect(() => {
    const t = setTimeout(() => setStopped(true), 20000);
    return () => clearTimeout(t);
  }, []);

  // Track which questions the student has touched
  useEffect(() => {
    if (selected != null || textAnswer) {
      setAnswered((prev) => new Set(prev).add(qIndex));
    }
  }, [selected, textAnswer, qIndex]);

  // Flash the auto-save indicator when something changes
  useEffect(() => {
    if (selected == null && !textAnswer) return;
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 700);
    return () => clearTimeout(t);
  }, [selected, textAnswer]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const warn = seconds < 5 * 60;

  const forceSubmit = () => onExit();

  return (
    <div className="take">
      <div className="take-bar">
        <div className="left">
          <span className="logo-mark">
            <BrandMark size={28} />
          </span>
          <div className="test-name">Newton's Laws — Unit Test</div>
          <span className="pill">Physics · 11A</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div className="anti-bar">
            <div className={"anti-ind " + (flags > 0 ? "warn" : "")}>
              <span className="dot" />
              <span>
                {flags === 0
                  ? "Focus held"
                  : `${flags} tab switch${flags > 1 ? "es" : ""}`}
              </span>
            </div>
            <Conn state={conn} secs={5} />
          </div>
          <div className={"timer " + (warn ? "warn" : "")}>
            {mm}:{ss}
          </div>
        </div>
      </div>

      <div className="take-body">
        <div className="take-inner">
          <div className="take-progress">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={
                  i + 1 < qIndex ? "done" : i + 1 === qIndex ? "on" : ""
                }
              />
            ))}
          </div>

          <div className="take-q-label">
            <span>
              Question {qIndex} of {total} · {q.type}
            </span>
            <span>{q.marks} marks</span>
          </div>

          <div className="take-toolbar">
            <AutoSaveIndicator saved={saved} />
            <QuestionNavigator
              total={total}
              current={qIndex}
              answered={answered}
              onJump={(n) => {
                setQIndex(n);
                setSelected(null);
                setTextAnswer("");
              }}
            />
          </div>

          <div className="take-q">{q.text}</div>

          {!isText && q.options && (
            <div className="take-options">
              {q.options.map((o, i) => (
                <button
                  key={i}
                  className={"take-opt" + (selected === i ? " on" : "")}
                  onClick={() => !locked && setSelected(i)}
                  disabled={locked}
                >
                  <span className="letter">{String.fromCharCode(65 + i)}</span>
                  <span>{o}</span>
                </button>
              ))}
            </div>
          )}

          {isText && (
            <textarea
              className="take-textarea"
              placeholder="Write your answer here…"
              value={textAnswer}
              onChange={(e) => !locked && setTextAnswer(e.target.value)}
              disabled={locked}
            />
          )}

          <div className="take-foot">
            <button
              className="btn btn-text"
              disabled={qIndex === 1 || locked}
              onClick={() => {
                setQIndex(qIndex - 1);
                setSelected(null);
                setTextAnswer("");
              }}
            >
              ← Previous
            </button>
            <span className="dim" style={{ fontSize: 11.5, fontWeight: 500 }}>
              {isText
                ? textAnswer
                  ? "Answer recorded"
                  : "Type your answer"
                : selected == null
                  ? "Select an answer"
                  : "Answer recorded"}
            </span>
            <button
              className="btn btn-solid"
              disabled={locked}
              onClick={() => {
                if (qIndex === total) onExit();
                else {
                  setQIndex(qIndex + 1);
                  setSelected(null);
                  setTextAnswer("");
                }
              }}
            >
              {qIndex === total ? "Submit test" : "Next →"}
            </button>
          </div>
        </div>
      </div>

      <StopTestOverlay
        visible={stopped}
        onForceSubmit={forceSubmit}
        reason="The teacher has stopped this test for everyone."
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════
const AdminHome = () => (
  <div className="main-pad">
    <div className="crumbs">
      Administration <b>/</b> Overview
    </div>
    <h1 className="title">
      Institution <span className="soft">setup</span>
    </h1>
    <p className="lede">
      Create accounts, assign teachers to classes, keep the structure correct.
    </p>
    <div className="kpis">
      <div className="kpi">
        <div className="kpi-label">Teachers</div>
        <div className="kpi-num">
          <AnimatedNumber value={3} duration={700} />
        </div>
      </div>
      <div className="kpi">
        <div className="kpi-label">Students</div>
        <div className="kpi-num">
          <AnimatedNumber value={90} duration={900} />
        </div>
      </div>
      <div className="kpi">
        <div className="kpi-label">Classes</div>
        <div className="kpi-num">
          <AnimatedNumber value={3} duration={700} />
        </div>
      </div>
      <div className="kpi">
        <div className="kpi-label">Subjects</div>
        <div className="kpi-num">
          <AnimatedNumber value={9} duration={800} />
        </div>
      </div>
    </div>
    <section className="sec">
      <div className="sec-head">
        <h2 className="sec-title">Classes</h2>
        <span className="sec-note">3 active</span>
      </div>
      <div className="rowlist">
        {CLASSES.map((c, i) => (
          <div
            key={i}
            className="rowitem"
            style={{ gridTemplateColumns: "1.6fr 1.2fr 0.8fr 0.8fr auto" }}
          >
            <div className="rowname">
              {c.name}
              <small>
                {c.subjects} subjects · {c.students} students
              </small>
            </div>
            <div className="rowmeta" style={{ textAlign: "left" }}>
              {c.teachers.map((t, j) => (
                <span key={j} className="pill" style={{ marginRight: 4 }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="rowmeta">
              <b>{c.students}</b> students
            </div>
            <div className="rowmeta">
              <b>{c.subjects}</b> subjects
            </div>
            <div className="rowgo">→</div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const AdminUsers = ({ onCreateAccount, onRemove }) => (
  <div className="main-pad">
    <div className="crumbs">
      Administration <b>/</b> Accounts
    </div>
    <h1 className="title">Accounts</h1>
    <p className="lede">Every teacher and student in the system.</p>
    <div className="sec" style={{ marginTop: 28 }}>
      <table className="dtable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Class</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {USERS.map((u, i) => (
            <tr key={i}>
              <td className="nm">{u.name}</td>
              <td style={{ fontSize: 12.5 }}>{u.email}</td>
              <td>
                <span
                  className={"pill " + (u.role === "Teacher" ? "accent" : "")}
                >
                  {u.role}
                </span>
              </td>
              <td style={{ fontSize: 12.5 }}>{u.cls}</td>
              <td>
                <span
                  className={
                    "pill " + (u.status === "Active" ? "good" : "warn")
                  }
                >
                  {u.status}
                </span>
              </td>
              <td style={{ textAlign: "right" }}>
                <button
                  className="btn btn-text btn-sm"
                  onClick={() => onRemove?.(u)}
                  aria-label={`Remove ${u.name}`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="sec" style={{ display: "flex", gap: 8 }}>
      <button className="btn btn-solid" onClick={onCreateAccount}>
        Create account
      </button>
      <button className="btn btn-line">Create class</button>
      <button className="btn btn-text">Export list</button>
    </div>
  </div>
);

const AdminClasses = ({ onCreateClass, onOpenClass, onDeleteClass }) => (
  <div className="main-pad">
    <div className="crumbs">
      Administration <b>/</b> Classes
    </div>
    <h1 className="title">Classes</h1>
    <p className="lede">
      Assign teachers, enroll students, keep sections organized. Click a class
      to see its full roster.
    </p>
    <div className="sec rowlist" style={{ marginTop: 28 }}>
      {CLASSES.map((c, i) => (
        <div
          key={i}
          className="rowitem"
          style={{ gridTemplateColumns: "1.4fr 1.2fr 1fr auto auto" }}
          onClick={() => onOpenClass?.(c)}
        >
          <div className="rowname">{c.name}</div>
          <div className="rowmeta" style={{ textAlign: "left" }}>
            {c.teachers.map((t, j) => (
              <span key={j} className="pill" style={{ marginRight: 4 }}>
                {t}
              </span>
            ))}
          </div>
          <div className="rowmeta">
            <b>{c.students}</b> students · <b>{c.subjects}</b> subjects
          </div>
          <button
            className="btn btn-text btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClass?.(c);
            }}
            aria-label={`Delete ${c.name}`}
          >
            Delete
          </button>
          <div className="rowgo">→</div>
        </div>
      ))}
    </div>
    <div className="sec" style={{ display: "flex", gap: 8 }}>
      <button className="btn btn-solid" onClick={onCreateClass}>
        Create class
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  return (
    <ToastProvider>
      <Root />
    </ToastProvider>
  );
}

function Root() {
  const toast = useToast();
  const [role, setRole] = useState(null);
  const [view, setView] = useState("home");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [openClass, setOpenClass] = useState(null);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [rosterOverrides, setRosterOverrides] = useState({});
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openDraft, setOpenDraft] = useState(null);
  const [drafts, setDrafts] = useState([
    {
      id: 1,
      title: "Newton's Laws — Unit Test",
      cls: "11A",
      questions: 12,
      marks: 40,
      status: "draft",
      lastEdited: "2 min ago",
    },
    {
      id: 2,
      title: "Thermodynamics — Mid-term",
      cls: "11A",
      questions: 15,
      marks: 60,
      status: "scheduled",
      lastEdited: "yesterday",
    },
    {
      id: 3,
      title: "Bonding & Structure",
      cls: "11A",
      questions: 10,
      marks: 30,
      status: "draft",
      lastEdited: "3 days ago",
    },
    {
      id: 4,
      title: "Kinematics — Quiz",
      cls: "11A",
      questions: 8,
      marks: 25,
      status: "completed",
      lastEdited: "last week",
    },
    {
      id: 5,
      title: "Wave Optics — Quiz 2",
      cls: "11A",
      questions: 10,
      marks: 30,
      status: "live",
      lastEdited: "just now",
    },
  ]);
  const [courseLessons, setCourseLessons] = useState(LMS_LESSONS);
  const [courses, setCourses] = useState(LMS_COURSES);
  const [threads, setThreads] = useState(CLASS_THREADS);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const [recentViews, pushRecentView, clearRecentViews] = useRecentViews(
    "vellum.recentViews",
    5,
  );
  const [activeClassId, setActiveClassId] = usePersistentState(
    "vellum.activeClass",
    "11A",
  );

  // Global ⌘K / Ctrl+K to open command palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const el = document.createElement("style");
    // themeLoveable overrides the base theme. To revert, remove it from
    // this concatenation and the import at the top of the file.
    el.textContent = styles + responsive + polish + themeLoveable;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, []);

  useDocumentTitle(VIEW_TITLES[view] || null);

  // Track recent views
  useEffect(() => {
    if (role && view) pushRecentView(view);
  }, [role, view, pushRecentView]);

  // Clear the open draft whenever the user leaves the draft screen
  useEffect(() => {
    if (view !== "draft") setOpenDraft(null);
  }, [view]);

  const user =
    role === "teacher"
      ? { name: "Dr. R. Chen", initials: "RC", meta: "Teacher · Westfield" }
      : role === "admin"
        ? { name: "S. Whitfield", initials: "SW", meta: "Registrar" }
        : { name: "Maya Okafor", initials: "MO", meta: "Student · 11A" };

  const handleLogin = (r) => {
    setRole(r);
    setView(r === "admin" ? "admin" : "home");
    toast.push(`Signed in as ${r}`, "success");
  };

  const handleLogout = () => {
    setRole(null);
    setView("home");
    setSelectedStudent(null);
    setPreviewOpen(false);
    setMobileNavOpen(false);
  };

  const getRoster = (clsName) =>
    rosterOverrides[clsName] ||
    CLASS_ROSTERS[clsName] || { teachers: [], students: [] };
  const buildCommandItems = () => {
    if (role === "teacher") {
      return [
        {
          id: "nav-home",
          section: "Navigate",
          label: "Overview",
          hint: "Home",
          action: () => setView("home"),
        },
        {
          id: "nav-materials",
          section: "Navigate",
          label: "Materials",
          hint: "Upload",
          action: () => setView("materials"),
        },
        {
          id: "nav-bank",
          section: "Navigate",
          label: "Question bank",
          hint: "Browse",
          action: () => setView("bank"),
        },
        {
          id: "nav-drafts",
          section: "Navigate",
          label: "Drafts",
          hint: "Manage",
          action: () => setView("drafts"),
        },
        {
          id: "nav-review",
          section: "Navigate",
          label: "Grade review",
          hint: "Pending",
          action: () => setView("review"),
        },
        {
          id: "nav-live",
          section: "Navigate",
          label: "Live test",
          hint: "Monitor",
          action: () => setView("live"),
        },
        {
          id: "nav-analytics",
          section: "Navigate",
          label: "Analytics",
          hint: "Class",
          action: () => setView("analytics"),
        },
        {
          id: "nav-lms",
          section: "Navigate",
          label: "Courses",
          hint: "LMS",
          action: () => setView("lms"),
        },
        {
          id: "nav-chat",
          section: "Navigate",
          label: "Discussion",
          hint: "Chat",
          action: () => setView("chat"),
        },
        {
          id: "act-new",
          section: "Actions",
          label: "New test",
          hint: "Create",
          action: () => setView("draft"),
        },
        {
          id: "act-upload",
          section: "Actions",
          label: "Upload materials",
          hint: "Files",
          action: () => setView("materials"),
        },
        {
          id: "act-logout",
          section: "Account",
          label: "Sign out",
          hint: "",
          action: handleLogout,
        },
      ];
    }

    if (role === "student") {
      return [
        {
          id: "nav-home",
          section: "Navigate",
          label: "Overview",
          hint: "Home",
          action: () => setView("home"),
        },
        {
          id: "nav-take",
          section: "Navigate",
          label: "Take test",
          hint: "Active",
          action: () => setView("take"),
        },
        {
          id: "nav-history",
          section: "Navigate",
          label: "History",
          hint: "Past tests",
          action: () => setView("history"),
        },
        {
          id: "nav-lms",
          section: "Navigate",
          label: "Courses",
          hint: "LMS",
          action: () => setView("lms"),
        },
        {
          id: "nav-chat",
          section: "Navigate",
          label: "Discussion",
          hint: "Chat",
          action: () => setView("chat"),
        },
        {
          id: "nav-analytics",
          section: "Navigate",
          label: "Progress",
          hint: "Analytics",
          action: () => setView("analytics"),
        },
        {
          id: "act-logout",
          section: "Account",
          label: "Sign out",
          hint: "",
          action: handleLogout,
        },
      ];
    }
    return [
      {
        id: "nav-admin",
        section: "Navigate",
        label: "Overview",
        hint: "Home",
        action: () => setView("admin"),
      },
      {
        id: "nav-users",
        section: "Navigate",
        label: "Accounts",
        hint: "Users",
        action: () => setView("users"),
      },
      {
        id: "nav-classes",
        section: "Navigate",
        label: "Classes",
        hint: "Rosters",
        action: () => setView("classes"),
      },
      {
        id: "act-logout",
        section: "Account",
        label: "Sign out",
        hint: "",
        action: handleLogout,
      },
    ];
  };

  const buildPaletteItems = () => {
    const base = buildCommandItems();
    if (recentViews.length === 0) return base;

    const seen = new Set();
    const recentItems = [];
    for (const viewId of recentViews) {
      const match = base.find((it) => it.id === `nav-${viewId}`);
      if (!match || seen.has(match.id)) continue;
      seen.add(match.id);
      recentItems.push({
        ...match,
        id: `recent-${match.id}`,
        section: "Recent",
      });
    }

    return [...recentItems, ...base];
  };

  // Class context must be built before any early return that uses it
  const classList = CLASSES.map((c) => ({
    short: classShort(c.name),
    name: c.name,
    subject: "Physics",
    students: c.students,
  }));
  const activeClassObj =
    classList.find((c) => c.short === activeClassId) || classList[0];
  const classContextValue = {
    activeClass: activeClassObj,
    setActiveClass: setActiveClassId,
    classes: classList,
  };

  if (!role) return <Login onLogin={handleLogin} />;

  if (previewOpen) {
    return <TestPreview onExit={() => setPreviewOpen(false)} />;
  }

  if (role === "student" && view === "take") {
    return (
      <ClassContext.Provider value={classContextValue}>
        <Take onExit={() => setView("home")} />
      </ClassContext.Provider>
    );
  }

  return (
    <ClassContext.Provider value={classContextValue}>
      <div className="shell">
        <Side
          role={role}
          view={view}
          setView={setView}
          user={user}
          onLogout={handleLogout}
          mobileOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          onSearch={() => setCmdOpen(true)}
          classes={classList}
          activeClassId={activeClassId}
          onClassChange={(id) => {
            setActiveClassId(id);
            toast.push(`Switched to ${id}`, "info");
          }}
        />
        <main className="main">
          <MobileTopBar
            onMenuToggle={() => setMobileNavOpen(true)}
            onSearch={() => setCmdOpen(true)}
          />
          <div key={view} className="page-transition">
            {/* ── Admin ─────────────────────────────── */}
            {role === "admin" && view === "admin" && <AdminHome />}
            {role === "admin" && view === "users" && (
              <AdminUsers
                onCreateAccount={() => setAccountModalOpen(true)}
                onRemove={(u) =>
                  setConfirmState({
                    title: `Remove ${u.name}?`,
                    message: `This removes ${u.name}'s account from the platform. Their existing test results and history will remain in the system, but they will lose access immediately. This cannot be undone.`,
                    confirmLabel: "Remove account",
                    onConfirm: () => {
                      toast.push(`Removed ${u.name}`, "info");
                    },
                  })
                }
              />
            )}
            {role === "admin" && view === "classes" && !openClass && (
              <AdminClasses
                onCreateClass={() => setClassModalOpen(true)}
                onOpenClass={setOpenClass}
                onDeleteClass={(c) =>
                  setConfirmState({
                    title: `Delete "${c.name}"?`,
                    message:
                      `This removes the class and unassigns its ${c.students} students and ${c.teachers.length} teacher(s). Their accounts remain active, but this class disappears from every dashboard. ` +
                      `All tests, drafts, and results tied to this class will remain in the system but become inaccessible until the class is restored. This cannot be undone.`,
                    confirmLabel: "Delete class",
                    onConfirm: () => {
                      toast.push(`Deleted "${c.name}"`, "info");
                    },
                  })
                }
              />
            )}
            {role === "admin" && view === "classes" && openClass && (
              <ClassDetail
                cls={openClass}
                roster={getRoster(openClass.name)}
                onBack={() => setOpenClass(null)}
                onStudentClick={(s) =>
                  toast.push(`Opening profile for ${s.name}`, "info")
                }
                onAddStudent={() => setAddStudentOpen(true)}
                onUpdateClass={(data) => {
                  toast.push(`Class renamed to "${data.name}"`, "success");
                  setOpenClass({ ...openClass, name: data.name });
                }}
                onDeleteClass={() =>
                  setConfirmState({
                    title: `Delete "${openClass.name}"?`,
                    message: `This removes the class and unassigns its ${openClass.students} students. Test history remains in the system but becomes inaccessible. This cannot be undone.`,
                    confirmLabel: "Delete class",
                    onConfirm: () => {
                      toast.push(`Deleted "${openClass.name}"`, "info");
                      setOpenClass(null);
                    },
                  })
                }
                onRemoveStudent={(s) =>
                  setConfirmState({
                    title: `Remove ${s.name} from ${openClass.name}?`,
                    message: `${s.name} has ${s.avg}% average in this class. Removing them will hide this class from their dashboard and unassign them from any tests attached to it. Their test history and past results remain intact and can be restored later.`,
                    confirmLabel: "Remove from class",
                    onConfirm: () => {
                      const cur = getRoster(openClass.name);
                      const next = {
                        ...cur,
                        students: cur.students.filter((x) => x.roll !== s.roll),
                      };
                      setRosterOverrides((prev) => ({
                        ...prev,
                        [openClass.name]: next,
                      }));
                      toast.push(
                        `${s.name} removed from ${openClass.name}`,
                        "info",
                      );
                    },
                  })
                }
              />
            )}

            {/* ── Teacher ───────────────────────────── */}
            {role === "teacher" && view === "home" && (
              <TeacherHome setView={setView} />
            )}
            {role === "teacher" && view === "materials" && (
              <Materials setView={setView} />
            )}
            {role === "teacher" && view === "clusters" && (
              <Clusters setView={setView} />
            )}
            {role === "teacher" && view === "bank" && (
              <QuestionBank onAddToDraft={() => setView("draft")} />
            )}
            {role === "teacher" && view === "drafts" && (
              <DraftsList
                drafts={drafts}
                onOpen={(d) => {
                  setOpenDraft(d);
                  setView("draft");
                }}
                onRegenerate={(d) =>
                  setConfirmState({
                    title: `Regenerate "${d.title}"?`,
                    message:
                      "The AI will draft a fresh set of questions using the same rules. Existing questions in this draft will be replaced. This costs one AI request.",
                    confirmLabel: "Regenerate",
                    onConfirm: () => {
                      setDrafts((prev) =>
                        prev.map((x) =>
                          x.id === d.id
                            ? {
                                ...x,
                                questionSet: buildQuestions(DEFAULT_MIX),
                                questions: buildQuestions(DEFAULT_MIX).length,
                                marks: buildQuestions(DEFAULT_MIX).reduce(
                                  (s, q) => s + q.marks,
                                  0,
                                ),
                                regeneratedAt: "just now",
                                lastEdited: "just now",
                              }
                            : x,
                        ),
                      );
                      toast.push("Regenerated with fresh questions", "success");
                    },
                  })
                }
                onDuplicate={(d) => {
                  const copy = {
                    ...d,
                    id: Date.now(),
                    title: `${d.title} (copy)`,
                    status: "draft",
                    lastEdited: "just now",
                  };
                  setDrafts((prev) => [copy, ...prev]);
                  toast.push(`Duplicated "${d.title}"`, "success");
                }}
                onPublish={(d) =>
                  toast.push(`Publishing "${d.title}"…`, "success")
                }
                onSchedule={(d) =>
                  toast.push(`Scheduling "${d.title}"…`, "info")
                }
                onDelete={(d) => {
                  setConfirmState({
                    title: `Delete "${d.title}"?`,
                    message:
                      "This draft and its questions will be removed. You can't undo this.",
                    confirmLabel: "Delete draft",
                    onConfirm: () => {
                      setDrafts((prev) => prev.filter((x) => x.id !== d.id));
                      toast.push(`Deleted "${d.title}"`, "info");
                    },
                  });
                }}
                onNew={() => setView("draft")}
              />
            )}
            {role === "teacher" && view === "draft" && (
              <Draft
                activeClassShort={activeClassId}
                onPreview={() => setPreviewOpen(true)}
                onSaveDraft={(d) => {
                  // Use the active class so the new draft appears in the
                  // currently-viewed class. Without this, drafts created
                  // while viewing class 11B would save as class 11A and
                  // immediately vanish from the class-scoped list.
                  const payload = { ...d, cls: activeClassId };
                  if (openDraft) {
                    setDrafts((prev) =>
                      prev.map((x) =>
                        x.id === openDraft.id
                          ? { ...x, ...payload, lastEdited: "just now" }
                          : x,
                      ),
                    );
                    toast.push("Draft updated", "success");
                  } else {
                    setDrafts((prev) => [
                      { id: Date.now(), ...payload, lastEdited: "just now" },
                      ...prev,
                    ]);
                    toast.push("Draft saved — find it under Drafts", "success");
                  }
                  setOpenDraft(null);
                  setView("drafts");
                }}
              />
            )}
            {role === "teacher" && view === "live" && <LiveControl />}
            {role === "teacher" && view === "review" && <GradeReview />}
            {role === "teacher" && view === "analytics" && !selectedStudent && (
              <TeacherAnalytics onStudentClick={setSelectedStudent} />
            )}
            {role === "teacher" && view === "analytics" && selectedStudent && (
              <StudentProfile
                student={selectedStudent}
                onBack={() => setSelectedStudent(null)}
              />
            )}
            {role === "teacher" && view === "lms" && (
              <TeacherLMS
                courses={courses}
                onCoursesChange={setCourses}
                onOpenDiscussion={() => setView("chat")}
              />
            )}
            {role === "teacher" && view === "chat" && (
              <ClassDiscussion
                role="teacher"
                threads={threads}
                onThreadsChange={setThreads}
              />
            )}

            {/* ── Student ───────────────────────────── */}
            {role === "student" && view === "home" && <StudentAnalytics />}
            {role === "student" && view === "history" && <TestHistory />}
            {role === "student" && view === "lms" && (
              <StudentLMS
                courses={courses}
                lessons={courseLessons}
                onLessonsChange={(courseId, next) => {
                  setCourseLessons((prev) => ({ ...prev, [courseId]: next }));
                }}
                onOpenDiscussion={() => setView("chat")}
              />
            )}
            {role === "student" && view === "chat" && (
              <ClassDiscussion
                role="student"
                threads={threads}
                onThreadsChange={setThreads}
              />
            )}
            {role === "student" && view === "analytics" && <StudentAnalytics />}
          </div>
        </main>

        <CreateAccountModal
          open={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
          onCreated={(data) => console.log("Account created:", data)}
        />
        <CreateClassModal
          open={classModalOpen}
          onClose={() => setClassModalOpen(false)}
          onCreated={(data) => console.log("Class created:", data)}
          teachers={["R. Chen", "L. Park", "D. Osei"]}
        />
        <AddStudentModal
          open={addStudentOpen}
          onClose={() => setAddStudentOpen(false)}
          onAdded={(s) => {
            if (!openClass) return;
            const cur = getRoster(openClass.name);
            const next = { ...cur, students: [...cur.students, s] };
            setRosterOverrides((prev) => ({ ...prev, [openClass.name]: next }));
          }}
        />
        <CommandPalette
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          items={buildPaletteItems()}
          onSelect={(item) => item.action?.()}
        />
        <ConfirmDialog
          open={!!confirmState}
          title={confirmState?.title}
          message={confirmState?.message}
          confirmLabel={confirmState?.confirmLabel || "Delete"}
          onConfirm={() => confirmState?.onConfirm?.()}
          onClose={() => setConfirmState(null)}
        />
      </div>
    </ClassContext.Provider>
  );
}
