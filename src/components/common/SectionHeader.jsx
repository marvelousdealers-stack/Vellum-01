// ═══════════════════════════════════════════════════════════════
// SHARED PRIMITIVES
// The building blocks the new design language is made of. Every
// feature page composes these — no feature defines its own card,
// badge, or table shell.
// ═══════════════════════════════════════════════════════════════

// ── Semantic section header ──
// Sentence-case semibold title + optional right-side action.
// Not wrapped in a card; whitespace separates sections.
export const SectionHeader = ({ label, meta, action, onAction }) => (
  <div className="mb-3 flex min-h-8 items-center justify-between gap-4">
    <div className="text-[14px] font-semibold text-ink">
      {label}
    </div>
    {meta && <div className="text-[12px] font-medium text-ink-3">{meta}</div>}
    {action && (
      <button
        onClick={onAction}
        className="text-[12.5px] font-medium text-primary transition-colors hover:text-primary-2"
      >
        {action}
      </button>
    )}
  </div>
);
