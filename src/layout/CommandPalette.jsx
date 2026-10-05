import { useState, useEffect, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useModalA11y } from "@/hooks/useModalA11y";
import { cn } from "@/lib/cn";

// ═══════════════════════════════════════════════════════════════
// COMMAND PALETTE (⌘K)
// ═══════════════════════════════════════════════════════════════
export const CommandPalette = ({ open, onClose, items, onSelect }) => {
  const ref = useModalA11y(open, onClose);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        (it.hint || "").toLowerCase().includes(q) ||
        (it.keywords || "").toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const chosen = filtered[activeIndex];
        if (chosen) {
          onSelect(chosen);
          onClose();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIndex, onSelect, onClose]);

  if (!open) return null;

  const grouped = filtered.reduce((acc, item) => {
    const section = item.section || "Actions";
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-400 flex animate-fade-in items-start justify-center bg-[oklch(0.15_0.06_272_/_0.55)] p-6 pt-[12vh] backdrop-blur-md"
      onClick={onClose}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="glass-strong flex max-h-[60vh] w-full max-w-[560px] animate-cmd-in flex-col overflow-hidden rounded-[var(--radius-modal)] shadow-[var(--shadow-modal)]"
      >
        <div className="flex items-center gap-3 border-b border-rule px-5 py-4 text-ink-3">
          <SearchIcon size={16} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions…"
            className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
          />
          <kbd className="rounded border border-rule-2 bg-raised px-1.5 py-0.5 font-mono text-[12px] font-semibold text-ink-2">
            ESC
          </kbd>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-[13.5px] text-ink-3">
              No results for "{query}"
            </div>
          )}
          {Object.keys(grouped).map((section) => (
            <div key={section} className="py-1">
              <div className="px-5 pb-1 pt-2 text-[12px] font-semibold text-ink-3">
                {section}
              </div>
              {grouped[section].map((item) => {
                runningIndex += 1;
                const idx = runningIndex;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-5 py-2.5 text-left text-[14px] transition-colors",
                      isActive
                        ? "border-l-2 border-primary bg-raised/70 pl-[18px] text-ink"
                        : "text-ink-2 hover:bg-raised/50 hover:text-ink",
                    )}
                  >
                    {item.icon && (
                      <span
                        className={cn(
                          "grid size-5 place-items-center rounded-md",
                          isActive
                            ? "bg-primary-dim text-primary"
                            : "bg-raised text-ink-3",
                        )}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.hint && (
                      <span className="font-mono text-[12px] text-ink-3">
                        {item.hint}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex gap-4 border-t border-rule px-5 py-2.5 font-mono text-[12px] text-ink-3">
          <span>
            <kbd className="rounded border border-rule-2 bg-raised px-1 py-0.5 text-[12px]">
              ↑
            </kbd>
            <kbd className="ml-0.5 rounded border border-rule-2 bg-raised px-1 py-0.5 text-[12px]">
              ↓
            </kbd>{" "}
            navigate
          </span>
          <span>
            <kbd className="rounded border border-rule-2 bg-raised px-1 py-0.5 text-[12px]">
              ↵
            </kbd>{" "}
            select
          </span>
          <span>
            <kbd className="rounded border border-rule-2 bg-raised px-1 py-0.5 text-[12px]">
              ESC
            </kbd>{" "}
            close
          </span>
        </div>
      </div>
    </div>
  );
};
