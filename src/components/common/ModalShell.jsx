// ── Modal shell with glass surface ──
export const ModalShell = ({ open, onClose, title, children, maxWidth = "480px", footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-100 grid animate-fade-in place-items-center bg-[oklch(0.15_0.06_272_/_0.55)] p-5 backdrop-blur-md" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth }}
        className="glass-strong flex max-h-[calc(100dvh-48px)] w-full animate-qin flex-col overflow-hidden rounded-[var(--radius-modal)] shadow-[var(--shadow-modal)]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-rule px-6 py-5">
          <h2 className="font-display text-[18px] font-semibold tracking-[-0.015em] text-ink">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-ink-3 transition-colors hover:bg-raised hover:text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && <div className="flex shrink-0 justify-end gap-2 border-t border-rule px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
};
