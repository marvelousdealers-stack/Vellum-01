import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

// ═══════════════════════════════════════════════════════════════
// CLASS SWITCHER
//
// Anchored at the top of the sidebar. Follows the Notion/Slack/
// Linear workspace-switcher pattern. Opens a listbox; closes on
// Escape / click-outside.
// ═══════════════════════════════════════════════════════════════
export const ClassSwitcher = ({ classes, activeId, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = classes.find((c) => c.id === activeId) || classes[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative shrink-0 border-b border-sidebar-rule px-3 pb-4 pt-1" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "grid w-full grid-cols-[1fr_16px] items-center gap-x-2 gap-y-0.5 rounded-lg border bg-sidebar-surface px-3 py-2.5 text-left transition-colors",
          open
            ? "border-primary/40 bg-sidebar-hover"
            : "border-sidebar-rule hover:border-rule-2 hover:bg-sidebar-hover"
        )}
      >
        <span className="col-start-1 row-start-1 truncate text-[12px] font-semibold text-sidebar-accent">
          {active?.subject || "Class"}
        </span>
        <span className="col-start-1 row-start-2 truncate text-[13.5px] font-semibold tracking-tight text-sidebar-ink">
          {active?.name || "Select class"}
        </span>
        <span className="col-start-1 row-start-3 truncate font-mono text-[12px] text-sidebar-ink-3">
          {active?.students || 0} students
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "col-start-2 row-span-3 self-center text-sidebar-ink-2 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-3 right-3 top-[calc(100%-6px)] z-50 animate-qin rounded-[10px] border border-rule-2 bg-sidebar-surface p-1.5 shadow-2xl"
        >
          <div className="px-2.5 py-1 text-[12px] font-semibold text-sidebar-ink-3">
            Your classes
          </div>
          {classes.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                role="option"
                aria-selected={isActive}
                onClick={() => { onChange(c.id); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors",
                  isActive ? "bg-primary/10" : "hover:bg-sidebar-hover"
                )}
              >
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-md",
                    isActive ? "bg-sidebar-accent" : "bg-sidebar-hover"
                  )}
                >
                  <span className={cn(
                    "font-mono text-[12px] font-bold",
                    isActive ? "text-sidebar-bg" : "text-sidebar-ink-2"
                  )}>
                    {c.short}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn(
                    "block truncate text-[13px] font-medium",
                    isActive ? "font-semibold text-sidebar-accent" : "text-sidebar-ink"
                  )}>
                    {c.name}
                  </span>
                  <span className="block truncate text-[12px] text-sidebar-ink-3">
                    {c.subject} · {c.students} students
                  </span>
                </span>
                {isActive && <Check size={14} className="shrink-0 text-sidebar-accent" />}
              </button>
            );
          })}
          <div className="mt-1 border-t border-sidebar-rule px-2.5 pt-2">
            <span className="font-mono text-[12px] italic text-sidebar-ink-3">
              Switch affects all screens
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
