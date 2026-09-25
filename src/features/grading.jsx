import React, { useState, useMemo } from "react";
import { usePersistentState } from "../hooks/use-persistent-state";
import { EmptyState } from "../components/ui-kit";
import { Trend, SmallMultiple, Conn, SearchIcon } from "../shared/shared";
import { QUESTION_BANK, STUDENT_PROFILES, TOPICS, TREND, PAST_ATTEMPTS, EXTRACTED_TEXT_SAMPLE, GRADE_QUEUE } from "../shared/shared";
import { useToast } from "../components/toast";

// ═══════════════════════════════════════════════════════════════
// STUDENT PROFILE
// ═══════════════════════════════════════════════════════════════
export const StudentProfile = ({ student, onBack }) => {
  const toast = useToast();
  const profile = STUDENT_PROFILES[student.name] || STUDENT_PROFILES.default;
  const ownTopics = TOPICS.map((t) => ({
    ...t,
    accuracy: Math.max(20, Math.min(100, t.accuracy + (profile.bias?.[t.name] ?? 0))),
  }));

  return (
    <div className="main-pad">
      <button className="btn btn-text" onClick={onBack} style={{ padding: "6px 0", marginBottom: 12 }}>
        ← Back to analytics
      </button>
      <div className="crumbs">Physics · Grade 11A <b>/</b> Students <b>/</b> {student.name}</div>

      <div className="hstack" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
        <div>
          <h1 className="title">{student.name} <span className="soft">· 11A</span></h1>
          <p className="lede">
            Overall {student.overall}% across {profile.attempts} attempts.
            Strongest in {student.strong}. Needs work on {student.weak}.
          </p>
        </div>
        <div className="hstack" style={{ gap: 8 }}>
          <button className="btn btn-line" onClick={() => toast.push(`Report exported for ${student.name}`, "success")}>Export report</button>
          <button className="btn btn-solid" onClick={() => toast.push(`Note added to ${student.name}'s file`, "success")}>Add note</button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi"><div className="kpi-label">Overall</div>
          <div className="kpi-num">{student.overall}<span className="pct">%</span></div>
          <div className="kpi-sub">Class average 84%</div></div>
        <div className="kpi"><div className="kpi-label">Attempts</div>
          <div className="kpi-num">{profile.attempts}</div>
          <div className="kpi-sub">Across 3 tests</div></div>
        <div className="kpi"><div className="kpi-label">Strongest topic</div>
          <div className="kpi-num" style={{ fontSize: 18, marginTop: 6 }}>{student.strong}</div>
          <div className="kpi-sub">{profile.strongScore}% accuracy</div></div>
        <div className="kpi"><div className="kpi-label">Needs work</div>
          <div className="kpi-num alert" style={{ fontSize: 18, marginTop: 6 }}>{student.weak}</div>
          <div className="kpi-sub">{profile.weakScore}% accuracy</div></div>
      </div>

      <section className="sec">
        <div className="sec-head"><h2 className="sec-title">Score trajectory</h2>
          <span className="sec-note">T1 → T6 · vs class average</span></div>
        <div className="chart-frame">
          <div className="chart-cap">Student (solid) · Class average (dashed)</div>
          <div className="chart-desc">
            {profile.trailing
              ? `Started ${profile.gap > 0 ? "below" : "above"} the class and finished ${Math.abs(profile.gap)} points ${profile.gap > 0 ? "ahead" : "behind"}.`
              : "Consistently tracking close to the class average."}
          </div>
          <Trend
            data={TREND.map((d) => ({ ...d, student: d.class + (profile.bias?.overall ?? 0) }))}
            focal={TREND[TREND.length - 1].class + (profile.bias?.overall ?? 0)}
            series={[
              { key: "student", color: "#5B9BD5", width: 2.2, label: student.name },
              { key: "class", color: "#62625F", width: 1.2, dash: "4 4", label: "Class average" },
            ]}
          />
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><h2 className="sec-title">Topic profile</h2>
          <span className="sec-note">Accuracy per topic</span></div>
        <div className="sm-grid">
          {[...ownTopics].sort((a, b) => a.accuracy - b.accuracy).map((t, i) => (
            <SmallMultiple key={i} topic={t} />
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><h2 className="sec-title">Recent attempts</h2>
          <span className="sec-note">Last 4</span></div>
        <table className="dtable">
          <thead><tr><th>Test</th><th>Date</th><th className="num">Score</th><th>Verdict</th><th className="num">Flags</th></tr></thead>
          <tbody>
            {PAST_ATTEMPTS.slice(0, 4).map((a, i) => (
              <tr key={i}>
                <td className="nm">{a.test}</td>
                <td>{a.date}</td>
                <td className="num">{a.score} / {a.total}</td>
                <td><span className={"pill " + (a.score >= 80 ? "good" : a.score >= 65 ? "warn" : "mark")}>
                  {a.score >= 80 ? "Strong" : a.score >= 65 ? "Solid" : "Needs work"}</span></td>
                <td className="num">{a.flagged ? <span className="pill warn">{a.flagged}</span> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// EXTRACTED TEXT REVIEW (PDF §7.3)
// ═══════════════════════════════════════════════════════════════
export const ExtractedTextReview = ({ open, onClose, onConfirm }) => {
  const toast = useToast();
  const [edits, setEdits] = useState(() =>
    Object.fromEntries(EXTRACTED_TEXT_SAMPLE.map((f) => [f.id, f.text]))
  );

  if (!open) return null;

  const qualityLabel = (q) => q === "high" ? "Clean read" : q === "med" ? "Some guesswork" : "Poor read";
  const handleConfirm = () => {
    onConfirm?.(edits);
    toast.push("Extracted text saved to subject", "success");
    onClose();
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Review extracted text</h2>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <div className="xr-note">
            <strong>Check before saving.</strong> Each file below was read by a different method.
            Correct any OCR or transcription errors here — the corrected text is what feeds topic
            detection and question generation.
          </div>

          {EXTRACTED_TEXT_SAMPLE.map((f) => (
            <div key={f.id} className="xr-file">
              <div className="xr-file-head">
                <div className={"file-tag " + f.kind.toLowerCase()}>{f.kind}</div>
                <div style={{ flex: 1 }}>
                  <div className="xr-file-name">{f.label}</div>
                  <div className="xr-file-meta">{f.route === "DIRECT" ? "Direct text extraction" : f.route === "VISION" ? "Vision model transcription" : "Pasted text"}</div>
                </div>
                <div className={"xr-file-quality " + f.quality}>
                  <span className="q-dot" />
                  {qualityLabel(f.quality)}
                </div>
              </div>
              <div className="xr-file-body">
                <textarea
                  value={edits[f.id]}
                  onChange={(e) => setEdits((prev) => ({ ...prev, [f.id]: e.target.value }))}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="modal-foot">
          <button className="btn btn-text" onClick={onClose}>Cancel</button>
          <button className="btn btn-line" onClick={() => toast.push("Re-extraction queued", "info")}>Re-extract all</button>
          <button className="btn btn-solid" onClick={handleConfirm}>Save corrected text</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MANUAL GRADING QUEUE (PDF §7.9) — used when AI grading is off
// ═══════════════════════════════════════════════════════════════
export const ManualGradingQueue = ({ onEnableAI }) => {
  const toast = useToast();
  const [expanded, setExpanded] = useState(null);
  const [scores, setScores] = useState({});
  const [remarks, setRemarks] = useState({});

  const queue = useMemo(
    () => GRADE_QUEUE.filter((g) => !g.reviewed).map((g) => ({ ...g, aiScore: null, confidence: null })),
    []
  );

  return (
    <div>
      <div className="kpis" style={{ marginTop: 0 }}>
        <div className="kpi"><div className="kpi-label">In queue</div>
          <div className="kpi-num alert">{queue.length}</div>
          <div className="kpi-sub">Awaiting your mark</div>
        </div>
        <div className="kpi"><div className="kpi-label">Graded by AI</div>
          <div className="kpi-num">0</div>
          <div className="kpi-sub">AI grading is off</div>
        </div>
        <div className="kpi"><div className="kpi-label">Written answers</div>
          <div className="kpi-num">12</div>
          <div className="kpi-sub">Across 3 tests</div>
        </div>
        <div className="kpi"><div className="kpi-label">Average time</div>
          <div className="kpi-num">2<span className="den"> min</span></div>
          <div className="kpi-sub">Per answer, this session</div>
        </div>
      </div>

      <div className="sec" style={{ marginTop: 32 }}>
        <div className="sec-head">
          <h2 className="sec-title">Manual queue</h2>
          <div className="hstack" style={{ gap: 8 }}>
            <span className="sec-note" style={{ marginRight: 8 }}>AI grading is off for this test</span>
            <button className="btn btn-line btn-sm" onClick={onEnableAI}>Re-enable AI grading</button>
          </div>
        </div>

        {queue.length === 0 && (
          <div className="mg-empty">
            <div className="mg-empty-title">All caught up</div>
            <p>Every written answer has been graded. Nothing in the manual queue.</p>
          </div>
        )}

        {queue.length > 0 && (
          <table className="gr-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll no</th>
                <th>Test</th>
                <th className="col-num">Max marks</th>
                <th className="col-num">Flags</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {queue.map((g) => {
                const isOpen = expanded === g.id;
                const displayed = scores[g.id] ?? "";
                return (
                  <React.Fragment key={g.id}>
                    <tr className={isOpen ? "selected" : ""} onClick={() => setExpanded(isOpen ? null : g.id)}>
                      <td className="col-student">{g.student}</td>
                      <td style={{ fontSize: 12.5 }}>{g.roll}</td>
                      <td>{g.test}</td>
                      <td className="col-num">{g.maxScore}</td>
                      <td className="col-num">{g.flags ? <span className="pill warn">{g.flags}</span> : "—"}</td>
                      <td style={{ color: "var(--ink-4)", textAlign: "right" }}>{isOpen ? "↓" : "→"}</td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={6} style={{ padding: 0 }}>
                          <div className="gr-detail">
                            <div className="gr-detail-inner">
                              <div className="gr-detail-head">
                                <div>
                                  <div className="gr-detail-student">{g.student}</div>
                                  <div className="gr-detail-meta">
                                    <span>Roll {g.roll}</span><span>·</span><span>{g.test}</span><span>·</span><span>{g.date}</span>
                                  </div>
                                </div>
                                <span className="pill">Manual grading</span>
                              </div>

                              <div className="gr-answer-block">
                                <div className="gr-answer-label">Question</div>
                                <div className="gr-answer-question">{g.question}</div>
                                <div className="gr-answer-label">Student's answer</div>
                                <div className="gr-answer-text">{g.answer}</div>
                              </div>

                              <div className="gr-score-row">
                                <div className="gr-score-label">Your mark</div>
                                <div className="gr-score-input-group">
                                  <input
                                    className="gr-score-input"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="—"
                                    value={displayed}
                                    onChange={(e) => {
                                      const v = e.target.value.replace(/[^0-9.]/g, "");
                                      setScores((prev) => ({ ...prev, [g.id]: v }));
                                    }}
                                  />
                                  <span className="gr-score-max">/ {g.maxScore}</span>
                                </div>
                                <button className="btn btn-line btn-sm">Open rubric</button>
                              </div>

                              <textarea
                                className="remark-input"
                                style={{ marginTop: 16 }}
                                placeholder="Add a remark for the student…"
                                value={remarks[g.id] || ""}
                                onChange={(e) => setRemarks((prev) => ({ ...prev, [g.id]: e.target.value }))}
                              />

                              <div className="gr-actions">
                                <button
                                  className="btn btn-solid"
                                  onClick={() => toast.push(`${g.student} graded at ${displayed || "—"} / ${g.maxScore}`, "success")}
                                >
                                  Save mark &amp; move to next
                                </button>
                                <button className="btn btn-line" onClick={() => toast.push("Saved without releasing", "info")}>Save without releasing</button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// QUESTION BANK
// ═══════════════════════════════════════════════════════════════
export const QuestionBank = ({ onAddToDraft }) => {
  const toast = useToast();
   const [search, setSearch] = usePersistentState("vellum.bank.search", "");
  const [topicFilter, setTopicFilter] = usePersistentState("vellum.bank.topicFilter", "all");
  const [sourceFilter, setSourceFilter] = usePersistentState("vellum.bank.sourceFilter", "all");
  const [sortBy, setSortBy] = usePersistentState("vellum.bank.sortBy", "used");
  const [sortDir, setSortDir] = usePersistentState("vellum.bank.sortDir", "desc");
  const [selected, setSelected] = useState(new Set());
  const [expanded, setExpanded] = useState(null);

  const topics = useMemo(() => Array.from(new Set(QUESTION_BANK.map((q) => q.topic))), []);

  const filtered = useMemo(() => {
    let rows = [...QUESTION_BANK];
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      rows = rows.filter((q) => q.text.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s));
    }
    if (topicFilter !== "all") rows = rows.filter((q) => q.topic === topicFilter);
    if (sourceFilter !== "all") rows = rows.filter((q) => q.source === sourceFilter);
    rows.sort((a, b) => {
      let va, vb;
      if (sortBy === "used") { va = a.used; vb = b.used; }
      else if (sortBy === "marks") { va = a.marks; vb = b.marks; }
      else if (sortBy === "topic") { va = a.topic; vb = b.topic; }
      else { va = a.text; vb = b.text; }
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return rows;
  }, [search, topicFilter, sourceFilter, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortDir("desc"); }
  };
  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((q) => q.id)));
  };
  const handleAddSelected = () => {
    if (selected.size === 0) return;
    toast.push(`${selected.size} question${selected.size > 1 ? "s" : ""} added to draft`, "success",
      { action: { label: "View draft", onClick: () => onAddToDraft?.([...selected]) } });
    setSelected(new Set());
  };

  return (
    <div className="main-pad">
      <div className="crumbs">Physics · Grade 11A <b>/</b> Question bank</div>
      <div className="hstack" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="title">Question <span className="soft">bank</span></h1>
          <p className="lede">Every question you've approved — from past papers and from drafts — tagged and ready to reuse.</p>
        </div>
        <Conn state="live" />
      </div>

      <div className="kpis">
        <div className="kpi"><div className="kpi-label">Total questions</div><div className="kpi-num">{QUESTION_BANK.length}</div></div>
        <div className="kpi"><div className="kpi-label">From past papers</div><div className="kpi-num">{QUESTION_BANK.filter((q) => q.source === "past-paper").length}</div></div>
        <div className="kpi"><div className="kpi-label">Generated</div><div className="kpi-num">{QUESTION_BANK.filter((q) => q.source === "generated").length}</div></div>
        <div className="kpi"><div className="kpi-label">Most reused</div><div className="kpi-num">{Math.max(...QUESTION_BANK.map((q) => q.used))}<span className="den">×</span></div></div>
      </div>

      <div className="gr-filter-bar">
        <label className="gr-search">
          <SearchIcon />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search question text or topic…" />
        </label>
        <select className="qb-select" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
          <option value="all">All topics</option>
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="qb-select" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
          <option value="all">Any source</option>
          <option value="past-paper">Past papers</option>
          <option value="generated">AI-generated</option>
        </select>
        <div className="gr-progress" style={{ marginLeft: "auto" }}><span>{filtered.length} shown</span></div>
      </div>

      {selected.size > 0 && (
        <div className="qb-bulk-bar">
          <span>{selected.size} selected</span>
          <button className="btn btn-solid btn-sm" onClick={handleAddSelected}>Add to draft</button>
          <button className="btn btn-text btn-sm" onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      )}

      <table className="gr-table">
        <thead>
          <tr>
            <th style={{ width: 36 }}>
              <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={selectAll} aria-label="Select all" />
            </th>
            <th onClick={() => toggleSort("text")} className={sortBy === "text" ? "sorted" : ""}>
              Question <span className="sort-arrow">{sortBy === "text" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
            </th>
            <th onClick={() => toggleSort("topic")} className={sortBy === "topic" ? "sorted" : ""}>
              Topic <span className="sort-arrow">{sortBy === "topic" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
            </th>
            <th>Source</th>
            <th onClick={() => toggleSort("marks")} className={sortBy === "marks" ? "sorted" : ""}>
              Marks <span className="sort-arrow">{sortBy === "marks" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
            </th>
            <th onClick={() => toggleSort("used")} className={sortBy === "used" ? "sorted" : ""}>
              Used <span className="sort-arrow">{sortBy === "used" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
            </th>
          </tr>
        </thead>
        <tbody>
                    {filtered.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: 0, borderBottom: "none" }}>
                <EmptyState
                  title="No questions found"
                  body="Try a different search, or broaden the filters."
                  action="Clear filters"
                  onAction={() => {
                    setSearch("");
                    setTopicFilter("all");
                    setSourceFilter("all");
                  }}
                  compact
                />
              </td>
            </tr>
          )}
          {filtered.map((q) => {
            const isOpen = expanded === q.id;
            const isSelected = selected.has(q.id);
            return (
              <React.Fragment key={q.id}>
                <tr className={isOpen ? "selected" : ""} onClick={() => setExpanded(isOpen ? null : q.id)}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={(e) => toggleSelect(q.id, e)} aria-label={`Select question ${q.id}`} />
                  </td>
                  <td style={{ color: "var(--ink)", fontWeight: 500 }}>{q.text.length > 90 ? q.text.slice(0, 90) + "…" : q.text}</td>
                  <td><span className="pill accent">{q.topic}</span></td>
                  <td><span className={"pill " + (q.source === "past-paper" ? "" : "good")}>{q.source === "past-paper" ? "Past paper" : "Generated"}</span></td>
                  <td className="col-num">{q.marks}</td>
                  <td className="col-num">{q.used}×</td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <div className="gr-detail">
                        <div className="gr-detail-inner">
                          <div className="gr-detail-head">
                            <div>
                              <div className="gr-detail-student" style={{ fontSize: 20 }}>Question preview</div>
                              <div className="gr-detail-meta">
                                <span>{q.type}</span><span>·</span><span>{q.topic}</span><span>·</span><span>{q.marks} marks</span>
                              </div>
                            </div>
                            <div className="hstack" style={{ gap: 8 }}>
                              <button className="btn btn-line btn-sm" onClick={(e) => { e.stopPropagation(); toast.push("Question duplicated to bank", "success"); }}>Duplicate</button>
                              <button className="btn btn-solid btn-sm" onClick={(e) => { e.stopPropagation(); toast.push("Question added to draft", "success"); }}>Add to draft</button>
                            </div>
                          </div>
                          <div className="gr-answer-block">
                            <div className="gr-answer-label">Question</div>
                            <div className="gr-answer-question" style={{ fontSize: 19 }}>{q.text}</div>
                            {q.options && (
                              <div className="q-opts" style={{ marginTop: 12 }}>
                                {q.options.map((o, j) => (
                                  <div key={j} className="q-opt"><span className="letter">{String.fromCharCode(65 + j)}</span><span>{o}</span></div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="gr-rubric">
                            <div className="gr-rubric-title">Rubric</div>
                            {q.rubric.map((r, j) => (
                              <div key={j} className="gr-rubric-item"><span>{r.label}</span><span className="ri-score">{r.points} pts</span></div>
                            ))}
                          </div>
                          <div className="gr-detail-meta" style={{ marginTop: 16 }}>
                            <span>Last used: {q.lastUsed}</span><span>·</span><span>Used in {q.used} test{q.used !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ADMIN — CREATE ACCOUNT MODAL
// ═══════════════════════════════════════════════════════════════
export const CreateAccountModal = ({ open, onClose, onCreated }) => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Teacher");
  const [cls, setCls] = useState("");

  if (!open) return null;
  const reset = () => { setName(""); setEmail(""); setRole("Teacher"); setCls(""); };
  const submit = () => {
    if (!name.trim() || !email.trim()) { toast.push("Name and email are required", "error"); return; }
    onCreated?.({ name, email, role, cls });
    toast.push(`${role} account created for ${name}`, "success");
    reset(); onClose();
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Create account</h2>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="fld"><label>Full name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. A. Mensah" autoFocus /></div>
          <div className="fld"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="a.mensah@westfield.edu" autoComplete="off" /></div>
          <div className="fld"><label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Teacher</option><option>Student</option>
            </select>
          </div>
          {role === "Student" && (
            <div className="fld"><label>Class</label>
              <select value={cls} onChange={(e) => setCls(e.target.value)}>
                <option value="">— Choose a class —</option>
                <option>Grade 11 — Section A</option>
                <option>Grade 11 — Section B</option>
                <option>Grade 10 — Section A</option>
              </select>
            </div>
          )}
          <div className="pill accent" style={{ marginTop: 6 }}>A temporary password will be emailed automatically</div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-text" onClick={onClose}>Cancel</button>
          <button className="btn btn-solid" onClick={submit}>Create account</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ADMIN — CREATE CLASS MODAL
// ═══════════════════════════════════════════════════════════════
export const CreateClassModal = ({ open, onClose, onCreated, teachers = [] }) => {
  const toast = useToast();
  const [name, setName] = useState("");
  const [year, setYear] = useState("2026");
  const [assigned, setAssigned] = useState([]);

  if (!open) return null;
  const toggleTeacher = (t) => setAssigned((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]));
  const reset = () => { setName(""); setAssigned([]); setYear("2026"); };
  const submit = () => {
    if (!name.trim()) { toast.push("Class name is required", "error"); return; }
    onCreated?.({ name, year, teachers: assigned });
    toast.push(`Class "${name}" created with ${assigned.length} teacher${assigned.length !== 1 ? "s" : ""}`, "success");
    reset(); onClose();
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Create class</h2>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="fld"><label>Class name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grade 12 — Section C" autoFocus /></div>
          <div className="fld"><label>Academic year</label><input value={year} onChange={(e) => setYear(e.target.value)} /></div>
          <div className="fld"><label>Assign teachers</label>
            <div className="chip-row" style={{ marginTop: 4 }}>
              {teachers.length === 0 && <span className="dim" style={{ fontSize: 12.5 }}>No teachers yet — create one first</span>}
              {teachers.map((t) => (
                <button key={t} type="button" className={"chip " + (assigned.includes(t) ? "on" : "")} onClick={() => toggleTeacher(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="pill" style={{ marginTop: 6 }}>Students can be enrolled after the class is created</div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-text" onClick={onClose}>Cancel</button>
          <button className="btn btn-solid" onClick={submit}>Create class</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TEST PREVIEW
// ═══════════════════════════════════════════════════════════════
export const TestPreview = ({ onExit }) => {
  const toast = useToast();
  const [qIndex, setQIndex] = useState(0);
  const questions = [
    { id: 1, type: "MCQ", topic: "Newton's Laws", marks: 2,
      text: "A 5 kg block rests on a frictionless horizontal surface. A horizontal force of 20 N is applied. What is the block's acceleration?",
      options: ["2 m/s²", "4 m/s²", "10 m/s²", "25 m/s²"] },
    { id: 2, type: "Short answer", topic: "Newton's Laws", marks: 4,
      text: "State Newton's Second Law of Motion and explain, in your own words, how it relates to the concept of inertia." },
    { id: 3, type: "MCQ", topic: "Thermodynamics", marks: 2,
      text: "In an isothermal expansion of an ideal gas, which quantity remains constant throughout the process?",
      options: ["Internal energy", "Pressure", "Volume", "Heat transferred"] },
    { id: 4, type: "Numerical", topic: "Kinematics", marks: 3,
      text: "A car of mass 1200 kg decelerates uniformly from 25 m/s to rest in 8 seconds. Calculate the magnitude of the average braking force." },
  ];
  const q = questions[qIndex];
  const isText = q.type === "Short answer" || q.type === "Numerical";

  return (
    <div className="take">
      <div className="take-bar" style={{ background: "var(--raised)", borderBottom: "1px solid var(--accent)" }}>
        <div className="left">
          <div className="logo-mark">V</div>
          <div className="test-name">Newton's Laws — Unit Test</div>
          <span className="pill accent">PREVIEW MODE</span>
        </div>
        <div className="hstack" style={{ gap: 16 }}>
          <span className="dim" style={{ fontSize: 11.5, fontWeight: 500 }}>This is what students see</span>
          <button className="btn btn-line btn-sm" onClick={onExit}>Exit preview</button>
        </div>
      </div>

      <div className="take-body">
        <div className="take-inner">
          <div className="take-progress">
            {questions.map((_, i) => (<span key={i} className={i < qIndex ? "done" : i === qIndex ? "on" : ""} />))}
          </div>
          <div className="take-q-label">
            <span>Question {qIndex + 1} of {questions.length} · {q.type}</span>
            <span>{q.marks} marks</span>
          </div>
          <div className="take-q">{q.text}</div>

          {!isText && q.options && (
            <div className="take-options">
              {q.options.map((o, i) => (
                <button key={i} className="take-opt" disabled style={{ cursor: "default", opacity: 0.85 }}>
                  <span className="letter">{String.fromCharCode(65 + i)}</span>
                  <span>{o}</span>
                </button>
              ))}
            </div>
          )}
          {isText && (<div className="take-textarea" style={{ color: "var(--ink-4)" }}>Students type their answer here…</div>)}

          <div className="take-foot">
            <button className="btn btn-text" disabled={qIndex === 0} onClick={() => setQIndex(qIndex - 1)}>← Previous</button>
            <span className="dim" style={{ fontSize: 11.5, fontWeight: 500 }}>Interactive preview disabled</span>
            <button className="btn btn-solid" onClick={() => {
              if (qIndex === questions.length - 1) { toast.push("End of preview", "info"); onExit(); }
              else setQIndex(qIndex + 1);
            }}>
              {qIndex === questions.length - 1 ? "Finish preview" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};