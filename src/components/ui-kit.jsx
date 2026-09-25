import React, { useState, useEffect, useRef, useMemo } from "react";
import { SearchIcon } from "../shared/shared";

// ═══════════════════════════════════════════════════════════════
// MODAL ACCESSIBILITY HOOK
// Handles Escape-to-close, focus trap, and focus restore.
// ═══════════════════════════════════════════════════════════════
export const useModalA11y = (open, onClose) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previousActive = document.activeElement;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key === "Tab" && ref.current) {
        const focusable = ref.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => {
      const first = ref.current?.querySelector(
        'input, textarea, [data-autofocus], button:not(.modal-x)'
      );
      first?.focus?.();
    }, 40);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      clearTimeout(t);
      if (previousActive instanceof HTMLElement && previousActive.focus) {
        previousActive.focus();
      }
    };
  }, [open, onClose]);

  return ref;
};

// ═══════════════════════════════════════════════════════════════
// CONFIRM DIALOG
// ═══════════════════════════════════════════════════════════════
export const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onClose,
}) => {
  const ref = useModalA11y(open, onClose);
  if (!open) return null;

  const Icon = tone === "danger"
    ? () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l9 17H3L12 3z" />
          <path d="M12 10v4M12 17v.5" />
        </svg>
      )
    : () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v.5M12 11v5" />
        </svg>
      );

  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        ref={ref}
        className="modal modal-confirm"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <div className={"confirm-icon " + tone}>
          <Icon />
        </div>
        <h2 className="confirm-title">{title}</h2>
        {message && <p className="confirm-message">{message}</p>}
        <div className="confirm-actions">
          <button className="btn btn-text" onClick={onClose}>{cancelLabel}</button>
          <button
            className={"btn " + (tone === "danger" ? "btn-danger" : "btn-solid")}
            onClick={() => { onConfirm?.(); onClose?.(); }}
            data-autofocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════════
export const Skeleton = ({ width = "100%", height = 16, radius = 6, style }) => (
  <span
    className="skeleton"
    style={{ width, height, borderRadius: radius, ...style }}
    aria-hidden="true"
  />
);

