import React, { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext(null);

// ─── Provider ───────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info", opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    const duration = opts.duration ?? (type === "error" ? 6000 : 4000);
    setToasts((t) => [...t, { id, message, type, action: opts.action }]);
    if (duration > 0) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
    }
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastCtx.Provider value={{ push, dismiss, toasts }}>
      {children}
      <Viewport toasts={toasts} onDismiss={dismiss} />
    </ToastCtx.Provider>
  );
};

// ─── Hook ───────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) {
    // Fallback: silently no-op so components don't break if provider missing
    return { push: () => {}, dismiss: () => {}, toasts: [] };
  }
  return ctx;
};

// ─── Icons (inline, tiny) ───────────────────────────
const TickIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l5 5L20 6" />
  </svg>
);
const BangIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l9 17H3L12 3z" />
    <path d="M12 10v4M12 18v.5" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v.5M12 11v5" />
  </svg>
);

const ICONS = { success: TickIcon, error: BangIcon, info: InfoIcon };

// ─── Viewport ───────────────────────────────────────
const Viewport = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;
  return (
    <div className="toast-viewport" role="region" aria-label="Notifications">
      {toasts.map((t) => {
        const Ico = ICONS[t.type] || ICONS.info;
        return (
          <div key={t.id} className={"toast toast-" + t.type} role="status" aria-live="polite">
            <span className="toast-icon"><Ico /></span>
            <span className="toast-msg">{t.message}</span>
            {t.action && (
              <button className="toast-action" onClick={() => { t.action.onClick(); onDismiss(t.id); }}>
                {t.action.label}
              </button>
            )}
            <button className="toast-close" onClick={() => onDismiss(t.id)} aria-label="Dismiss">
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};