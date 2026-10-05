import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// STOP TEST OVERLAY
// ═══════════════════════════════════════════════════════════════
export const StopTestOverlay = ({
  visible,
  onForceSubmit,
  reason = "The teacher has stopped this test.",
}) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!visible) return;
    setCountdown(3);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          onForceSubmit?.();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [visible, onForceSubmit]);

  if (!visible) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-500 grid animate-fade-in place-items-center bg-[oklch(0.15_0.06_272_/_0.55)] p-6 backdrop-blur-md"
    >
      <div className="glass-strong w-full max-w-[420px] animate-qin rounded-[var(--radius-modal)] border-t-2 border-t-danger px-7 pb-7 pt-10 text-center shadow-[var(--shadow-modal)]">
        <div className="mx-auto mb-5 grid size-14 animate-confirm-pulse place-items-center rounded-full bg-danger-dim text-danger">
          <AlertTriangle size={26} />
        </div>
        <h2 className="mb-2.5 font-display text-[24px] font-semibold tracking-[-0.02em] text-ink">
          Test stopped
        </h2>
        <p className="mb-2.5 text-[15px] leading-relaxed text-ink-2">
          {reason}
        </p>
        <p className="mb-6 text-[13px] leading-relaxed text-ink-3">
          You can no longer change your answers. Any answers already recorded
          are being saved.
        </p>
        <div className="mb-4 text-[13px] font-medium text-ink-3">
          Submitting in{" "}
          <span className="mx-0.5 font-display text-[22px] font-medium tabular-nums text-danger">
            {countdown}
          </span>
        </div>
        <Button
          onClick={onForceSubmit} className="w-full"
        >
          Submit now
        </Button>
      </div>
    </div>
  );
};