export const SkeletonText = ({ lines = 3, widths }) => (
  <div className="skeleton-text" aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={12}
        width={widths?.[i] || (i === lines - 1 ? "62%" : "100%")}
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <Skeleton height={18} width="42%" />
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonRow = () => (
  <div className="skeleton-row" aria-hidden="true">
    <Skeleton height={36} width={36} radius={8} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
      <Skeleton height={13} width="46%" />
      <Skeleton height={10} width="72%" />
    </div>
    <Skeleton height={20} width={72} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════
export const EmptyState = ({
  icon,
  title,
  body,
  action,
  onAction,
  secondary,
  onSecondary,
  compact = false,
}) => (
  <div className={"empty-state" + (compact ? " compact" : "")}>
    {icon && <div className="empty-state-icon">{icon}</div>}
    {title && <div className="empty-state-title">{title}</div>}
    {body && <p className="empty-state-body">{body}</p>}
    {(action || secondary) && (
      <div className="empty-state-actions">
        {action && (
          <button className="btn btn-solid" onClick={onAction}>{action}</button>
        )}
        {secondary && (
          <button className="btn btn-text" onClick={onSecondary}>{secondary}</button>
        )}
      </div>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// LOADING BUTTON
// Wraps a normal button and shows a spinner while loading.
// ═══════════════════════════════════════════════════════════════
export const LoadingButton = ({
  loading,
  children,
  variant = "solid",
  className = "",
  ...props
}) => (
  <button
    className={"btn btn-" + variant + (loading ? " is-loading" : "") + " " + className}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && <span className="btn-spinner" aria-hidden="true" />}
    <span className="btn-label">{children}</span>
  </button>
);

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
        (it.keywords || "").toLowerCase().includes(q)
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

  // Group by section
  const grouped = filtered.reduce((acc, item) => {
    const section = item.section || "Actions";
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});
  const sections = Object.keys(grouped);

  let runningIndex = -1;

  return (
    <div className="cmd-bg" onClick={onClose}>
      <div
        ref={ref}
        className="cmd-palette"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="cmd-input-row">
          <SearchIcon size={16} />
          <input
            className="cmd-input"
            placeholder="Search pages, actions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="cmd-kbd">ESC</kbd>
        </div>

        <div className="cmd-results">
          {filtered.length === 0 && (
            <div className="cmd-empty">No results for "{query}"</div>
          )}
          {sections.map((section) => (
            <div key={section} className="cmd-section">
              <div className="cmd-section-title">{section}</div>
              {grouped[section].map((item) => {
                runningIndex += 1;
                const idx = runningIndex;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    className={"cmd-item" + (isActive ? " active" : "")}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => { onSelect(item); onClose(); }}
                  >
                    {item.icon && <span className="cmd-item-icon">{item.icon}</span>}
                    <span className="cmd-item-label">{item.label}</span>
                    {item.hint && <span className="cmd-item-hint">{item.hint}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="cmd-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
};

// ─── formerly ui-kit2.jsx ──────────────────────────────────────

// ═══════════════════════════════════════════════════════════════
// KEYBOARD KEY
// Small styling for showing a shortcut like ⌘ K or Ctrl K.
// ═══════════════════════════════════════════════════════════════
export const Kbd = ({ children, size = "md" }) => (
  <kbd className={"kbd kbd-" + size}>{children}</kbd>
);

// ═══════════════════════════════════════════════════════════════
// SEARCH HINT PILL
// Shows next to the search input in the top bar. Clicking it opens
// the command palette. Discoverability for the ⌘K shortcut.
// ═══════════════════════════════════════════════════════════════
export const SearchHint = ({ onClick, compact = false }) => {
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform || "");

  return (
    <button
      type="button"
      className={"search-hint" + (compact ? " compact" : "")}
      onClick={onClick}
      aria-label="Open search"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      {!compact && <span className="search-hint-label">Search…</span>}
      {!compact && (
        <span className="search-hint-keys">
          <Kbd size="sm">{isMac ? "⌘" : "Ctrl"}</Kbd>
          <Kbd size="sm">K</Kbd>
        </span>
      )}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// TIME FORMATTER
// Turns a Date or ms timestamp into a human relative string.
// ═══════════════════════════════════════════════════════════════
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  const then = typeof timestamp === "number" ? timestamp : new Date(timestamp).getTime();
  const diff = Date.now() - then;
  if (diff < 10 * 1000) return "just now";
  if (diff < 60 * 1000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
  if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
  const d = new Date(then);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

// ═══════════════════════════════════════════════════════════════
// VIEW TITLE MAP
// Maps internal view ids to friendly document titles.
// ═══════════════════════════════════════════════════════════════
export const VIEW_TITLES = {
  home: "Overview",
  materials: "Materials",
  clusters: "Recurring questions",
  bank: "Question bank",
  drafts: "Drafts",
  draft: "New test",
  live: "Live test",
  review: "Grade review",
  analytics: "Analytics",
  lms: "Courses",
  chat: "Discussion",
  take: "Take test",
  history: "Test history",
  admin: "Admin overview",
  users: "Accounts",
  classes: "Classes",
};
// ═══════════════════════════════════════════════════════════════
// BRAND MARK
// A drawn "V" with asymmetric stroke weight inside a rounded
// square. The thick left stroke and thinner right stroke give it
// the feel of a serif letterform rather than a UI glyph.
// ═══════════════════════════════════════════════════════════════
export const BrandMark = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ flexShrink: 0, display: "block" }}
  >
    {/* Rounded square in the current brand color */}
    <rect width="32" height="32" rx="8" fill="currentColor" />

    {/* The V — left stroke thicker than the right */}
    <path
      d="M10 9.2 L16 22.8"
      stroke="var(--mark-fg)"
      strokeWidth="3.6"
      strokeLinecap="round"
    />
    <path
      d="M16 22.8 L22 9.2"
      stroke="var(--mark-fg)"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);