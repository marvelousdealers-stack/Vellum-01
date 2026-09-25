import React, { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// CLASS SWITCHER
// Anchored at the top of the sidebar. Follows the Notion/Slack/
// Linear workspace-switcher pattern: current selection visible at
// all times, dropdown for switching, no context blindness.
// ═══════════════════════════════════════════════════════════════
export const ClassSwitcher = ({ classes, activeId, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const active = classes.find((c) => c.short === activeId) || classes[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="cs-wrap" ref={ref}>
      <button
        className={"cs-trigger" + (open ? " open" : "")}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="cs-subject">
          {active?.subject || "Class"}
        </span>
        <span className="cs-name">
          {active?.name || "Select class"}
          <span className="cs-count">
            {active?.students || 0} students
          </span>
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cs-chevron"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="cs-menu" role="listbox">
          <div className="cs-menu-label">Your classes</div>
          {classes.map((c) => {
            const isActive = c.short === activeId;
            return (
              <button
                key={c.short}
                className={"cs-item" + (isActive ? " active" : "")}
                onClick={() => { onChange(c.short); setOpen(false); }}
                role="option"
                aria-selected={isActive}
              >
                <span className="cs-item-mark">
                  <span className="cs-item-code">{c.short}</span>
                </span>
                <span className="cs-item-body">
                  <span className="cs-item-name">{c.name}</span>
                  <span className="cs-item-meta">
                    {c.subject} · {c.students} students
                  </span>
                </span>
                {isActive && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="cs-check"
                    aria-hidden="true"
                  >
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                )}
              </button>
            );
          })}
          <div className="cs-menu-foot">
            <span className="cs-hint">Switch affects all screens</span>
          </div>
        </div>
      )}
    </div>
  );
};