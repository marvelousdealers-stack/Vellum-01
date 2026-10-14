import { useState, useMemo } from "react";
import { ChevronLeft, Users, GraduationCap, Layers, Search as SearchIcon } from "lucide-react";
import { ClassSettingsModal } from "./ClassSettingsModal";
import { Chip, ChipRow, EmptyState, MetricCard } from "@/components/common";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// CLASS DETAIL
// ═══════════════════════════════════════════════════════════════
export const ClassDetail = ({
  cls,
  roster,
  teachers,
  onBack,
  onAddStudent,
  onRemoveStudent,
  onUpdateClass,
  onDeleteClass,
}) => {
  const [tab, setTab] = useState("students");
  const [search, setSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return roster.students;
    const q = search.trim().toLowerCase();
    return roster.students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || (s.roll ?? "").toLowerCase().includes(q),
    );
  }, [roster.students, search]);

  const stats = useMemo(() => {
    const active = roster.students.filter((s) => s.active).length;
    const scored = roster.students.filter((s) => s.average != null);
    const avg = scored.length
      ? Math.round(scored.reduce((sum, s) => sum + s.average, 0) / scored.length)
      : null;
    return { active, avg, total: roster.students.length };
  }, [roster.students]);

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <Button
        onClick={onBack} variant="ghost" size="sm" className="mb-3"
      >
        <ChevronLeft size={13} /> Back to classes
      </Button>

      <div className="mb-5 flex items-center gap-2 text-[13px] font-medium text-ink-3">
        Administration <span className="text-ink-3">/</span> Classes{" "}
        <span className="text-ink-3">/</span> {cls.name}
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[28px] font-semibold tablet:text-[34px] leading-[1.1] tracking-[-0.02em] text-ink">
            {cls.name}
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            {roster.teachers.length} teacher
            {roster.teachers.length !== 1 ? "s" : ""} assigned · {stats.total}{" "}
            student{stats.total !== 1 ? "s" : ""} enrolled · {cls.subjectCount}{" "}
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
          tinted={false}
          label="Students"
          value={stats.total}
          delta={`${stats.active} active`}
          deltaTone="success"
        />
        <MetricCard
          icon={GraduationCap}
          iconTone="primary"
          tinted={false}
          label="Teachers"
          value={roster.teachers.length}
          delta="Assigned"
          deltaTone="neutral"
        />
        <MetricCard
          icon={Layers}
          iconTone="success"
          label="Class average"
          value={stats.avg ?? "—"}
          unit={stats.avg == null ? undefined : "%"}
          delta="All subjects"
          deltaTone="success"
        />
        <MetricCard
          icon={Layers}
          iconTone="primary"
          tinted={false}
          label="Subjects"
          value={cls.subjectCount}
          delta="This term"
          deltaTone="neutral"
        />
      </div>

      <div className="sticky top-16 z-10 -mx-5 mb-4 flex flex-wrap items-center gap-2 border-b border-rule bg-bg/95 px-5 py-3 backdrop-blur-xl tablet:-mx-10 tablet:px-10">
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
            <label className="relative ml-0 flex h-10 min-w-[200px] flex-1 narrow:ml-2 pointer-coarse:h-11 items-center gap-2 rounded-[var(--radius-control)] border border-rule-2 bg-surface px-2.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 narrow:max-w-[320px]">
              <SearchIcon size={14} className="shrink-0 text-ink-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or roll no…"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3 pointer-coarse:text-[16px]"
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
              title={roster.students.length ? "No students match" : "No students yet"}
              body={roster.students.length ? "Try a different search term." : "Add the first student to this class."}
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
                            "whitespace-nowrap px-3 py-2.5 text-[12px] font-semibold text-ink-3 narrow:px-4",
                            h === "Avg" ? "text-right" : "text-left",
                            h === "" && "w-24",
                            // Phones keep Name · Avg · Remove; the rest moves under the name.
                            ["Roll no", "Email", "Status"].includes(h) && "max-narrow:hidden",
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
                      key={s.id}
                      className="border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50"
                    >
                      <td className="px-3 py-3 text-[13.5px] font-medium text-ink narrow:px-4 max-narrow:min-w-[8.5rem]">
                        <span className="whitespace-nowrap">{s.name}</span>
                        <div className="mt-0.5 text-[12px] font-normal text-ink-3 narrow:hidden">
                          {s.roll} · {s.active ? "Active" : "Inactive"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[12px] max-narrow:hidden">
                        {s.roll}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-ink-3 max-narrow:hidden">
                        {s.email}
                      </td>
                      <td className="px-3 py-3 text-right text-[13px] font-medium tabular-nums text-ink narrow:px-4">
                        {s.average == null ? "—" : `${s.average}%`}
                      </td>
                      <td className="px-4 py-3 max-narrow:hidden">
                        <span
                          className={cn(
                            "text-[12px] font-medium",
                            s.active
                              ? "text-success"
                              : "text-warning",
                          )}
                        >
                          {s.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-right narrow:px-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveStudent?.(s);
                          }}
                          className="rounded-[var(--radius-control)] px-3 py-2 text-[12px] font-medium text-ink-3 transition-colors hover:bg-danger-dim hover:text-danger"
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
              key={t.id}
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
              <div className="shrink-0 font-mono text-[12px] tabular-nums text-ink-3">
                <b className="font-semibold text-ink">{t.classCount}</b> {t.classCount === 1 ? "class" : "classes"}
              </div>
            </div>
          ))}
        </div>
      )}

      <ClassSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        cls={cls}
        availableTeachers={teachers}
        currentTeacherIds={roster.teachers.map((t) => t.id)}
        onSave={(data) => {
          return onUpdateClass?.(data);
        }}
        onDelete={() => {
          setSettingsOpen(false);
          onDeleteClass?.();
        }}
      />
    </div>
  );
};
