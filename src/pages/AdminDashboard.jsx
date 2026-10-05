import { Users, GraduationCap, Layers, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { AnimatedNumber, Bento, MetricCard, SectionHeader } from "@/components/common";
import { CLASSES } from "@/data/classes";

// ═══════════════════════════════════════════════════════════════
// ADMIN HOME
// ═══════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Administration <span className="text-ink-3">/</span> Overview
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
          Institution <span className="text-ink-3">setup</span>
        </h1>
        <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
          Create accounts, assign teachers to classes, keep the structure
          correct.
        </p>
      </div>

      <div className="bento mb-14">
        <MetricCard
          icon={Users}
          iconTone="primary"
          label="Teachers"
          value={<AnimatedNumber value={3} duration={700} />}
          delta="Active"
          deltaTone="success"
        />
        <MetricCard
          icon={GraduationCap}
          iconTone="success"
          label="Students"
          value={<AnimatedNumber value={90} duration={900} />}
          delta="+6 this term"
          deltaTone="success"
        />
        <MetricCard
          icon={Layers}
          iconTone="warning"
          label="Classes"
          value={<AnimatedNumber value={3} duration={700} />}
          delta="3 active"
          deltaTone="success"
        />
        <MetricCard
          icon={BookOpen}
          iconTone="neutral"
          label="Subjects"
          value={<AnimatedNumber value={9} duration={800} />}
          delta="Across all grades"
          deltaTone="success"
        />
      </div>

      <section>
        <SectionHeader
          label="Classes · 3 active"
          action="Manage →"
          onAction={() => navigate("/admin/classes")}
        />
        <div className="grid gap-3 tablet:grid-cols-2 lg:grid-cols-3">
          {CLASSES.map((c) => (
            <Bento
              as="button"
              key={c.id}
              onClick={() => navigate("/admin/classes")}
              className="group cursor-pointer text-left hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary-dim font-mono text-[12px] font-bold tracking-wider text-primary">
                  {c.code}
                </div>
                <ChevronRight
                  size={16}
                  className="text-ink-3 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </div>

              <div className="mt-auto pt-6">
                <div className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
                  {c.name}
                </div>
                <div className="mt-1 text-[12.5px] text-ink-3">
                  {c.subjects} subjects · {c.students} students
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.teachers.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-rule-2 bg-surface/60 px-2 py-0.5 text-[12px] font-medium text-ink-2"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Bento>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
