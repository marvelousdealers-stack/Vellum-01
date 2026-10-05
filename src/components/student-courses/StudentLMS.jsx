import { useState } from "react";
import { Check } from "lucide-react";
import { Bento, Chip, ChipRow } from "@/components/common";
import { FileCard } from "@/components/common/lms/FileCard";
import { groupLessonsIntoModules } from "@/components/common/lms/groupLessons";
import { LessonIcon } from "@/components/common/lms/LessonIcon";
import { ModuleHeader } from "@/components/common/lms/ModuleHeader";
import { VideoEmbed } from "@/components/common/lms/VideoEmbed";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// STUDENT LMS
// ═══════════════════════════════════════════════════════════════
export const StudentLMS = ({
  courses,
  lessons,
  onLessonsChange,
  onOpenDiscussion,
}) => {
  const toast = useToast();
  const [activeCourse, setActiveCourse] = useState(courses[0]);
  const [openLesson, setOpenLesson] = useState(null);
  const [openModules, setOpenModules] = useState(new Set(["m-0"]));
  const [filter, setFilter] = useState("all");

  const currentLessons = lessons[activeCourse?.id] || [];
  const doneCount = currentLessons.filter((l) => l.done).length;
  const pct = currentLessons.length
    ? Math.round((doneCount / currentLessons.length) * 100)
    : 0;
  const nextLesson = currentLessons.find((l) => !l.done);

  const toggleDone = (id) => {
    const next = currentLessons.map((l) =>
      l.id === id ? { ...l, done: !l.done } : l,
    );
    onLessonsChange(activeCourse.id, next);
  };
  const toggleModule = (modId) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) next.delete(modId);
      else next.add(modId);
      return next;
    });
  };

  const filteredLessons = currentLessons.filter((l) => {
    if (filter === "all") return true;
    if (filter === "done") return l.done;
    if (filter === "todo") return !l.done;
    if (filter === "video") return l.kind === "video";
    if (filter === "reading") return l.kind === "text";
    if (filter === "files") return l.kind === "file";
    return true;
  });

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        My courses <span className="text-ink-3">/</span>{" "}
        {activeCourse?.title || "—"}
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            {activeCourse?.title}
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            {currentLessons.length} lessons · {activeCourse?.subject} · Work at
            your own pace and mark each lesson done.
          </p>
        </div>
        {onOpenDiscussion && (
          <Button
            onClick={onOpenDiscussion} variant="outline"
          >
            Discussion
          </Button>
        )}
      </div>

      {courses.length > 1 && (
        <div className="-mx-5 mb-4 flex gap-1.5 overflow-x-auto px-5 pb-1 tablet:-mx-10 tablet:px-10">
          {courses.map((c) => {
            const cl = lessons[c.id] || [];
            const cp = cl.length
              ? Math.round((cl.filter((l) => l.done).length / cl.length) * 100)
              : 0;
            const isActive = activeCourse?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCourse(c);
                  setOpenLesson(null);
                  setOpenModules(new Set(["m-0"]));
                }}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary-soft text-primary shadow-[var(--shadow-primary)]"
                    : "border-rule-2 text-ink-2 hover:border-rule-3 hover:bg-raised hover:text-ink",
                )}
              >
                <span className="whitespace-nowrap">{c.title}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 font-mono text-[12px] font-semibold tabular-nums",
                    isActive
                      ? "bg-primary text-on-primary"
                      : "bg-raised text-ink-2",
                  )}
                >
                  {cp}%
                </span>
              </button>
            );
          })}
        </div>
      )}

      <Bento variant="featured" className="mb-6 flex-row items-center gap-5">
        <div className="flex-1">
          <div className="mb-2 text-[12px] font-semibold text-ink-3">
            Course progress
          </div>
          <div className="flex items-baseline gap-2 font-display text-[28px] font-medium leading-none tracking-[-0.03em] tabular-nums text-ink">
            {doneCount}{" "}
            <span className="text-[16px] font-normal text-ink-3">
              of {currentLessons.length}
            </span>
          </div>
        </div>
        <div className="hidden h-16 w-16 shrink-0 narrow:block">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="var(--color-rule-2)"
              strokeWidth="2"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${pct * 0.9738} 100`}
              className="transition-all duration-700"
            />
          </svg>
        </div>
        <div className="w-full narrow:w-auto">
          <div className="h-1.5 overflow-hidden rounded-full bg-rule">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-2 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {nextLesson ? (
          <Button
            onClick={() => setOpenLesson(nextLesson.id)} size="sm"
          >
            Continue →
          </Button>
        ) : currentLessons.length > 0 ? (
          <span className="shrink-0 rounded-full bg-success-dim px-3 py-1 text-[12.5px] font-semibold text-success">
            ✓ Complete
          </span>
        ) : null}
      </Bento>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <ChipRow>
          {[
            { k: "all", label: "All" },
            { k: "todo", label: "To do" },
            { k: "done", label: "Done" },
            { k: "video", label: "Video" },
            { k: "reading", label: "Reading" },
            { k: "files", label: "Files" },
          ].map((f) => (
            <Chip
              key={f.k}
              active={filter === f.k}
              onClick={() => setFilter(f.k)}
            >
              {f.label}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <Bento variant="quiet" className="!p-0 overflow-hidden">
        {groupLessonsIntoModules(filteredLessons).map((mod) => {
          const moduleDone = mod.lessons.filter((l) => l.done).length;
          const moduleProgress = mod.lessons.length
            ? Math.round((moduleDone / mod.lessons.length) * 100)
            : 0;
          const moduleOpen = openModules.has(mod.id);
          return (
            <div key={mod.id} className="border-t border-rule first:border-t-0">
              <ModuleHeader
                module={mod}
                open={moduleOpen}
                progress={moduleProgress}
                onToggle={() => toggleModule(mod.id)}
              />
              {moduleOpen && (
                <div className="border-t border-rule">
                  {mod.lessons.map((l, idx) => (
                    <div
                      key={l.id}
                      className={cn(idx > 0 && "border-t border-rule")}
                    >
                      <button
                        onClick={() =>
                          setOpenLesson(openLesson === l.id ? null : l.id)
                        }
                        className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-raised/50"
                      >
                        <LessonIcon kind={l.kind} size={32} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[14px] font-medium text-ink">
                            {l.title}
                          </div>
                          <div className="mt-0.5 font-mono text-[12px] text-ink-3">
                            {l.duration}
                            {l.url ? " · linked" : ""}
                          </div>
                        </div>
                        <div className="shrink-0">
                          {l.done ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success-dim px-2 py-0.5 text-[12px] font-medium text-success">
                              <Check size={10} /> Done
                            </span>
                          ) : (
                            <span className="rounded-full bg-raised px-2 py-0.5 text-[12px] font-medium text-ink-3">
                              Not started
                            </span>
                          )}
                        </div>
                        <span className="shrink-0 text-ink-3 transition-all group-hover:text-primary">
                          {openLesson === l.id ? "↓" : "→"}
                        </span>
                      </button>

                      {openLesson === l.id && (
                        <div className="border-t border-rule bg-bg/40 px-5 py-5">
                          {l.kind === "video" && (
                            <VideoEmbed url={l.url} title={l.title} />
                          )}
                          {l.kind === "file" && (
                            <FileCard title={l.title} url={l.url} />
                          )}
                          {l.body && (
                            <p className="mb-5 max-w-[660px] text-[14.5px] leading-relaxed text-ink-2">
                              {l.body}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2.5">
                            <button
                              onClick={() => toggleDone(l.id)}
                              className={cn(
                                "rounded-[var(--radius-control)] px-4 py-2 text-[13px] font-semibold transition-all duration-200",
                                l.done
                                  ? "border border-rule-2 text-ink hover:border-rule-3 hover:bg-raised"
                                  : "bg-primary text-on-primary shadow-[var(--shadow-primary)] hover:bg-primary-2 hover:shadow-[var(--shadow-glow)]",
                              )}
                            >
                              {l.done ? "Mark as not done" : "Mark as complete"}
                            </button>
                            {l.done && (
                              <Button
                                onClick={() => {
                                  const next = currentLessons.find(
                                    (x) => !x.done && x.id !== l.id,
                                  );
                                  if (next) setOpenLesson(next.id);
                                  else {
                                    toast.push("Course complete 🎉", "success");
                                    setOpenLesson(null);
                                  }
                                }} variant="ghost"
                              >
                                Next lesson →
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </Bento>
    </div>
  );
};
