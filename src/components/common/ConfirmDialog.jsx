import { AlertTriangle, Info } from "lucide-react";
import { useModalA11y } from "@/hooks/useModalA11y";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

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

  const Ico = tone === "danger" ? AlertTriangle : Info;

  return (
    <div
      className="fixed inset-0 z-100 grid animate-fade-in place-items-center bg-[oklch(0.15_0.06_272_/_0.55)] p-5 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-[440px] animate-qin rounded-[var(--radius-modal)] px-8 pb-6 pt-8 text-center shadow-[var(--shadow-modal)]"
      >
        <div
          className={cn(
            "mx-auto mb-4 grid size-12 animate-confirm-pulse place-items-center rounded-full",
            tone === "danger"
              ? "bg-danger-dim text-danger"
              : "bg-primary-dim text-primary",
          )}
        >
          <Ico size={22} />
        </div>
        <h2 className="mb-2 font-display text-[18px] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h2>
        {message && (
          <p className="mb-6 text-[14px] leading-relaxed text-ink-3">
            {message}
          </p>
        )}
        <div className="flex justify-center gap-2">
          <Button
            onClick={onClose} variant="ghost"
          >
            {cancelLabel}
          </Button>
          <button
            data-autofocus
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
            className={cn(
              "rounded-[var(--radius-control)] px-4 py-2 text-[13px] font-semibold transition-all duration-300",
              tone === "danger"
                ? "bg-danger text-on-danger shadow-[var(--shadow-danger)] hover:opacity-90"
                : "bg-primary text-on-primary shadow-[var(--shadow-primary)] hover:bg-primary-2 hover:shadow-[var(--shadow-glow)]",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
