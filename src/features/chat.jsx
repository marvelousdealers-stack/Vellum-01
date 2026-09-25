import React, { useState, useMemo } from "react";
import { usePersistentState } from "../hooks/use-persistent-state";
import { EmptyState } from "../components/ui-kit";
import { SearchIcon } from "../shared/shared";
import { useToast } from "../components/toast";

// ═══════════════════════════════════════════════════════════════
// DISCUSSION BOARD
// Async discussion with teacher moderation, per the research
// recommendation that forums suit large groups better than chat.
// ═══════════════════════════════════════════════════════════════
export const ClassDiscussion = ({ role, threads: initialThreads, onThreadsChange }) => {
  const toast = useToast();
  const [threads, setThreads] = useState(initialThreads);
    const [search, setSearch] = usePersistentState("vellum.chat.search", "");
  const [filter, setFilter] = usePersistentState("vellum.chat.filter", "all");
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
    if (filter === "mine")       rows = rows.filter((t) => t.author === userName);
    if (filter === "pinned")     rows = rows.filter((t) => t.pinned);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q)
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
    updateThreads(threads.map((t) => t.id === threadId ? {
      ...t,
      replies: [...t.replies, {
        id: Date.now(),
        author: userName,
        role: isTeacher ? "teacher" : "student",
        body: replyDraft.trim(),
        time: "Just now",
      }],
      lastActivity: Date.now(),
    } : t));
    setReplyDraft("");
    toast.push("Reply posted", "success");
  };

  const toggleResolved = (threadId) => {
    updateThreads(threads.map((t) => t.id === threadId ? { ...t, resolved: !t.resolved } : t));
  };

  const togglePinned = (threadId) => {
    if (!isTeacher) { toast.push("Only teachers can pin threads", "error"); return; }
    updateThreads(threads.map((t) => t.id === threadId ? { ...t, pinned: !t.pinned } : t));
  };

  const deleteReply = (threadId, replyId) => {
    if (!isTeacher) { toast.push("Only teachers can delete replies", "error"); return; }
    updateThreads(threads.map((t) => t.id === threadId ? {
      ...t,
      replies: t.replies.filter((r) => r.id !== replyId),
    } : t));
    toast.push("Reply removed", "info");
  };

  const createThread = () => {
    if (!newTitle.trim() || !newBody.trim()) {
      toast.push("Title and body are required", "error");
      return;
    }
    const thread = {
      id: Date.now(),
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
    };
    updateThreads([thread, ...threads]);
    setNewOpen(false);
    setNewTitle(""); setNewBody(""); setNewTag("Question");
    toast.push("Thread posted", "success");
  };

  const tagColor = (t) =>
    t === "Announcement" ? "accent" : t === "Question" ? "warn" : t === "Resource" ? "good" : "";

  return (
    <div className="main-pad">
      <div className="crumbs">Physics · Grade 11A <b>/</b> Class discussion</div>
      <div className="hstack" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="title">Class <span className="soft">discussion</span></h1>
          <p className="lede">
            Ask questions, share resources, discuss the week's topic. Teachers moderate.
            Be kind — everything here is logged.
          </p>
        </div>
        <button className="btn btn-solid" onClick={() => setNewOpen(true)}>+ New thread</button>
      </div>

      <div className="kpis">
        <div className="kpi"><div className="kpi-label">Active threads</div><div className="kpi-num">{threads.filter(t => !t.resolved).length}</div></div>
        <div className="kpi"><div className="kpi-label">Replies</div><div className="kpi-num">{threads.reduce((s, t) => s + t.replies.length, 0)}</div></div>
        <div className="kpi"><div className="kpi-label">Resolved</div><div className="kpi-num">{threads.filter(t => t.resolved).length}</div></div>
        <div className="kpi"><div className="kpi-label">Pinned</div><div className="kpi-num">{threads.filter(t => t.pinned).length}</div></div>
      </div>

      <div className="gr-filter-bar">
        <label className="gr-search">
          <SearchIcon />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search threads…" />
        </label>
        {[
          { k: "all",        l: "All" },
          { k: "unresolved", l: "Unresolved" },
          { k: "mine",       l: "My posts" },
          { k: "pinned",     l: "Pinned" },
        ].map((f) => (
          <button key={f.k} className={"gr-filter-chip" + (filter === f.k ? " on" : "")}
                  onClick={() => setFilter(f.k)}>{f.l}</button>
        ))}
      </div>

      <section className="sec" style={{ marginTop: 20 }}>
        <div className="disc-list">
                   {filtered.length === 0 && (
            <EmptyState
              title={search.trim() || filter !== "all" ? "No threads match" : "No discussions yet"}
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
                } else {
                  setNewOpen(true);
                }
              }}
            />
          )}

          {filtered.map((t) => {
            const isOpen = expanded === t.id;
            return (
              <div key={t.id} className={"disc-thread" + (t.pinned ? " pinned" : "") + (t.resolved ? " resolved" : "")}>
                <div className="disc-head" onClick={() => setExpanded(isOpen ? null : t.id)}>
                  <div className="disc-head-left">
                    {t.pinned && <span className="disc-pin" title="Pinned">📌</span>}
                    <span className={"pill " + tagColor(t.tag)}>{t.tag}</span>
                    <div className="disc-title">{t.title}</div>
                  </div>
                  <div className="disc-head-right">
                    <div className="disc-author">
                      <span className={"disc-avatar " + t.role}>{t.author.split(" ").map(x => x[0]).join("").slice(0, 2)}</span>
                      <span className="disc-author-meta">
                        <b>{t.author}</b>
                        <span>{t.time}</span>
                      </span>
                    </div>
                    {t.resolved && <span className="pill good">Resolved</span>}
                    <span className="disc-replies-count">{t.replies.length} {t.replies.length === 1 ? "reply" : "replies"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="disc-body">
                    <div className="disc-op">{t.body}</div>

                    {t.replies.length > 0 && (
                      <div className="disc-replies">
                        {t.replies.map((r) => (
                          <div key={r.id} className={"disc-reply" + (r.role === "teacher" ? " teacher" : "")}>
                            <span className={"disc-avatar sm " + r.role}>
                              {r.author.split(" ").map(x => x[0]).join("").slice(0, 2)}
                            </span>
                            <div className="disc-reply-text">
                              <div className="disc-reply-head">
                                <b>{r.author}</b>
                                {r.role === "teacher" && <span className="pill accent" style={{ fontSize: 10 }}>Teacher</span>}
                                <span className="disc-reply-time">{r.time}</span>
                              </div>
                              <div className="disc-reply-body">{r.body}</div>
                            </div>
                            {isTeacher && (
                              <button className="disc-delete" onClick={(e) => { e.stopPropagation(); deleteReply(t.id, r.id); }}
                                      title="Delete reply">×</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="disc-reply-box">
                      <textarea className="disc-reply-input" rows={2}
                                placeholder={isTeacher ? "Reply as teacher…" : "Write a reply…"}
                                value={isOpen ? replyDraft : ""}
                                onChange={(e) => setReplyDraft(e.target.value)} />
                      <div className="disc-reply-actions">
                        {isTeacher && (
                          <>
                            <button className="btn btn-text btn-sm" onClick={() => togglePinned(t.id)}>
                              {t.pinned ? "Unpin" : "Pin"}
                            </button>
                            <button className="btn btn-text btn-sm" onClick={() => toggleResolved(t.id)}>
                              {t.resolved ? "Mark unresolved" : "Mark resolved"}
                            </button>
                          </>
                        )}
                        <button className="btn btn-solid btn-sm" onClick={() => addReply(t.id)} disabled={!replyDraft.trim()}>
                          Post reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {newOpen && (
        <div className="modal-bg" onClick={() => setNewOpen(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Start a new thread</h2>
              <button className="modal-x" onClick={() => setNewOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="rule-row">
                <div className="rule-label"><span>Category</span></div>
                <div className="chip-row">
                  {["Question", "Discussion", "Resource", ...(isTeacher ? ["Announcement"] : [])].map((c) => (
                    <button key={c} className={"chip" + (newTag === c ? " on" : "")} onClick={() => setNewTag(c)}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="fld" style={{ marginTop: 16 }}>
                <label>Title</label>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                       placeholder="What do you want to talk about?" autoFocus />
              </div>
              <div className="fld">
                <label>Body</label>
                <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} rows={5}
                          placeholder="Explain your question or idea. Be specific." />
              </div>
              <div className="disc-rules">
                <b>Community rules.</b> Keep it on topic, respect everyone, no spam. All messages are visible to teachers.
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-text" onClick={() => setNewOpen(false)}>Cancel</button>
              <button className="btn btn-solid" onClick={createThread}>Post thread</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};