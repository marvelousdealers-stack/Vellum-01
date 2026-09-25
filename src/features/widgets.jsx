import React, { useState, useEffect } from "react";
import { Icon, TOPICS, TREND, GRADE_QUEUE, CLASS_THREADS } from "../shared/shared";
import { useToast } from "../components/toast";

// ═══════════════════════════════════════════════════════════════
// 1. LIVE ACTIVITY FEED
// ═══════════════════════════════════════════════════════════════
const FEED_DATA = [
  { id: 1, kind: "submit",  text: "Maya Okafor submitted",      detail: "Newton's Laws — Unit Test",  when: "just now" },
  { id: 2, kind: "flag",    text: "AI flagged a session",        detail: "Adrian Bell · 3 tab switches", when: "2 min ago" },
  { id: 3, kind: "publish", text: "Test published",              detail: "Thermodynamics — Mid-term",   when: "18 min ago" },
  { id: 4, kind: "grade",   text: "You graded 4 submissions",   detail: "Newton's Laws — Unit Test",   when: "1 hr ago" },
  { id: 5, kind: "chat",    text: "New reply in Discussion",     detail: "Tomás Reyes · Lens sign convention", when: "2 hr ago" },
  { id: 6, kind: "upload",  text: "Materials extracted",         detail: "IMG_2043.heic · 6 topics",    when: "3 hr ago" },
];

const FEED_DOT = {
  submit:  "accent",
  flag:    "mark",
  publish: "accent",
  grade:   "good",
  chat:    "accent",
  upload:  "good",
};

