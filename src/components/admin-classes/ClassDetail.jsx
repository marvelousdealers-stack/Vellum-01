import { useState, useMemo } from "react";
import { ChevronLeft, Users, GraduationCap, Layers, Search as SearchIcon } from "lucide-react";
import { ClassSettingsModal } from "./ClassSettingsModal";
import { Chip, ChipRow, EmptyState, MetricCard } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// CLASS DETAIL
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
    return roster.students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q),
    );
  }, [roster.students, search]);

  const stats = useMemo(() => {
    const active = roster.students.filter((s) => s.status === "Active").length;
    const avg = roster.students.length
      ? Math.round(
          roster.students.reduce((sum, s) => sum + s.avg, 0) /
            roster.students.length,
        )
      : 0;
    return { active, avg, total: roster.students.length };
  }, [roster.students]);

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <Button
        onClick={onBack} variant="ghost" size="sm" className="mb-3"
      >
        <ChevronLeft size={13} /> Back to classes
      </Button>

      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Administration <span className="text-ink-3">/</span> Classes{" "}
        <span className="text-ink-3">/</span> {cls.name}
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            {cls.name}
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            {roster.teachers.length} teacher
            {roster.teachers.length !== 1 ? "s" : ""} assigned · {stats.total}{" "}
            student{stats.total !== 1 ? "s" : ""} enrolled · {cls.subjects}{" "}
            subjects
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            onClick={() => setSettingsOpen(true)} variant="outline"
          >
            Class settings
          </Button>
          <Button
            onClick={onAddStudent}
          >
            + Add student
          </Button>
        </div>
      </div>

      <div className="bento mb-8">
        <MetricCard
          icon={Users}
          iconTone="primary"
          label="Students"
          value={stats.total}
          delta={`${stats.active} active`}
          deltaTone="success"
        />
        <MetricCard
          icon={GraduationCap}
          iconTone="neutral"
          label="Teachers"
          value={roster.teachers.length}
          delta="Assigned"
          deltaTone="success"
        />
        <MetricCard
          icon={Layers}
          iconTone="success"
          label="Class average"
          value={stats.avg}
          unit="%"
          delta="All subjects"
          deltaTone="success"
        />
        <MetricCard
          icon={Layers}
          iconTone="warning"
          label="Subjects"
          value={cls.subjects}
          delta="Active"
          deltaTone="success"
        />
      </div>

      <div className="sticky top-14 z-10 -mx-5 mb-4 flex flex-wrap items-center gap-2 border-b border-rule bg-bg/95 px-5 py-3 backdrop-blur-xl tablet:-mx-10 tablet:px-10">
        <ChipRow>
          <Chip active={tab === "students"} onClick={() => setTab("students")}>
            Students ({stats.total})
          </Chip>
          <Chip active={tab === "teachers"} onClick={() => setTab("teachers")}>
            Teachers ({roster.teachers.length})
          </Chip>
        </ChipRow>

        {tab === "students" && (
          <>
            <label className="relative ml-2 flex h-9 min-w-[200px] flex-1 items-center gap-2 rounded-[var(--radius-control)] border border-rule-2 bg-surface px-2.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 narrow:max-w-[320px]">
              <SearchIcon size={13} className="shrink-0 text-ink-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or roll no…"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
              />
            </label>
            <div className="ml-auto font-mono text-[12px] tabular-nums text-ink-3">
              {filteredStudents.length} shown
            </div>
          </>
        )}
      </div>

      {tab === "students" && (
        <div className="overflow-hidden rounded-[var(--radius-container)] border border-rule bg-surface shadow-[var(--shadow-card)]">
          {filteredStudents.length === 0 ? (
            <EmptyState
              compact
              title="No students match"
              body="Try a different search term."
              action={search ? "Clear search" : undefined}
              onAction={() => setSearch("")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-rule-2">
                    {["Name", "Roll no", "Email", "Avg", "Status", ""].map(
                      (h, i) => (
                        <th
                          key={i}
                          className={cn(
                            "whitespace-nowrap px-4 py-2.5 text-[12px] font-semibold text-ink-3",
                            h === "Avg" ? "text-right" : "text-left",
                            h === "" && "w-24",
                          )}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr
                      key={s.roll}
                      onClick={() => onStudentClick?.(s)}
                      className="cursor-pointer border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50"
                    >
                      <td className="px-4 py-3 text-[13.5px] font-medium text-ink">
                        {s.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px]">
                        {s.roll}
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-ink-3">
                        {s.email}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[13px] font-medium tabular-nums text-ink">
                        {s.avg}%
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-[12px] font-medium",
                            s.status === "Active"
                              ? "text-success"
                              : "text-warning",
                          )}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveStudent?.(s);
                          }}
                          className="rounded-[var(--radius-control)] px-2.5 py-1 text-[12px] font-medium text-ink-3 transition-colors hover:bg-danger-dim hover:text-danger"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "teachers" && (
        <div className="overflow-hidden rounded-[var(--radius-container)] border border-rule bg-surface shadow-[var(--shadow-card)]">
          {roster.teachers.map((t, i) => (
            <div
              key={t.email}
              className={cn(
                "flex items-center gap-4 px-5 py-4",
                i > 0 && "border-t border-rule",
              )}
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-primary-dim text-[12px] font-semibold text-primary">
                {t.name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium text-ink">
                  {t.name}
                </div>
                <div className="truncate font-mono text-[12px] text-ink-3">
                  {t.email}
                </div>
              </div>
              <div className="hidden shrink-0 gap-1.5 tablet:flex">
                {t.subjects.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-rule-2 bg-surface/60 px-2 py-0.5 text-[12px] font-medium text-ink-2"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="shrink-0 font-mono text-[12px] tabular-nums text-ink-3">
                <b className="font-semibold text-ink">{t.classes}</b> classes
              </div>
              <button
                onClick={() => toast.push(`Editing ${t.name}`, "info")}
                className="shrink-0 rounded-[var(--radius-control)] px-2.5 py-1 text-[12px] font-medium text-ink-2 transition-colors hover:bg-raised hover:text-ink"
              >
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
