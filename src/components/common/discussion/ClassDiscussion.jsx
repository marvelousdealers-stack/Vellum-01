import { useState, useMemo } from "react";
import { Plus, MessageCircle, Sparkles, Check, Pin, Search as SearchIcon } from "lucide-react";
import { Bento } from "@/components/common/Bento";
import { Chip, ChipRow } from "@/components/common/Chips";
import { EmptyState } from "@/components/common/EmptyState";
import { Field, inputClass } from "@/components/common/FormField";
import { MetricCard } from "@/components/common/MetricCard";
import { ModalShell } from "@/components/common/ModalShell";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { createId } from "@/lib/id";
import { Button } from "@/components/ui/button";

const TAG_TONE = {
  Question: "bg-warning-dim text-warning border-warning/25",
  Discussion: "bg-primary-dim text-primary border-primary/25",
  Resource: "bg-success-dim text-success border-success/25",
  Announcement: "bg-danger-dim text-danger border-danger/25",
};

export const ClassDiscussion = ({
  role,
  threads: initialThreads,
  onThreadsChange,
}) => {
  const toast = useToast();
  const [threads, setThreads] = useState(initialThreads);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTag, setNewTag] = useState("Question");

  const userName = role === "teacher" ? "Dr. R. Chen" : "Maya Okafor";
  const isTeacher = role === "teacher";

  const updateThreads = (next) => {
    setThreads(next);
    onThreadsChange?.(next);
  };

  const filtered = useMemo(() => {
    let rows = [...threads];
    if (filter === "unresolved") rows = rows.filter((t) => !t.resolved);
    if (filter === "mine") rows = rows.filter((t) => t.author === userName);
    if (filter === "pinned") rows = rows.filter((t) => t.pinned);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q) ||
          t.author.toLowerCase().includes(q),
      );
    }
    rows.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.lastActivity - a.lastActivity;
    });
    return rows;
  }, [threads, filter, search, userName]);

  const addReply = (threadId) => {
    if (!replyDraft.trim()) return;
    updateThreads(
      threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              replies: [
                ...t.replies,
                {
                  id: createId(),
                  author: userName,
                  role: isTeacher ? "teacher" : "student",
                  body: replyDraft.trim(),
                  time: "Just now",
                },
              ],
              lastActivity: Date.now(),
            }
          : t,
      ),
    );
    setReplyDraft("");
    toast.push("Reply posted", "success");
  };

  const toggleResolved = (threadId) =>
    updateThreads(
      threads.map((t) =>
        t.id === threadId ? { ...t, resolved: !t.resolved } : t,
      ),
    );
  const togglePinned = (threadId) => {
    if (!isTeacher) {
      toast.push("Only teachers can pin threads", "error");
      return;
    }
    updateThreads(
      threads.map((t) => (t.id === threadId ? { ...t, pinned: !t.pinned } : t)),
    );
  };
  const deleteReply = (threadId, replyId) => {
    if (!isTeacher) {
      toast.push("Only teachers can delete replies", "error");
      return;
    }
    updateThreads(
      threads.map((t) =>
        t.id === threadId
          ? { ...t, replies: t.replies.filter((r) => r.id !== replyId) }
          : t,
      ),
    );
    toast.push("Reply removed", "info");
  };

  const createThread = () => {
    if (!newTitle.trim() || !newBody.trim()) {
      toast.push("Title and body are required", "error");
      return;
    }
    updateThreads([
      {
        id: createId(),
        title: newTitle.trim(),
        body: newBody.trim(),
        author: userName,
        role: isTeacher ? "teacher" : "student",
        tag: newTag,
        time: "Just now",
        lastActivity: Date.now(),
        pinned: false,
        resolved: false,
        replies: [],
      },
      ...threads,
    ]);
    setNewOpen(false);
    setNewTitle("");
    setNewBody("");
    setNewTag("Question");
    toast.push("Thread posted", "success");
  };

  const initials = (name) =>
    name
      .split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2);

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Physics · Grade 11A <span className="text-ink-3">/</span> Class
        discussion
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Class <span className="text-ink-3">discussion</span>
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            Ask questions, share resources, discuss the week's topic. Teachers
            moderate. Be kind — everything here is logged.
          </p>
        </div>
        <Button
          onClick={() => setNewOpen(true)}
        >
          <Plus size={14} /> New thread
        </Button>
      </div>

      <div className="bento mb-8">
        <MetricCard
          icon={MessageCircle}
          iconTone="primary"
          label="Active threads"
          value={threads.filter((t) => !t.resolved).length}
          delta="Awaiting replies"
          deltaTone="success"
        />
        <MetricCard
          icon={Sparkles}
          iconTone="neutral"
          label="Replies"
          value={threads.reduce((s, t) => s + t.replies.length, 0)}
          delta="Across all threads"
          deltaTone="success"
        />
        <MetricCard
          icon={Check}
          iconTone="success"
          label="Resolved"
          value={threads.filter((t) => t.resolved).length}
          delta="Closed threads"
          deltaTone="success"
        />
        <MetricCard
          icon={Pin}
          iconTone="warning"
          label="Pinned"
          value={threads.filter((t) => t.pinned).length}
          delta="Teacher-curated"
          deltaTone="success"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex h-10 min-w-[240px] flex-1 items-center gap-2.5 rounded-[var(--radius-control)] border border-rule-2 bg-surface px-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 narrow:max-w-[360px]">
          <SearchIcon size={14} className="shrink-0 text-ink-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search threads…"
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3"
          />
        </label>
        <ChipRow>
          {[
            { k: "all", l: "All" },
            { k: "unresolved", l: "Unresolved" },
            { k: "mine", l: "My posts" },
            { k: "pinned", l: "Pinned" },
          ].map((f) => (
            <Chip
              key={f.k}
              active={filter === f.k}
              onClick={() => setFilter(f.k)}
            >
              {f.l}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 && (
          <EmptyState
            title={
              search.trim() || filter !== "all"
                ? "No threads match"
                : "No discussions yet"
            }
            body={
              search.trim() || filter !== "all"
                ? "Try a different search or clear the filter."
                : "Ask a question, share a resource, or start a discussion with your class."
            }
            action={
              search.trim() || filter !== "all"
                ? "Clear filters"
                : "Start a thread"
            }
            onAction={() => {
              if (search.trim() || filter !== "all") {
                setSearch("");
                setFilter("all");
              } else setNewOpen(true);
            }}
          />
        )}

        {filtered.map((t) => {
          const isOpen = expanded === t.id;
          return (
            <Bento
              key={t.id}
              variant={t.pinned ? "featured" : "default"}
              className={cn(
                "!p-0 overflow-hidden transition-all duration-300",
                t.resolved && "opacity-70",
              )}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : t.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-raised/40"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  {t.pinned && (
                    <Pin size={12} className="shrink-0 text-primary" />
                  )}
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[12px] font-semibold",
                      TAG_TONE[t.tag] || "bg-raised text-ink-3 border-rule-2",
                    )}
                  >
                    {t.tag}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 truncate text-[14.5px] font-semibold text-ink",
                      t.resolved && "line-through decoration-ink-4",
                    )}
                  >
                    {t.title}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="hidden items-center gap-2 narrow:flex">
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full font-mono text-[12px] font-bold",
                        t.role === "teacher"
                          ? "bg-primary-dim text-primary"
                          : "bg-raised text-ink-2",
                      )}
                    >
                      {initials(t.author)}
                    </span>
                    <span className="flex flex-col text-[12px] leading-tight">
                      <b className="font-semibold text-ink">{t.author}</b>
                      <span className="text-ink-3">{t.time}</span>
                    </span>
                  </div>
                  {t.resolved && (
                    <span className="rounded-full bg-success-dim px-2 py-0.5 text-[12px] font-semibold text-success">
                      Resolved
                    </span>
                  )}
                  <span className="rounded-full bg-bg px-2.5 py-0.5 font-mono text-[12px] font-medium text-ink-3">
                    {t.replies.length}{" "}
                    {t.replies.length === 1 ? "reply" : "replies"}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-rule px-5 py-4">
                  <div className="mb-4 max-w-[720px] text-[14px] leading-relaxed text-ink-2">
                    {t.body}
                  </div>

                  {t.replies.length > 0 && (
                    <div className="flex flex-col gap-3 border-t border-rule pt-4">
                      {t.replies.map((r) => (
                        <div key={r.id} className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              "grid size-6 shrink-0 place-items-center rounded-full font-mono text-[9.5px] font-bold",
                              r.role === "teacher"
                                ? "bg-primary-dim text-primary"
                                : "bg-raised text-ink-2",
                            )}
                          >
                            {initials(r.author)}
                          </span>
                          <div
                            className={cn(
                              "min-w-0 flex-1 rounded-[var(--radius-control)] border border-rule bg-bg px-3.5 py-2.5",
                              r.role === "teacher" &&
                                "border-primary/25 bg-primary-soft",
                            )}
                          >
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <b className="text-[12.5px] font-semibold text-ink">
                                {r.author}
                              </b>
                              {r.role === "teacher" && (
                                <span className="rounded-full bg-primary-dim px-1.5 py-0.5 text-[12px] font-semibold text-primary">
                                  Teacher
                                </span>
                              )}
                              <span className="ml-auto font-mono text-[12px] text-ink-3">
                                {r.time}
                              </span>
                            </div>
                            <div className="text-[13.5px] leading-relaxed text-ink-2">
                              {r.body}
                            </div>
                          </div>
                          {isTeacher && (
                            <button
                              onClick={() => deleteReply(t.id, r.id)}
                              className="shrink-0 p-1 text-ink-3 transition-colors hover:text-danger"
                              title="Delete reply"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-2.5 border-t border-rule pt-4">
                    <textarea
                      rows={2}
                      placeholder={
                        isTeacher ? "Reply as teacher…" : "Write a reply…"
                      }
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      className="w-full min-h-[56px] resize-y rounded-[var(--radius-control)] border border-rule-2 bg-bg px-3.5 py-2.5 text-[13.5px] leading-relaxed text-ink outline-none transition-all placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="flex flex-wrap justify-end gap-2">
                      {isTeacher && (
                        <>
                          <Button
                            onClick={() => togglePinned(t.id)} variant="ghost" size="sm"
                          >
                            <Pin size={11} /> {t.pinned ? "Unpin" : "Pin"}
                          </Button>
                          <Button
                            onClick={() => toggleResolved(t.id)} variant="ghost" size="sm"
                          >
                            <Check size={11} />{" "}
                            {t.resolved ? "Unresolve" : "Resolve"}
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => addReply(t.id)}
                        disabled={!replyDraft.trim()} size="sm"
                      >
                        Post reply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Bento>
          );
        })}
      </div>

      <ModalShell
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="Start a new thread"
        maxWidth="720px"
        footer={
          <>
            <Button
              onClick={() => setNewOpen(false)} variant="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={createThread}
            >
              Post thread
            </Button>
          </>
        }
      >
        <div className="mb-4">
          <span className="mb-1.5 block text-[12px] font-medium text-ink-3">
            Category
          </span>
          <ChipRow>
            {[
              "Question",
              "Discussion",
              "Resource",
              ...(isTeacher ? ["Announcement"] : []),
            ].map((c) => (
              <Chip key={c} active={newTag === c} onClick={() => setNewTag(c)}>
                {c}
              </Chip>
            ))}
          </ChipRow>
        </div>
        <Field label="Title">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What do you want to talk about?"
            autoFocus
            className={inputClass}
          />
        </Field>
        <Field label="Body">
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            rows={5}
            placeholder="Explain your question or idea. Be specific."
            className={cn(inputClass, "min-h-[120px] resize-y leading-relaxed")}
          />
        </Field>
        <div className="mt-2 flex items-start gap-2 rounded-[var(--radius-control)] border border-warning/30 bg-warning-dim px-4 py-3 text-[12.5px] leading-relaxed text-warning">
          <Sparkles size={13} className="mt-0.5 shrink-0" />
          <span>
            <b className="font-semibold">Community rules.</b> Keep it on topic,
            respect everyone, no spam. All messages are visible to teachers.
          </span>
        </div>
      </ModalShell>
    </div>
  );
};
