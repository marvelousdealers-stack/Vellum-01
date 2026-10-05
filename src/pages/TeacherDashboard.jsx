import { TrendingUp, Target, Users, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Bento, Conn, MetricCard, SectionHeader } from "@/components/common";
import { InteractiveDotPlot } from "@/components/common/charts/InteractiveDotPlot";
import { Spark } from "@/components/common/charts/Spark";
import { DiscussionPreview } from "@/components/teacher-dashboard/DiscussionPreview";
import { LiveActivityFeed } from "@/components/teacher-dashboard/LiveActivityFeed";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { TOPICS, TREND } from "@/data/analytics";
import { CLASS_STATS } from "@/data/classes";
import { GRADE_QUEUE } from "@/data/tests";
import { Badge } from "@/components/ui/badge";

// ═══════════════════════════════════════════════════════════════
// TEACHER HOME — bento grid layout
// ═══════════════════════════════════════════════════════════════
const TeacherDashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { activeClassObj } = useApp();
  const last = TREND[TREND.length - 1];
  const stats = CLASS_STATS[activeClassObj?.short] || CLASS_STATS["11A"];

  const pendingReviews = GRADE_QUEUE.filter((g) => g.status !== "reviewed").length;
  const lowConfidence = GRADE_QUEUE.filter((g) => g.confidence === "low" && g.status !== "reviewed").length;
  const studentsAtRisk = Math.max(2, Math.round(stats.students * 0.15));

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-4 flex items-center gap-2 text-[13px] font-medium text-ink-3">
        {activeClassObj?.subject || "Physics"} · {activeClassObj?.name || "Grade 11 — Section A"}
        <span className="text-ink-3">/</span> Overview
      </div>

      {/* ── Header: title + live indicator ── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Good morning, Dr. Chen
          </h1>
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
            Six tests this term. The class is improving, but two topics are holding it back.
          </p>
        </div>
      </div>

      {/* ── KPI row: four equal cards. Class average is the single featured one. ── */}
      <div className="bento">
        <MetricCard
          variant="featured"
          icon={TrendingUp}
          iconTone="primary"
          label="Class average"
          value={last.class}
          unit="%"
          delta="+12 since T1"
          deltaTone="success"
          onClick={() => navigate("/teacher/analytics")}
          sparkline={<Spark data={TREND.map((d) => d.class)} color="var(--color-primary)" height={32} />}
        />
        <MetricCard
          icon={Target}
          iconTone="danger"
          label="Weak topics"
          value={2}
          unit="of 6"
          delta="Below target"
          deltaTone="danger"
          onClick={() => navigate("/teacher/analytics")}
        />
        <MetricCard
          icon={Users}
          iconTone="warning"
          label="Students at risk"
          value={studentsAtRisk}
          unit={`of ${stats.students}`}
          delta="Under 75%"
          deltaTone="warning"
          onClick={() => navigate("/teacher/analytics")}
        />
        <MetricCard
          icon={CheckCircle2}
          iconTone={pendingReviews > 0 ? "primary" : "success"}
          label="Pending reviews"
          value={pendingReviews}
          delta={lowConfidence > 0 ? `${lowConfidence} low confidence` : "All confident"}
          deltaTone={lowConfidence > 0 ? "warning" : "success"}
          onClick={() => navigate("/teacher/review")}
        />

        {/* ── Topic accuracy (3/4) + key findings (1/4) ── */}
        <Bento span="sm:col-span-2 lg:col-span-3" className="min-h-[340px]">
          <SectionHeader
            label="Topic accuracy"
            meta="Weakest first"
            action="Full analytics"
            onAction={() => navigate("/teacher/analytics")}
          />
          <div className="flex-1">
            <InteractiveDotPlot
              rows={TOPICS}
              onDrillDown={(d) => {
                toast.push(`Opening students struggling with ${d.topic}`, "info");
                navigate("/teacher/analytics");
              }}
            />
          </div>
        </Bento>

        <Bento span="sm:col-span-2 lg:col-span-1">
          <SectionHeader label="What matters" />
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-1 text-[14px] font-semibold text-ink">Wave Optics</div>
              <div className="text-[13px] leading-relaxed text-ink-2">
                Weakest at <span className="font-semibold text-danger">46%</span>. 18 of 32 students got the lens sign convention wrong.
              </div>
            </div>
            <div className="border-t border-rule pt-4">
              <div className="mb-1 text-[14px] font-semibold text-ink">Electromagnetism</div>
              <div className="text-[13px] leading-relaxed text-ink-2">
                Sits at <span className="font-semibold text-warning">58%</span> and declining slowly.
              </div>
            </div>
            <div className="border-t border-rule pt-4">
              <div className="mb-1 text-[14px] font-semibold text-ink">Everything else</div>
              <div className="text-[13px] leading-relaxed text-ink-2">
                At or above <span className="font-semibold text-success">74%</span>. Safe to reduce weight next draft.
              </div>
            </div>
          </div>
        </Bento>

        {/* ── Recent drafts (2/4) · Live activity (1/4) · Discussion (1/4) ── */}
        <Bento span="sm:col-span-2">
          <SectionHeader label="Recent drafts" action="View all" onAction={() => navigate("/teacher/drafts")} />
          <ul className="-mx-2 flex flex-col">
            {RECENT_DRAFTS.map((r) => (
              <li key={r.title}>
                <button
                  type="button"
                  onClick={() => navigate("/teacher/drafts/new")}
                  className="group flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors hover:bg-raised"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium text-ink">{r.title}</div>
                    <div className="mt-0.5 truncate text-[12.5px] text-ink-3">
                      {r.subject} · {r.questions} questions · {r.marks} marks
                    </div>
                  </div>
                  <Badge variant={r.mode === "Per student" ? "primary" : "neutral"}>{r.mode}</Badge>
                </button>
              </li>
            ))}
          </ul>
        </Bento>

        <Bento span="sm:col-span-1">
          <SectionHeader label="Live activity" meta={<Conn state="live" />} />
          <LiveActivityFeed />
        </Bento>

        <Bento span="sm:col-span-1">
          <SectionHeader label="Discussion" action="View all" onAction={() => navigate("/teacher/chat")} />
          <DiscussionPreview onOpenAll={() => navigate("/teacher/chat")} />
        </Bento>
      </div>
    </div>
  );
};

const RECENT_DRAFTS = [
  { title: "Newton's Laws — Unit Test", subject: "Physics · 11A", questions: 12, marks: 40, mode: "Whole class" },
  { title: "Thermodynamics — Mid-term", subject: "Physics · 11A", questions: 15, marks: 60, mode: "Per student" },
  { title: "Bonding & Structure", subject: "Chemistry · 11A", questions: 10, marks: 30, mode: "Whole class" },
  { title: "Kinematics — Quick Quiz", subject: "Physics · 11A", questions: 8, marks: 20, mode: "Whole class" },
  { title: "Wave Optics — Practice Set", subject: "Physics · 11A", questions: 14, marks: 35, mode: "Per student" },
];

export default TeacherDashboard;
