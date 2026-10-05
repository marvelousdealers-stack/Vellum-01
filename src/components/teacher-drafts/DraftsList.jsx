import { useState } from "react";
import { Plus, FileEdit, Clock, Radio, CheckCircle2, Search as SearchIcon } from "lucide-react";
import { Chip, ChipRow, EmptyState, MetricCard, StatusDot, Td, Th } from "@/components/common";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// DRAFTS LIST
// ═══════════════════════════════════════════════════════════════
const STATUS_META = {
  draft: { label: "Draft", tone: "muted" },
  scheduled: { label: "Scheduled", tone: "primary" },
  live: { label: "Live now", tone: "danger" },
  completed: { label: "Completed", tone: "success" },
};

const RowBtn = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={cn(
      "inline-flex rounded-[var(--radius-control)] px-2 py-1 text-[12px] font-medium text-ink-3 transition-colors hover:bg-primary-dim hover:text-primary",
      className,
    )}
  >
    {children}
  </button>
);

export const DraftsList = ({
  drafts,
  onOpen,
  onPublish,
  onSchedule,
  onDelete,
  onNew,
  onRegenerate,
  onDuplicate,
}) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAllClasses, setShowAllClasses] = useState(false);
  const { activeClassObj } = useApp();

  const activeClass = activeClassObj;
  const classScoped =
    showAllClasses || !activeClass
      ? drafts
      : drafts.filter((d) => d.cls === activeClass.short);

  const counts = {
    draft: classScoped.filter((d) => d.status === "draft").length,
    scheduled: classScoped.filter((d) => d.status === "scheduled").length,
    live: classScoped.filter((d) => d.status === "live").length,
    completed: classScoped.filter((d) => d.status === "completed").length,
  };

  const filtered = classScoped
    .filter((d) => filter === "all" || d.status === filter)
    .filter(
      (d) =>
        !search.trim() ||
        d.title.toLowerCase().includes(search.trim().toLowerCase()),
    );

  const emptyKind =
    drafts.length === 0
      ? "no-drafts-at-all"
      : filtered.length === 0 && filter !== "all"
        ? "no-match-filter"
        : filtered.length === 0 && search.trim()
          ? "no-match-search"
          : filtered.length === 0 && !showAllClasses && classScoped.length === 0
            ? "no-class-drafts"
            : null;

  const emptyCopy = {
    "no-drafts-at-all": {
      title: "No drafts yet",
      body: "Draft your first test and it'll appear here.",
      action: "New test",
      onAction: onNew,
    },
    "no-match-filter": {
      title: `No ${filter} drafts`,
      body: "Try a different filter or clear it to see all drafts.",
      action: "Show all",
      onAction: () => setFilter("all"),
    },
    "no-match-search": {
      title: "No drafts match your search",
      body: "Try a shorter query or clear the search.",
      action: "Clear search",
      onAction: () => setSearch(""),
    },
    "no-class-drafts": {
      title: `No drafts in ${activeClass?.name || "this class"}`,
      body: `Drafts belong to the class they were created in. Either start a new test for ${activeClass?.name || "this class"}, or view drafts from all classes.`,
      action: "Show all classes",
      onAction: () => setShowAllClasses(true),
    },
  }[emptyKind];

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        {activeClass?.subject || "Physics"} ·{" "}
        {activeClass?.name || "Grade 11 — Section A"}{" "}
        <span className="text-ink-3">/</span> Drafts
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Drafts <span className="text-ink-3">&amp; scheduled</span>
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            Every test you've drafted, plus ones already scheduled or live.
            Publish a draft, schedule it for later, or open it to edit.
          </p>
        </div>
        <Button
          onClick={onNew}
        >
          <Plus size={14} /> New test
        </Button>
      </div>

      {/* KPI bento */}
      <div className="bento mb-10">
        <MetricCard
          icon={FileEdit}
          iconTone="neutral"
          label="Drafts"
          value={counts.draft}
          delta="Awaiting publish"
          deltaTone="success"
        />
        <MetricCard
          icon={Clock}
          iconTone="primary"
          label="Scheduled"
          value={counts.scheduled}
          delta="Opening soon"
          deltaTone="success"
        />
        <MetricCard
          icon={Radio}
          iconTone={counts.live > 0 ? "danger" : "neutral"}
          label="Live now"
          value={counts.live}
          delta={counts.live > 0 ? "Students working" : "None running"}
          deltaTone={counts.live > 0 ? "danger" : "success"}
        />
        <MetricCard
          icon={CheckCircle2}
          iconTone="success"
          label="Completed"
          value={counts.completed}
          delta="Graded & released"
          deltaTone="success"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex h-10 min-w-[240px] flex-1 items-center gap-2.5 rounded-[var(--radius-control)] border border-rule-2 bg-surface px-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 narrow:max-w-[360px]">
          <SearchIcon size={14} className="shrink-0 text-ink-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drafts by title…"
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3"
          />
        </label>
        <ChipRow>
          {["all", "draft", "scheduled", "live", "completed"].map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : STATUS_META[f].label}
            </Chip>
          ))}
          {!showAllClasses &&
            activeClass &&
            drafts.length > classScoped.length && (
              <Chip active={false} onClick={() => setShowAllClasses(true)}>
                All classes ({drafts.length})
              </Chip>
            )}
          {showAllClasses && (
            <Chip active onClick={() => setShowAllClasses(false)}>
              {activeClass?.short} only
            </Chip>
          )}
        </ChipRow>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[var(--radius-container)] border border-rule bg-surface shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-rule-2">
                <Th>Test</Th>
                <Th>Class</Th>
                <Th className="text-right">Questions</Th>
                <Th className="text-right">Marks</Th>
                <Th>Source</Th>
                <Th>Status</Th>
                <Th>Last edited</Th>
                <Th className="w-16"></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && emptyCopy && (
                <tr>
                  <td colSpan={8} className="p-0">
                    <EmptyState
                      compact
                      title={emptyCopy.title}
                      body={emptyCopy.body}
                      action={emptyCopy.action}
                      onAction={emptyCopy.onAction}
                    />
                  </td>
                </tr>
              )}
              {filtered.map((d) => {
                const meta = STATUS_META[d.status];
                return (
                  <tr
                    key={d.id}
                    onClick={() => onOpen(d)}
                    className="cursor-pointer border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50"
                  >
                    <Td className="text-[13.5px] font-medium text-ink">
                      <div className="min-w-0">
                        <div className="truncate">{d.title}</div>
                        {d.regeneratedAt && (
                          <div className="mt-0.5 font-mono text-[12px] text-ink-3">
                            Regenerated {d.regeneratedAt}
                          </div>
                        )}
                      </div>
                    </Td>
                    <Td className="font-mono text-[12px]">{d.cls}</Td>
                    <Td className="text-right font-mono tabular-nums">
                      {d.questions}
                    </Td>
                    <Td className="text-right font-mono tabular-nums">
                      {d.marks}
                    </Td>
                    <Td>
                      {d.questionSet && d.questionSet.length > 0 ? (
                        <span className="rounded-full border border-primary/25 bg-primary-dim px-2 py-0.5 text-[12px] font-medium text-primary">
                          AI-generated
                        </span>
                      ) : (
                        <span className="rounded-full bg-raised px-2 py-0.5 text-[12px] font-medium text-ink-3">
                          Settings only
                        </span>
                      )}
                    </Td>
                    <Td>
                      <StatusDot tone={meta.tone}>{meta.label}</StatusDot>
                    </Td>
                    <Td className="font-mono text-[12px] text-ink-3">
                      {d.lastEdited}
                    </Td>
                    <Td className="text-right">
                      <div className="inline-flex items-center justify-end gap-0.5 whitespace-nowrap">
                        <RowBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(d);
                          }}
                        >
                          Open
                        </RowBtn>
                        {d.status === "draft" && (
                          <>
                            <RowBtn
                              className="hidden tablet:inline-flex"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRegenerate?.(d);
                              }}
                            >
                              Regenerate
                            </RowBtn>
                            <RowBtn
                              className="hidden tablet:inline-flex"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDuplicate?.(d);
                              }}
                            >
                              Duplicate
                            </RowBtn>
                            <RowBtn
                              className="hidden narrow:inline-flex"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPublish(d);
                              }}
                            >
                              Publish
                            </RowBtn>
                          </>
                        )}
                        {d.status === "live" && (
                          <RowBtn
                            className="hidden narrow:inline-flex"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Live view
                          </RowBtn>
                        )}
                        <RowBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(d);
                          }}
                        >
                          Delete
                        </RowBtn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
