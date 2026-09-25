import React, { useState } from "react";
import { Icon, Conn, SearchIcon } from "../shared/shared";
import { groupLessonsIntoModules, ModuleHeader } from "./widgets";
import { useToast } from "../components/toast";

// ═══════════════════════════════════════════════════════════════
// VIDEO EMBED
// ═══════════════════════════════════════════════════════════════
export const parseVideoUrl = (url) => {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return { provider: "YouTube", embed: `https://www.youtube.com/embed/${yt[1]}` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { provider: "Vimeo", embed: `https://player.vimeo.com/video/${vimeo[1]}` };
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return { provider: "Google Drive", embed: `https://drive.google.com/file/d/${drive[1]}/preview` };
  return { provider: "Direct", embed: url };
};

export const VideoEmbed = ({ url, title }) => {
  const parsed = parseVideoUrl(url);
  const [playing, setPlaying] = useState(false);

  if (!parsed) {
    return (
      <div className="video-frame video-error">
        <Icon name="warn" size={20} />
        <div>
          <strong>Video unavailable</strong>
          <p>No URL was provided for this lesson.</p>
        </div>
      </div>
    );
  }

  if (!playing) {
    return (
      <button className="video-frame video-poster" onClick={() => setPlaying(true)}>
        <div className="video-play-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className="video-poster-meta">
          <div className="video-poster-title">{title}</div>
          <div className="video-poster-source">Hosted on {parsed.provider}</div>
        </div>
      </button>
    );
  }

  return (
    <div className="video-frame video-iframe">
      <iframe
        src={parsed.embed}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// FILE CARD
// ═══════════════════════════════════════════════════════════════
export const FileCard = ({ title, url, kind }) => {
  const ext = (title.match(/\.(\w+)$/)?.[1] || "file").toLowerCase();
  return (
    <a className="file-card" href={url || "#"} target="_blank" rel="noreferrer"
       onClick={(e) => { if (!url) { e.preventDefault(); } }}>
      <span className={"file-card-icon file-tag " + (ext === "pdf" ? "pdf" : ext === "docx" || ext === "doc" ? "txt" : "img")}>
        {ext.slice(0, 4).toUpperCase()}
      </span>
      <span className="file-card-text">
        <span className="file-card-name">{title}</span>
        <span className="file-card-meta">
          {url ? "Click to open in a new tab" : "No file linked yet"}
        </span>
      </span>
      <span className="file-card-cta">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
        </svg>
      </span>
    </a>
  );
};

// ═══════════════════════════════════════════════════════════════
// LESSON ICON
// ═══════════════════════════════════════════════════════════════
export const LessonIcon = ({ kind, size = 28 }) => {
  const glyph = kind === "video" ? "▶" : kind === "file" ? "▤" : "≡";
  return (
    <span className={"lesson-icon " + kind} style={{ width: size, height: size, fontSize: size * 0.5 }}>
      {glyph}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════
// STUDENT LMS — with module grouping
// ═══════════════════════════════════════════════════════════════
export const StudentLMS = ({ courses, lessons, onLessonsChange, onOpenDiscussion }) => {
  const toast = useToast();
  const [activeCourse, setActiveCourse] = useState(courses[0]);
  const [openLesson, setOpenLesson] = useState(null);
  const [openModules, setOpenModules] = useState(new Set(["m-0"]));
  const [filter, setFilter] = useState("all");

  const currentLessons = lessons[activeCourse?.id] || [];
  const doneCount = currentLessons.filter((l) => l.done).length;
  const pct = currentLessons.length ? Math.round((doneCount / currentLessons.length) * 100) : 0;
  const nextLesson = currentLessons.find((l) => !l.done);

  const toggleDone = (id) => {
    const next = currentLessons.map((l) => (l.id === id ? { ...l, done: !l.done } : l));
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
    <div className="main-pad">
      <div className="crumbs">My courses <b>/</b> {activeCourse?.title || "—"}</div>

      <div className="hstack" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
        <div>
          <h1 className="title">{activeCourse?.title}</h1>
          <p className="lede">
            {currentLessons.length} lessons · {activeCourse?.subject} · Work at your own pace and mark each lesson done.
          </p>
        </div>
        <div className="hstack" style={{ gap: 8, flexShrink: 0 }}>
          {onOpenDiscussion && (
            <button className="btn btn-line" onClick={onOpenDiscussion}>Discussion</button>
          )}
        </div>
      </div>

      {courses.length > 1 && (
        <div className="course-switch">
          {courses.map((c) => {
            const cl = lessons[c.id] || [];
            const cp = cl.length ? Math.round((cl.filter(l => l.done).length / cl.length) * 100) : 0;
            return (
              <button key={c.id} className={"course-tab" + (activeCourse?.id === c.id ? " on" : "")}
                      onClick={() => { setActiveCourse(c); setOpenLesson(null); setOpenModules(new Set(["m-0"])); }}>
                <span className="course-tab-title">{c.title}</span>
                <span className="course-tab-progress">{cp}%</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="lms-progress-band">
        <div className="lms-progress-bar">
          <div className="lms-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="lms-progress-meta">
          <span><b>{doneCount}</b> of {currentLessons.length} complete</span>
          {nextLesson && (
            <button className="lms-resume" onClick={() => setOpenLesson(nextLesson.id)}>
              Continue: {nextLesson.title} →
            </button>
          )}
          {!nextLesson && currentLessons.length > 0 && (
            <span className="lms-complete-badge">✓ Course complete</span>
          )}
        </div>
      </div>

      <div className="gr-filter-bar" style={{ marginTop: 20 }}>
        {[
          { k: "all",     label: "All" },
          { k: "todo",    label: "To do" },
          { k: "done",    label: "Done" },
          { k: "video",   label: "Video" },
          { k: "reading", label: "Reading" },
          { k: "files",   label: "Files" },
        ].map((f) => (
          <button key={f.k} className={"gr-filter-chip" + (filter === f.k ? " on" : "")}
                  onClick={() => setFilter(f.k)}>{f.label}</button>
        ))}
      </div>

      <section className="sec" style={{ marginTop: 20 }}>
        <div className="course-modules">
          {groupLessonsIntoModules(filteredLessons).map((mod) => {
            const moduleDone = mod.lessons.filter((l) => l.done).length;
            const moduleProgress = mod.lessons.length
              ? Math.round((moduleDone / mod.lessons.length) * 100)
              : 0;
            const moduleOpen = openModules.has(mod.id);
            return (
              <div key={mod.id} className="course-module">
                <ModuleHeader
                  module={mod}
                  open={moduleOpen}
                  progress={moduleProgress}
                  onToggle={() => toggleModule(mod.id)}
                />
                {moduleOpen && (
                  <div className="module-body">
                    {mod.lessons.map((l) => (
                      <React.Fragment key={l.id}>
                        <div className="rowitem" style={{ gridTemplateColumns: "44px 1fr auto auto" }}
                             onClick={() => setOpenLesson(openLesson === l.id ? null : l.id)}>
                          <LessonIcon kind={l.kind} size={32} />
                          <div className="rowname">{l.title}<small>{l.duration}{l.url ? " · linked" : ""}</small></div>
                          <div className="rowmeta">
                            {l.done ? <span className="pill good">✓ Done</span> : <span className="pill">Not started</span>}
                          </div>
                          <div className="rowgo">{openLesson === l.id ? "↓" : "→"}</div>
                        </div>
                        {openLesson === l.id && (
                          <div className="lesson-body">
                            {l.kind === "video" && <VideoEmbed url={l.url} title={l.title} />}
                            {l.kind === "file" && <FileCard title={l.title} url={l.url} kind={l.kind} />}
                            {l.body && <div className="lesson-text">{l.body}</div>}
                            <div className="lesson-footer">
                              <button className={"btn " + (l.done ? "btn-line" : "btn-solid")}
                                      onClick={() => toggleDone(l.id)}>
                                {l.done ? "Mark as not done" : "Mark as complete"}
                              </button>
                              {l.done && (
                                <button className="btn btn-text" onClick={() => {
                                  const next = currentLessons.find((x) => !x.done && x.id !== l.id);
                                  if (next) setOpenLesson(next.id);
                                  else { toast.push("Course complete 🎉", "success"); setOpenLesson(null); }
                                }}>
                                  Next lesson →
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// LESSON EDITOR (modal)
// ═══════════════════════════════════════════════════════════════
export const LessonEditor = ({ open, onClose, onSave, lesson }) => {
  const toast = useToast();
  const [kind, setKind] = useState(lesson?.kind || "text");
  const [title, setTitle] = useState(lesson?.title || "");
  const [duration, setDuration] = useState(lesson?.duration || "10 min");
  const [body, setBody] = useState(lesson?.body || "");
  const [url, setUrl] = useState(lesson?.url || "");

  React.useEffect(() => {
    if (!open) return;
    setKind(lesson?.kind || "text");
    setTitle(lesson?.title || "");
    setDuration(lesson?.duration || "10 min");
    setBody(lesson?.body || "");
    setUrl(lesson?.url || "");
  }, [open, lesson]);

  if (!open) return null;

  const submit = () => {
    if (!title.trim()) { toast.push("Title is required", "error"); return; }
    if (kind === "video" && !url.trim()) { toast.push("Video URL is required", "error"); return; }
    if (kind === "file" && !url.trim()) { toast.push("File URL is required", "error"); return; }
    if (kind === "text" && !body.trim()) { toast.push("Lesson content is required", "error"); return; }
    onSave({ id: lesson?.id || Date.now(), kind, title, duration, body, url });
    toast.push(lesson ? "Lesson updated" : "Lesson added", "success");
    onClose();
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{lesson ? "Edit lesson" : "New lesson"}</h2>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>

        <div className="modal-body" style={{ maxHeight: "66vh", overflowY: "auto" }}>
          <div className="rule-row">
            <div className="rule-label"><span>Lesson type</span></div>
            <div className="chip-row">
              <button className={"chip" + (kind === "text"  ? " on" : "")} onClick={() => setKind("text")}>Text / notes</button>
              <button className={"chip" + (kind === "video" ? " on" : "")} onClick={() => setKind("video")}>Video</button>
              <button className={"chip" + (kind === "file"  ? " on" : "")} onClick={() => setKind("file")}>Reference file</button>
            </div>
          </div>

          <div className="fld" style={{ marginTop: 16 }}>
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
                   placeholder="e.g. Newton's three laws, worked examples" autoFocus />
          </div>

          <div className="fld">
            <label>Duration / size</label>
            <input value={duration} onChange={(e) => setDuration(e.target.value)}
                   placeholder="e.g. 14 min or 2 pages" />
          </div>

          {kind === "video" && (
            <>
              <div className="fld">
                <label>Video URL</label>
                <input value={url} onChange={(e) => setUrl(e.target.value)}
                       placeholder="https://youtube.com/watch?v=... or a Vimeo / Drive link" />
                <div className="fld-hint">YouTube, Vimeo, and Google Drive links are all recognised.</div>
              </div>
              {url && <VideoEmbed url={url} title={title || "Preview"} />}
            </>
          )}

          {kind === "file" && (
            <>
              <div className="fld">
                <label>File URL</label>
                <input value={url} onChange={(e) => setUrl(e.target.value)}
                       placeholder="https://res.cloudinary.com/.../reference.pdf" />
                <div className="fld-hint">
                  Upload the file to Cloudinary (free tier) and paste the resulting URL. Reference files are served from the URL, so nothing sits on your server.
                </div>
              </div>
              {url && <FileCard title={title || "reference.pdf"} url={url} kind="file" />}
            </>
          )}

          {kind === "text" && (
            <div className="fld">
              <label>Content</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)}
                        rows={6} style={{ minHeight: 140 }}
                        placeholder="Write the lesson notes here." />
            </div>
          )}
        </div>

        <div className="modal-foot">
          <button className="btn btn-text" onClick={onClose}>Cancel</button>
          <button className="btn btn-solid" onClick={submit}>
            {lesson ? "Save changes" : "Add lesson"}
          </button>
        </div>
      </div>
    </div>
  );
};

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
    onCoursesChange(courses.map((c) => {
      if (c.id !== editingCourse.id) return c;
      const exists = c.items.some((l) => l.id === lesson.id);
      const items = exists
        ? c.items.map((l) => (l.id === lesson.id ? lesson : l))
        : [...c.items, lesson];
      return { ...c, items, lessons: items.length };
    }));
  };

  const deleteLesson = (courseId, lessonId) => {
    onCoursesChange(courses.map((c) =>
      c.id === courseId
        ? { ...c, items: c.items.filter((l) => l.id !== lessonId) }
        : c
    ));
    toast.push("Lesson removed", "info");
  };

  return (
    <div className="main-pad">
      <div className="crumbs">Physics · Grade 11A <b>/</b> Courses</div>
      <div className="hstack" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="title">Courses <span className="soft">&amp; lessons</span></h1>
          <p className="lede">
            Post lesson content alongside your tests. Students work through at their own pace and mark each one done.
          </p>
        </div>
        {onOpenDiscussion && (
          <button className="btn btn-line" onClick={onOpenDiscussion}>Discussion</button>
        )}
      </div>

      {courses.map((c) => (
        <div key={c.id} className="course-card">
          <div className="hstack" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="course-card-title">{c.title}</div>
              <div className="course-card-meta">
                {c.subject} · {c.students} students · {c.items.length} lessons
              </div>
            </div>
            <button className="btn btn-line btn-sm"
                    onClick={() => { setEditingCourse(c); setEditingLesson(null); setEditorOpen(true); }}>
              + Add lesson
            </button>
          </div>
          <div className="lesson-list">
            {c.items.length === 0 && (
              <div className="empty" style={{ padding: "24px 0" }}>No lessons yet — add the first one.</div>
            )}
            {c.items.map((l) => (
              <div key={l.id} className="lesson-row">
                <LessonIcon kind={l.kind} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lesson-title">{l.title}</div>
                  <div className="lesson-meta">
                    {l.duration}
                    {l.kind === "video" && l.url && <> · <a href={l.url} target="_blank" rel="noreferrer">source</a></>}
                    {l.kind === "file" && l.url && <> · <a href={l.url} target="_blank" rel="noreferrer">source</a></>}
                  </div>
                </div>
                <div className="lesson-progress">
                  <span>{l.done ?? 0} / {c.students} done</span>
                </div>
                <div className="lesson-actions">
                  <button className="btn btn-text btn-sm"
                          onClick={() => { setEditingCourse(c); setEditingLesson(l); setEditorOpen(true); }}>
                    Edit
                  </button>
                  <button className="btn btn-text btn-sm" onClick={() => deleteLesson(c.id, l.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="btn btn-solid" style={{ marginTop: 16 }}
              onClick={() => toast.push("Course creation form — out of scope for the prototype", "info")}>
        + Create new course
      </button>

      <LessonEditor
        open={editorOpen}
        lesson={editingLesson}
        onClose={() => { setEditorOpen(false); setEditingLesson(null); }}
        onSave={saveLesson}
      />
    </div>
  );
};