export const LiveActivityFeed = () => {
  const [items, setItems] = useState(FEED_DATA);

  // Simulate one new submission arriving
  useEffect(() => {
    const t = setTimeout(() => {
      setItems(prev => [
        { id: Date.now(), kind: "submit", text: "Priya Nair submitted", detail: "Newton's Laws — Unit Test", when: "just now" },
        ...prev.slice(0, 5),
      ]);
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="feed-card">
      <div className="feed-head">
        <div className="feed-title">
          <span className="feed-live-dot" />
          Live activity
        </div>
        <span className="feed-meta">{items.length} recent</span>
      </div>
      <ul className="feed-list">
        {items.map((it) => (
          <li key={it.id} className="feed-item">
            <span className={"feed-dot " + FEED_DOT[it.kind]} />
            <div className="feed-body">
              <div className="feed-text">{it.text}</div>
              <div className="feed-detail">{it.detail}</div>
            </div>
            <span className="feed-when">{it.when}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. SCOPE ESTIMATE CARD
// Renders under the rules form — gives the teacher feedback
// before they press "Create test" instead of after.
// ═══════════════════════════════════════════════════════════════
export const ScopeEstimate = ({ mix, totalMarks, targetMarks, duration, mode }) => {
  const totalQuestions = mix.reduce((s, r) => s + r.count, 0);
  const estimatedSeconds = totalQuestions * 90;
  const estimatedMin = Math.round(estimatedSeconds / 60);
  const isOver = totalMarks > targetMarks;
  const isUnder = totalMarks < targetMarks;
  const tight = duration < estimatedMin - 5;
  const generous = duration > estimatedMin + 20;

  return (
    <div className="scope-card">
      <div className="scope-head">
        <div className="scope-title">Draft scope</div>
        <div className="scope-sub">What this will produce</div>
      </div>

      <div className="scope-grid">
        <div className="scope-stat">
          <div className="scope-label">Questions</div>
          <div className="scope-value">{totalQuestions}</div>
        </div>
        <div className="scope-stat">
          <div className="scope-label">Total marks</div>
          <div className={"scope-value " + (isOver ? "over" : isUnder ? "under" : "ok")}>
            {totalMarks}
            {targetMarks > 0 && <span className="scope-target"> / {targetMarks}</span>}
          </div>
        </div>
        <div className="scope-stat">
          <div className="scope-label">Duration</div>
          <div className={"scope-value " + (tight ? "under" : generous ? "over" : "ok")}>
            {duration}<span className="scope-unit"> min</span>
          </div>
        </div>
        <div className="scope-stat">
          <div className="scope-label">Mode</div>
          <div className="scope-value scope-value-sm">
            {mode === "personal" ? "Per student" : "Whole class"}
          </div>
        </div>
      </div>

      <div className="scope-note">
        {tight && (
          <><Icon name="warn" size={13} /> At {totalQuestions} questions, students will need about {estimatedMin} min. The current {duration}-min limit may be tight.</>
        )}
        {!tight && generous && (
          <><Icon name="check" size={13} /> Comfortable pace — {totalQuestions} questions in {duration} min gives students plenty of room.</>
        )}
        {!tight && !generous && (
          <><Icon name="check" size={13} /> Well-balanced — {totalQuestions} questions typically take about {estimatedMin} min, fitting the {duration}-min limit.</>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. AI EVALUATION CHECKLIST
// Side-by-side grading: student answer + AI's per-rubric verdict
// ═══════════════════════════════════════════════════════════════
const buildRubricVerdict = (marksAwarded, maxMarks) => {
  const ratio = marksAwarded / maxMarks;
  return [
    { label: "Identifies the correct principle",  verdict: ratio >= 0.4 ? "pass" : "fail" },
    { label: "Shows the working or reasoning",    verdict: ratio >= 0.6 ? "pass" : "partial" },
    { label: "States the final answer with units",verdict: ratio >= 0.8 ? "pass" : "partial" },
    { label: "Uses correct terminology",          verdict: ratio >= 0.9 ? "pass" : "fail" },
  ];
};

export const GradingDetailPanel = ({ g, onClose, onSave }) => {
  const toast = useToast();
  const [score, setScore] = useState(g.aiScore);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    setScore(g.aiScore);
    setRemark("");
  }, [g.id, g.aiScore]);

  const verdicts = buildRubricVerdict(score, g.maxScore);
  const changed = score !== g.aiScore;

  return (
    <div className="gd-panel">
      <div className="gd-head">
        <div>
          <div className="gd-student">{g.student}</div>
          <div className="gd-meta">
            <span>Roll {g.roll}</span><span>·</span><span>{g.test}</span><span>·</span><span>{g.date}</span>
          </div>
        </div>
        <div className={"ai-badge " + g.confidence}>
          <span className="dot" />
          {g.confidence === "low" ? "Low" : g.confidence === "med" ? "Medium" : "High"} confidence
        </div>
      </div>

      <div className="gd-question">
        <div className="gd-question-label">Question</div>
        <div className="gd-question-text">{g.question}</div>
      </div>

      <div className="gd-two-col">
        <div className="gd-col">
          <div className="gd-col-head">Student's answer</div>
          <div className="gd-answer">{g.answer}</div>
        </div>
        <div className="gd-col">
          <div className="gd-col-head gd-col-head-ai">
            <Icon name="spark" size={13} />
            AI evaluation
          </div>
          <ul className="gd-verdicts">
            {verdicts.map((v, i) => (
              <li key={i} className={"gd-verdict " + v.verdict}>
                <span className="gd-verdict-icon">
                  {v.verdict === "pass" ? "✓" : v.verdict === "partial" ? "~" : "✗"}
                </span>
                <span className="gd-verdict-label">{v.label}</span>
              </li>
            ))}
          </ul>
          <div className="gd-ai-just">
            Suggested {g.aiScore} / {g.maxScore} based on {verdicts.filter(v => v.verdict === "pass").length} of 4 rubric items fully met.
          </div>
        </div>
      </div>

      <div className="gd-override">
        <div className="gd-override-head">
          <span className="gd-override-title">Your mark</span>
          {changed && (
            <span className="pill accent" style={{ fontSize: 11 }}>Overridden (was {g.aiScore})</span>
          )}
        </div>
        <div className="gd-override-row">
          <input
            className="gd-score-input"
            type="text"
            inputMode="decimal"
            value={score}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9.]/g, "");
              setScore(v === "" ? "" : Math.min(g.maxScore, parseFloat(v)));
            }}
          />
          <span className="gd-score-max">/ {g.maxScore}</span>
          <div className="gd-score-bar">
            <div className="gd-score-fill" style={{ width: `${(score / g.maxScore) * 100}%` }} />
          </div>
        </div>
      </div>

      <textarea
        className="gd-remark"
        placeholder="Feedback for the student… (optional)"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        rows={3}
      />

      <div className="gd-actions">
        <button className="btn btn-text" onClick={onClose}>Close</button>
        <div className="gd-actions-right">
          <button className="btn btn-line" onClick={() => { toast.push("Saved without releasing", "info"); onSave?.(); }}>
            Save without releasing
          </button>
          <button className="btn btn-solid" onClick={() => {
            toast.push(`${g.student} graded at ${score} / ${g.maxScore}`, "success");
            onSave?.();
          }}>
            Accept & continue
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. QUESTION NAVIGATOR GRID + AUTO-SAVE INDICATOR
// Used inside Take test — numbered jump-to-question buttons
// ═══════════════════════════════════════════════════════════════
export const QuestionNavigator = ({ total, current, answered, onJump }) => (
  <div className="qn-wrap">
    <div className="qn-label">Question</div>
    <div className="qn-grid">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const isCurrent = n === current;
        const isAnswered = answered.has(n);
        return (
          <button
            key={n}
            className={"qn-btn" + (isCurrent ? " current" : "") + (isAnswered ? " answered" : "")}
            onClick={() => onJump(n)}
            aria-label={`Go to question ${n}${isAnswered ? " (answered)" : ""}`}
          >
            {n}
          </button>
        );
      })}
    </div>
    <div className="qn-legend">
      <span><span className="qn-legend-dot current" />Current</span>
      <span><span className="qn-legend-dot answered" />Answered</span>
      <span><span className="qn-legend-dot" />Unanswered</span>
    </div>
  </div>
);

export const AutoSaveIndicator = ({ saved }) => (
  <div className={"autosave" + (saved ? " saved" : "")}>
    <Icon name={saved ? "check" : "spark"} size={12} />
    {saved ? "Auto-saved just now" : "Saving…"}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// 5. MODULE GROUPING — wrap the LMS lessons into modules
// ═══════════════════════════════════════════════════════════════
export const groupLessonsIntoModules = (lessons) => {
  // Simple grouping: chunks of 3–4 lessons per module.
  // Backend will pass modules explicitly later.
  const modules = [];
  const CHUNK = 3;
  for (let i = 0; i < lessons.length; i += CHUNK) {
    modules.push({
      id: `m-${i / CHUNK}`,
      title: `Module ${Math.floor(i / CHUNK) + 1} · ${moduleTitle(lessons[i]?.title || "")}`,
      lessons: lessons.slice(i, i + CHUNK),
    });
  }
  return modules;
};

const moduleTitle = (firstLesson) => {
  const t = firstLesson.toLowerCase();
  if (t.includes("introduction") || t.includes("force")) return "Foundations";
  if (t.includes("apply") || t.includes("problem")) return "Applications";
  if (t.includes("mistake") || t.includes("common")) return "Common pitfalls";
  if (t.includes("wave") || t.includes("lens")) return "Waves & Optics";
  return "Lessons";
};

export const ModuleHeader = ({ module, open, onToggle, progress }) => (
  <button className={"module-head" + (open ? " open" : "")} onClick={onToggle}>
    <span className="module-chevron">{open ? "▾" : "▸"}</span>
    <span className="module-title">{module.title}</span>
    <span className="module-count">
      {module.lessons.length} {module.lessons.length === 1 ? "lesson" : "lessons"}
    </span>
    <span className="module-progress">
      <span className="module-progress-bar">
        <span className="module-progress-fill" style={{ width: `${progress}%` }} />
      </span>
      <span className="module-progress-num">{progress}%</span>
    </span>
  </button>
);

// ═══════════════════════════════════════════════════════════════
// 6. CLASS DISCUSSIONS PREVIEW
// Small embed on the teacher overview — shows the last 2 threads
// ═══════════════════════════════════════════════════════════════
export const DiscussionPreview = ({ onOpenAll }) => {
  const recent = CLASS_THREADS.filter(t => !t.resolved).slice(0, 2);
  return (
    <div className="dp-card">
      <div className="dp-head">
        <div className="dp-title">Recent discussions</div>
        <button className="dp-link" onClick={onOpenAll}>View all →</button>
      </div>
      <ul className="dp-list">
        {recent.map((t) => (
          <li key={t.id} className="dp-item" onClick={onOpenAll}>
            <div className={"dp-tag dp-tag-" + t.tag.toLowerCase()}>{t.tag}</div>
            <div className="dp-body">
              <div className="dp-thread-title">{t.title}</div>
              <div className="dp-thread-meta">
                {t.author} · {t.replies.length} {t.replies.length === 1 ? "reply" : "replies"}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};