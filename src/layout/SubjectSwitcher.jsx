import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

// Sits under the ClassSwitcher. Subjects belong to the active class, so the
// list changes when the class does. Same open/close behaviour as ClassSwitcher.
export const SubjectSwitcher = ({ subjects, activeId, onChange, manageTo }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = subjects.find((s) => s.id === activeId) || subjects[0];

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
    <div className="relative shrink-0 border-b border-sidebar-rule px-3 pb-4" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border bg-sidebar-surface px-3 py-2 text-left transition-colors",
          open ? "border-primary/40 bg-sidebar-hover" : "border-sidebar-rule hover:border-rule-2 hover:bg-sidebar-hover"
        )}
      >
        <span className="text-[12px] font-semibold text-sidebar-ink-3">Subject</span>
        <span className="min-w-0 flex-1 truncate text-right text-[13px] font-semibold text-sidebar-accent">
          {active?.name || "None yet"}
        </span>
        <ChevronDown size={16} className={cn("shrink-0 text-sidebar-ink-2 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-3 right-3 top-[calc(100%-10px)] z-50 animate-qin rounded-[10px] border border-rule-2 bg-sidebar-surface p-1.5 shadow-2xl"
        >
          {subjects.map((s) => {
            const isActive = s.id === active?.id;
            return (
              <button
                key={s.id}
                role="option"
                aria-selected={isActive}
                onClick={() => { onChange(s.id); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors",
                  isActive ? "bg-primary/10 font-semibold text-sidebar-accent" : "text-sidebar-ink hover:bg-sidebar-hover"
                )}
              >
                <span className="min-w-0 flex-1 truncate">{s.name}</span>
                {isActive && <Check size={14} className="shrink-0 text-sidebar-accent" />}
              </button>
            );
          })}
          {subjects.length === 0 && (
            <div className="px-2.5 py-2 text-[12px] text-sidebar-ink-3">No subjects in this class yet</div>
          )}
          <Link
            to={manageTo}
            onClick={() => setOpen(false)}
            className="mt-1 block border-t border-sidebar-rule px-2.5 pt-2 text-[12px] font-semibold text-sidebar-ink-2 hover:text-sidebar-ink"
          >
            Manage subjects
          </Link>
        </div>
      )}
    </div>
  );
};
