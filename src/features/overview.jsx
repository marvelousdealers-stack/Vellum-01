import React from "react";
import { LiveActivityFeed, DiscussionPreview } from "./widgets";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
} from "recharts";
import { Spark, Conn, TOPICS, TREND, GRADE_QUEUE } from "../shared/shared";
import { useActiveClass, CLASS_STATS } from "../context/class-context";
import { useToast } from "../components/toast";

// ─── Interactive dot plot (unchanged behavior) ─────────────────
const dotColor = (acc) => acc < 60 ? "#FF4D1C" : acc < 80 ? "#D9A63E" : "#3DB87F";

const DotTooltip = ({ active, payload, onDrillDown }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="dot-tooltip">
      <div className="dot-tooltip-name">{d.topic}</div>
      <div className="dot-tooltip-row">
        <span className="dot-tooltip-label">Class accuracy</span>
        <span className={"dot-tooltip-value " + (d.accuracy < 60 ? "weak" : d.accuracy < 80 ? "mid" : "ok")}>
          {d.accuracy}%
        </span>
      </div>
      <div className="dot-tooltip-row">
        <span className="dot-tooltip-label">Students affected</span>
        <span className="dot-tooltip-value">{d.affected}</span>
      </div>
      <button type="button" className="dot-tooltip-cta"
              onClick={(e) => { e.stopPropagation(); onDrillDown?.(d); }}>
        View students →
      </button>
    </div>
  );
};

const InteractiveDotPlot = ({ rows, onDrillDown }) => {
  const data = [...rows].sort((a, b) => a.accuracy - b.accuracy).map((r) => ({
    topic: r.name,
    accuracy: r.accuracy,
    affected: r.affected || Math.round((100 - r.accuracy) * 0.4),
    x: r.accuracy,
    y: r.name,
  }));

  return (
    <div className="dotplot-recharts" style={{ width: "100%", height: Math.max(220, data.length * 44) }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 40, bottom: 24, left: 8 }}>
          <CartesianGrid horizontal={false} stroke="var(--rule)" />
          <XAxis type="number" dataKey="x" domain={[0, 100]}
                 tickFormatter={(v) => `${v}%`}
                 axisLine={{ stroke: "var(--rule-2)" }} tickLine={false}
                 tick={{ fill: "var(--ink-3)", fontSize: 11, fontFamily: "'Inter', sans-serif" }} />
          <YAxis type="category" dataKey="y" width={150}
                 axisLine={false} tickLine={false}
                 tick={{ fill: "var(--ink-2)", fontSize: 12, fontFamily: "'Inter', sans-serif" }} />
          <ZAxis range={[110, 110]} />
          <Tooltip content={<DotTooltip onDrillDown={onDrillDown} />}
                   cursor={{ stroke: "var(--rule-2)", strokeDasharray: "3 3" }}
                   wrapperStyle={{ pointerEvents: "auto", outline: "none" }} />
          <Scatter data={data} isAnimationActive={false}>
            {data.map((entry, i) => (
              <Cell key={i} fill={dotColor(entry.accuracy)} style={{ cursor: "pointer" }} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="dotplot-scale">
        <span>0%</span><span>25</span><span>50</span><span>75</span><span>100%</span>
      </div>
    </div>
  );
};

// ─── Icons (compact, 16px) ──────────────────────────────────────
const IconNew = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
  </svg>
);
const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16V4M12 4l-4 4M12 4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
  </svg>
);
const IconReview = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);
const IconBank = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-6 9 6M5 21V9M19 21V9M9 21V9M15 21V9M3 21h18" />
  </svg>
);
const IconWarn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4l9 16H3L12 4z" />
    <path d="M12 10v4M12 18v.5" />
  </svg>
);

