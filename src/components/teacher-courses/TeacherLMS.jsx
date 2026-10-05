import { useState } from "react";
import { BookOpen, Plus, ExternalLink } from "lucide-react";
import { LessonEditor } from "./LessonEditor";
import { Bento } from "@/components/common";
import { LessonIcon } from "@/components/common/lms/LessonIcon";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// TEACHER LMS
// ═══════════════════════════════════════════════════════════════
export const TeacherLMS = ({ courses, onCoursesChange, onOpenDiscussion }) => {
  const toast = useToast();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  const saveLesson = (lesson) => {
    if (!editingCourse) return;
    onCoursesChange(
      courses.map((c) => {
        if (c.id !== editingCourse.id) return c;
        const exists = c.items.some((l) => l.id === lesson.id);
        const items = exists
          ? c.items.map((l) => (l.id === lesson.id ? lesson : l))
          : [...c.items, lesson];
        return { ...c, items, lessons: items.length };
      }),
    );
  };

  const deleteLesson = (courseId, lessonId) => {
    onCoursesChange(
      courses.map((c) =>
        c.id === courseId
          ? { ...c, items: c.items.filter((l) => l.id !== lessonId) }
          : c,
      ),
    );
    toast.push("Lesson removed", "info");
  };

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Physics · Grade 11A <span className="text-ink-3">/</span> Courses
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Courses <span className="text-ink-3">&amp; lessons</span>
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            Post lesson content alongside your tests. Students work through at
            their own pace and mark each one done.
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

      <div className="flex flex-col gap-3">
        {courses.map((c) => (
          <Bento key={c.id} className="!p-0 overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-rule px-5 py-4">
              <div className="flex items-start gap-3.5">
                <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary-dim text-primary">
                  <BookOpen size={18} />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[16px] font-semibold tracking-[-0.01em] text-ink">
                    {c.title}
                  </div>
                  <div className="mt-1 font-mono text-[12px] text-ink-3">
                    {c.subject} · {c.students} students · {c.items.length}{" "}
                    lessons
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  setEditingCourse(c);
                  setEditingLesson(null);
                  setEditorOpen(true);
                }} variant="outline" size="sm"
              >
                <Plus size={12} /> Add lesson
              </Button>
            </div>

            <div className="flex flex-col divide-y divide-rule">
              {c.items.length === 0 && (
                <div className="py-8 text-center text-[13px] text-ink-3">
                  No lessons yet — add the first one.
                </div>
              )}
              {c.items.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center gap-3.5 px-5 py-3.5"
                >
                  <LessonIcon kind={l.kind} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium text-ink">
                      {l.title}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-2 font-mono text-[12px] text-ink-3">
                      <span>{l.duration}</span>
                      {(l.kind === "video" || l.kind === "file") && l.url && (
                        <>
                          <span className="text-ink-3">·</span>
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            source <ExternalLink size={10} />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 whitespace-nowrap font-mono text-[12px] text-ink-3">
                    {l.done ?? 0} / {c.students} done
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    <button
                      onClick={() => {
                        setEditingCourse(c);
                        setEditingLesson(l);
                        setEditorOpen(true);
                      }}
                      className="rounded-[var(--radius-control)] px-2.5 py-1 text-[12px] font-medium text-ink-2 transition-colors hover:bg-raised hover:text-ink"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteLesson(c.id, l.id)}
                      className="rounded-[var(--radius-control)] px-2.5 py-1 text-[12px] font-medium text-ink-3 transition-colors hover:bg-danger-dim hover:text-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Bento>
        ))}
      </div>

      <Button
        onClick={() =>
          toast.push(
            "Course creation form — out of scope for the prototype",
            "info",
          )
        } className="mt-4"
      >
        <Plus size={14} /> Create new course
      </Button>

      <LessonEditor
        open={editorOpen}
        lesson={editingLesson}
        onClose={() => {
          setEditorOpen(false);
          setEditingLesson(null);
        }}
        onSave={saveLesson}
      />
    </div>
  );
};
