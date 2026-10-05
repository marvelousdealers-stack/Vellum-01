import { createContext, useState, useCallback, useContext } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

const ToastCtx = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info", opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    const duration = opts.duration ?? (type === "error" ? 6000 : 4000);
    setToasts((t) => [...t, { id, message, type, action: opts.action }]);
    if (duration > 0)
      setTimeout(
        () => setToasts((t) => t.filter((x) => x.id !== id)),
        duration,
      );
    return id;
  }, []);

  const dismiss = useCallback(
    (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );

  return (
    <ToastCtx.Provider value={{ push, dismiss, toasts }}>
      {children}
      <Viewport toasts={toasts} onDismiss={dismiss} />
    </ToastCtx.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) return { push: () => {}, dismiss: () => {}, toasts: [] };
  return ctx;
};

const ICONS = { success: CheckCircle2, error: AlertTriangle, info: Info };

const TYPE_BORDER = {
  success: "border-l-success",
  error: "border-l-danger",
  info: "border-l-primary",
};

const ICON_TONE = {
  success: "text-success",
  error: "text-danger",
  info: "text-primary",
};

const Viewport = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="pointer-events-none fixed right-4 bottom-4 z-200 flex max-w-[380px] flex-col gap-2.5 tablet:right-6 tablet:bottom-6"
    >
      {toasts.map((t) => {
        const Ico = ICONS[t.type] || Info;
        return (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={cn(
              "glass-strong pointer-events-auto flex animate-toast-in items-center gap-3 rounded-[var(--radius-container)] border-l-2 px-3.5 py-3 text-[13px] leading-tight text-ink shadow-[var(--shadow-modal)]",
              TYPE_BORDER[t.type],
            )}
          >
            <Ico size={15} className={cn("shrink-0", ICON_TONE[t.type])} />
            <span className="flex-1">{t.message}</span>
            {t.action && (
              <button
                onClick={() => {
                  t.action.onClick();
                  onDismiss(t.id);
                }}
                className="rounded-[var(--radius-control)] px-1.5 py-0.5 text-[12px] font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                {t.action.label}
              </button>
            )}
            <button
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
              className="shrink-0 text-ink-3 transition-colors hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