// ─── Teacher Home ───────────────────────────────────────────────
export const TeacherHome = ({ setView }) => {
  const toast = useToast();
  const last = TREND[TREND.length - 1];
  const { activeClass } = useActiveClass();
  const stats = CLASS_STATS[activeClass?.short] || CLASS_STATS["11A"];

  const pendingReviews = GRADE_QUEUE.filter((g) => g.status !== "reviewed").length;
  const lowConfidence = GRADE_QUEUE.filter(
    (g) => g.confidence === "low" && g.status !== "reviewed"
  ).length;

  const studentsAtRisk = Math.max(2, Math.round(stats.students * 0.15));

  return (
    <div className="main-pad">
      <div className="crumbs">
        {activeClass?.subject || "Physics"} · {activeClass?.name || "Grade 11 — Section A"} <b>/</b> Overview
      </div>

      {/* Header */}
      <div className="hstack" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="title">Good morning <span className="soft">· Dr. Chen</span></h1>
          <p className="lede">
            Six tests this term. The class is improving, but two topics are holding it back.
          </p>
        </div>
        <Conn state="live" />
      </div>

      {/* KPI strip — 4 unique metrics */}
      <div className="kpis kpis-fixed">
        <button className="kpi kpi-clickable" onClick={() => setView("analytics")}>
          <div className="kpi-label">Class average</div>
          <div className="kpi-num">
            {last.class}<span className="pct">%</span>
          </div>
          <div className="kpi-sub kpi-sub-up">+12 since T1</div>
          <div className="kpi-spark">
            <Spark data={TREND.map((d) => d.class)} color="var(--good)" />
          </div>
        </button>

        <button className="kpi kpi-clickable" onClick={() => setView("analytics")}>
          <div className="kpi-label">Weak topics</div>
          <div className="kpi-num alert">
            2<span className="den"> of 6</span>
          </div>
          <div className="kpi-sub">Wave Optics · Electromagnetism</div>
        </button>

        <button className="kpi kpi-clickable" onClick={() => setView("analytics")}>
          <div className="kpi-label">Students at risk</div>
          <div className="kpi-num">
            {studentsAtRisk}<span className="den"> of {stats.students}</span>
          </div>
          <div className="kpi-sub">Below 75% overall</div>
        </button>

        <button className="kpi kpi-clickable" onClick={() => setView("review")}>
          <div className="kpi-label">Pending reviews</div>
          <div className="kpi-num alert">{pendingReviews}</div>
          <div className="kpi-sub">Awaiting your decision</div>
        </button>
      </div>

      {/* Subtle next-action bar — only when there is work waiting */}
      {pendingReviews > 0 && (
        <button className="next-action-bar" onClick={() => setView("review")}>
          <span className="nab-icon"><IconWarn /></span>
          <span className="nab-text">
            <strong>{pendingReviews} submissions</strong> awaiting your review
            {lowConfidence > 0 && <> · {lowConfidence} flagged low-confidence</>}
          </span>
          <span className="nab-cta">Open grade review →</span>
        </button>
      )}

      {/* Compact quick actions */}
      <div className="quick-bar">
        <button className="quick-btn primary" onClick={() => setView("draft")}>
          <span className="qb-icon"><IconNew /></span>
          <span>New test</span>
        </button>
        <button className="quick-btn" onClick={() => setView("materials")}>
          <span className="qb-icon"><IconUpload /></span>
          <span>Upload materials</span>
        </button>
        <button className="quick-btn" onClick={() => setView("review")}>
          <span className="qb-icon"><IconReview /></span>
          <span>Review grades</span>
          {pendingReviews > 0 && <span className="qb-count">{pendingReviews}</span>}
        </button>
        <button className="quick-btn" onClick={() => setView("bank")}>
          <span className="qb-icon"><IconBank /></span>
          <span>Question bank</span>
        </button>
      </div>

      {/* Analytics summary — one chart + link */}
      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Where the class stands</h2>
          <button className="btn btn-text btn-sm" onClick={() => setView("analytics")}>
            Full analytics →
          </button>
        </div>
        <div className="analysis">
          <div className="chart-frame">
            <div className="chart-cap">Topic accuracy — sorted weakest first</div>
            <div className="chart-desc">
              Each dot is a topic. Hover to see the numbers.
            </div>
            <InteractiveDotPlot
              rows={TOPICS}
              onDrillDown={(d) => {
                toast.push(`Opening students struggling with ${d.topic}`, "info");
                setView("analytics");
              }}
            />
          </div>
          <div>
            <p className="finding">
              <strong>Wave Optics</strong> is the weakest topic at{" "}
              <span className="flag">46%</span>. Eighteen of thirty-two students
              got the lens equation sign convention wrong.
            </p>
            <p className="finding">
              <strong>Electromagnetism</strong> sits at{" "}
              <span className="flag">58%</span> and is declining slowly.
            </p>
            <p className="finding">
              Everything else is at or above <span className="ok">74%</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Recent drafts — compact rows */}
      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Recent drafts</h2>
          <button className="btn btn-text btn-sm" onClick={() => setView("drafts")}>
            View all →
          </button>
        </div>
        <div className="rowlist">
          {[
            { t: "Newton's Laws — Unit Test", s: "Physics · Grade 11A", q: 12, m: 40, mode: "Whole class" },
            { t: "Thermodynamics — Mid-term", s: "Physics · Grade 11A", q: 15, m: 60, mode: "Per student" },
            { t: "Bonding & Structure",       s: "Chemistry · Grade 11A", q: 10, m: 30, mode: "Whole class" },
          ].map((r, i) => (
            <div key={i} className="rowitem" style={{ gridTemplateColumns: "1.6fr 1fr 1fr auto" }}
                 onClick={() => setView("draft")}>
              <div className="rowname">{r.t}<small>{r.s}</small></div>
              <div className="rowmeta">{r.q} questions<br />{r.m} marks</div>
              <div className="rowmeta">
                <span className={"pill " + (r.mode === "Per student" ? "accent" : "")}>{r.mode}</span>
              </div>
              <div className="rowgo">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* Live activity + discussion preview */}
      <section className="sec">
        <div className="sec-head">
          <h2 className="sec-title">Live activity</h2>
          <span className="sec-note">Updates as things happen</span>
        </div>
        <div className="overview-split">
          <LiveActivityFeed />
          <DiscussionPreview onOpenAll={() => setView("chat")} />
        </div>
      </section>
    </div>
  );
};