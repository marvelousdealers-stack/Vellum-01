import { Users, GraduationCap, Layers, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { AnimatedNumber, Bento, MetricCard, PageError, PageLoading, SectionHeader } from "@/components/common";
import { useUsers } from "@/hooks/useAdmin";
import { useClasses, useSubjects } from "@/hooks/useSubjects";

// ═══════════════════════════════════════════════════════════════
// ADMIN HOME
// ═══════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const navigate = useNavigate();
  const usersRes = useUsers();
  const classesRes = useClasses();
  const subjectsRes = useSubjects();

  if (usersRes.isLoading || classesRes.isLoading || subjectsRes.isLoading) return <PageLoading />;
  const loadError = usersRes.error || classesRes.error || subjectsRes.error;
  if (loadError) {
    return (
      <PageError
        error={loadError}
        onRetry={() => { usersRes.refetch(); classesRes.refetch(); subjectsRes.refetch(); }}
      />
    );
  }
  const users = usersRes.data ?? [];
  const classes = classesRes.data ?? [];
  const teachers = users.filter((u) => u.role === "teacher");
  const students = users.filter((u) => u.role === "student");
  const inactive = (list) => list.filter((u) => !u.active).length;
  const unassigned = students.filter((u) => !u.classId).length;
  const delta = (n, word) => (n ? `${n} ${word}` : "All active");

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-3">
        Administration <span className="text-ink-3">/</span> Overview
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-[28px] font-semibold tablet:text-[34px] leading-[1.1] tracking-[-0.02em] text-ink">
          Institution <span className="text-ink-3">setup</span>
        </h1>
        <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
          Create accounts, assign teachers to classes, keep the structure
          correct.
        </p>
      </div>

      <div className="bento mb-14">
        <MetricCard
          tinted={false}
          icon={Users}
          iconTone="primary"
          label="Teachers"
          value={<AnimatedNumber value={teachers.length} duration={700} />}
          delta={delta(inactive(teachers), "inactive")}
          deltaTone={inactive(teachers) ? "warning" : "success"}
        />
        <MetricCard
          tinted={false}
          icon={GraduationCap}
          iconTone="primary"
          label="Students"
          value={<AnimatedNumber value={students.length} duration={900} />}
          delta={unassigned ? `${unassigned} without a class` : delta(inactive(students), "inactive")}
          deltaTone={unassigned || inactive(students) ? "warning" : "success"}
        />
        <MetricCard
          tinted={false}
          icon={Layers}
          iconTone="primary"
          label="Classes"
          value={<AnimatedNumber value={classes.length} duration={700} />}
          delta={`${classes.filter((c) => c.teachers.length === 0).length || "All"} ${classes.some((c) => c.teachers.length === 0) ? "without a teacher" : "have a teacher"}`}
          deltaTone="neutral"
        />
        <MetricCard
          tinted={false}
          icon={BookOpen}
          iconTone="primary"
          label="Subjects"
          value={<AnimatedNumber value={(subjectsRes.data ?? []).length} duration={800} />}
          delta="Across all classes"
          deltaTone="neutral"
        />
      </div>

      <section>
        <SectionHeader
          label={`Classes · ${classes.length}`}
          action="Manage →"
          onAction={() => navigate("/admin/classes")}
        />
        <div className="grid gap-4 tablet:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {classes.map((c) => (
            <Bento
              as="button"
              key={c.id}
              onClick={() => navigate(`/admin/classes/${c.id}`)}
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
                  {c.subjectCount} subjects · {c.studentCount} students
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.teachers.map((t) => (
                  <span
                    key={t.id}
                    className="rounded-full border border-rule-2 bg-surface/60 px-2 py-0.5 text-[12px] font-medium text-ink-2"
                  >
                    {t.name}
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
