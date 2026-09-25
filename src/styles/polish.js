const polish = `
/* ═══════════════════════════════════════════════════════════════
   QUICK ACTION PRIMARY
   Was: solid orange fill — read as a warning, not a CTA.
   Now: subtle tinted card with an orange icon. Primary without shouting.
   ═══════════════════════════════════════════════════════════════ */
.quick-action.primary {
  position: relative;
  background: linear-gradient(135deg, rgba(255,77,28,0.08), rgba(255,77,28,0.03));
  border-color: rgba(255,77,28,0.32);
}
.quick-action.primary:hover {
  background: linear-gradient(135deg, rgba(255,77,28,0.13), rgba(255,77,28,0.06));
  border-color: rgba(255,77,28,0.5);
}
.quick-action.primary:active {
  background: linear-gradient(135deg, rgba(255,77,28,0.18), rgba(255,77,28,0.08));
}
.quick-action.primary .qa-icon {
  background: rgba(255,77,28,0.16);
  color: var(--mark);
}
.quick-action.primary .qa-title { color: var(--ink); }
.quick-action.primary .qa-sub { color: var(--ink-3); }

.quick-action.primary::after {
  content: '';
  position: absolute;
  top: 12px;
  right: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--mark);
  box-shadow: 0 0 0 3px rgba(255,77,28,0.15);
  transition: box-shadow 200ms ease-out;
}
.quick-action.primary:hover::after {
  box-shadow: 0 0 0 4px rgba(255,77,28,0.22);
}

/* ═══════════════════════════════════════════════════════════════
   FORM FIELDS — textarea was missing
   Used by: "Start a new thread" modal (chat.jsx)
            "New lesson" editor (lms.jsx)
            Any other .fld textarea anywhere in the app
   ═══════════════════════════════════════════════════════════════ */
.fld textarea {
  width: 100%;
  font-family: var(--sans);
  font-size: 14.5px;
  line-height: 1.55;
  padding: 11px 13px;
  background: var(--bg);
  border: 1px solid var(--rule-2);
  border-radius: 6px;
  color: var(--ink);
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: border-color 120ms ease-out, box-shadow 120ms ease-out;
}
.fld textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}
.fld textarea::placeholder { color: var(--ink-4); }

/* Also cover select elements in case they were missed */
.fld select {
  width: 100%;
  font-family: var(--sans);
  font-size: 14.5px;
  padding: 11px 13px;
  background: var(--bg);
  border: 1px solid var(--rule-2);
  border-radius: 6px;
  color: var(--ink);
  outline: none;
  transition: border-color 120ms ease-out, box-shadow 120ms ease-out;
}
.fld select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}

/* ═══════════════════════════════════════════════════════════════
   KPI STRIP HEIGHT
   Was: 148px min-height — content only needed ~110px.
   Now: 124px with tighter type.
   ═══════════════════════════════════════════════════════════════ */
.kpis.kpis-fixed > .kpi {
  min-height: 124px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.kpis.kpis-fixed .kpi-num { font-size: 40px; }
.kpis.kpis-fixed .kpi-label { margin-bottom: 10px; }
.kpis.kpis-fixed .kpi-sub { font-size: 12px; }

/* ═══════════════════════════════════════════════════════════════
   TOASTS ON MOBILE
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 860px) {
  .toast-viewport {
    right: 16px;
    left: 16px;
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    max-width: none;
  }
  .toast { justify-content: flex-start; }
}

/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .conn .beacon { animation: none; }
  .bar::after { animation: none; width: 100%; }
  .draft-queued-spinner { animation: none; }
  .toast { animation: none; }
}

/* ═══════════════════════════════════════════════════════════════
   FOCUS RINGS
   ═══════════════════════════════════════════════════════════════ */
:focus { outline: none; }
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
button:focus-visible,
.btn:focus-visible,
.chip:focus-visible,
.quick-action:focus-visible,
.kpi-clickable:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.side-item:focus-visible { outline-offset: -2px; }

/* ═══════════════════════════════════════════════════════════════
   QUICK ACTION REFINEMENT
   ═══════════════════════════════════════════════════════════════ */
.quick-action.primary .qa-icon {
  width: 38px;
  height: 38px;
}

/* ═══════════════════════════════════════════════════════════════
   NEXT ACTION HERO
   ═══════════════════════════════════════════════════════════════ */
.next-action { box-shadow: 0 1px 0 rgba(0,0,0,0.15); }

/* ═══════════════════════════════════════════════════════════════
   DOT PLOT REFINEMENT
   ═══════════════════════════════════════════════════════════════ */
.dotplot-recharts .recharts-cartesian-axis-tick-value {
  font-feature-settings: "ss01";
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE HEADING
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 520px) {
  h1.title .soft { display: block; margin-top: 2px; }
}

/* ═══════════════════════════════════════════════════════════════
   SKELETONS
   ═══════════════════════════════════════════════════════════════ */
.skeleton {
  display: inline-block;
  background: linear-gradient(
    90deg,
    var(--rule) 0%,
    var(--rule-2) 40%,
    var(--rule) 80%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
  border-radius: 6px;
  flex-shrink: 0;
}
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-text { display: flex; flex-direction: column; gap: 8px; }
.skeleton-card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 10px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--rule);
}

/* ═══════════════════════════════════════════════════════════════
   EMPTY STATES
   ═══════════════════════════════════════════════════════════════ */
.empty-state {
  padding: 64px 24px;
  text-align: center;
  border: 1px solid var(--rule);
  border-radius: 10px;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.empty-state.compact { padding: 40px 20px; gap: 10px; }
.empty-state-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: var(--raised);
  color: var(--ink-3);
  display: grid;
  place-items: center;
  margin-bottom: 4px;
}
.empty-state-title {
  font-family: var(--sans);
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.005em;
}
.empty-state-body {
  font-family: var(--sans);
  font-size: 13.5px;
  color: var(--ink-3);
  line-height: 1.55;
  max-width: 400px;
}
.empty-state-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

/* ═══════════════════════════════════════════════════════════════
   CONFIRM DIALOG
   ═══════════════════════════════════════════════════════════════ */
.modal-confirm {
  max-width: 420px;
  padding: 32px 28px 24px;
  text-align: center;
}
.modal-confirm .confirm-icon {
  width: 48px; height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
}
.modal-confirm .confirm-icon.danger {
  background: var(--mark-dim);
  color: var(--mark);
}
.modal-confirm .confirm-icon.default {
  background: var(--accent-dim);
  color: var(--accent);
}
.modal-confirm .confirm-title {
  font-family: var(--sans);
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
  margin-bottom: 8px;
  padding: 0;
  border: none;
}
.modal-confirm .confirm-message {
  font-family: var(--sans);
  font-size: 14px;
  color: var(--ink-3);
  line-height: 1.55;
  margin-bottom: 24px;
}
.modal-confirm .confirm-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.btn-danger {
  background: var(--mark);
  color: #0F1115;
  font-weight: 600;
  border: 1px solid transparent;
}
.btn-danger:hover { background: #FF6033; }
.btn-danger:active { transform: scale(0.975); }

/* ═══════════════════════════════════════════════════════════════
   LOADING BUTTON
   ═══════════════════════════════════════════════════════════════ */
.btn.is-loading {
  position: relative;
  pointer-events: none;
  opacity: 0.85;
}
.btn.is-loading .btn-label { opacity: 0.55; }
.btn-spinner {
  display: inline-block;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: spin 700ms linear infinite;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════════════════
   COMMAND PALETTE
   ═══════════════════════════════════════════════════════════════ */
.cmd-bg {
  position: fixed;
  inset: 0;
  background: rgba(15, 17, 21, 0.72);
  backdrop-filter: blur(4px);
  z-index: 400;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh 24px 24px;
  animation: fadein 140ms ease-out;
}
.cmd-palette {
  background: var(--surface);
  border: 1px solid var(--rule-2);
  border-radius: 12px;
  width: 100%;
  max-width: 560px;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  animation: cmd-in 180ms cubic-bezier(0.2, 0, 0, 1);
}
@keyframes cmd-in {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to   { opacity: 1; transform: none; }
}
.cmd-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--rule);
  color: var(--ink-3);
}
.cmd-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 15px;
}
.cmd-input::placeholder { color: var(--ink-4); }
.cmd-kbd {
  font-family: var(--sans);
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 7px;
  background: var(--raised);
  border: 1px solid var(--rule-2);
  border-radius: 4px;
  color: var(--ink-3);
  letter-spacing: 0.02em;
}
.cmd-results {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}
.cmd-section { padding: 4px 0; }
.cmd-section-title {
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-3);
  padding: 8px 20px 4px;
}
.cmd-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 20px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: var(--sans);
  font-size: 14px;
  color: var(--ink-2);
  transition: background 80ms ease-out, color 80ms ease-out;
}
.cmd-item:hover, .cmd-item.active {
  background: var(--raised);
  color: var(--ink);
}
.cmd-item.active {
  border-left: 2px solid var(--accent);
  padding-left: 18px;
}
.cmd-item-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--raised);
  color: var(--ink-3);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.cmd-item.active .cmd-item-icon { background: var(--accent-dim); color: var(--accent); }
.cmd-item-label { flex: 1; color: inherit; }
.cmd-item-hint {
  font-size: 12px;
  color: var(--ink-4);
  font-variant-numeric: tabular-nums;
}
.cmd-empty {
  padding: 48px 24px;
  text-align: center;
  font-family: var(--sans);
  font-size: 13.5px;
  color: var(--ink-3);
}
.cmd-footer {
  display: flex;
  gap: 16px;
  padding: 10px 20px;
  border-top: 1px solid var(--rule);
  font-family: var(--sans);
  font-size: 11px;
  color: var(--ink-3);
}
.cmd-footer kbd {
  font-family: inherit;
  font-size: 10px;
  padding: 1px 5px;
  background: var(--raised);
  border: 1px solid var(--rule-2);
  border-radius: 3px;
  margin-right: 3px;
}

/* ═══════════════════════════════════════════════════════════════
   PAGE TRANSITIONS
   ═══════════════════════════════════════════════════════════════ */
.page-transition {
  animation: page-in 220ms cubic-bezier(0.2, 0, 0, 1);
}
@keyframes page-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: none; }
}

/* ═══════════════════════════════════════════════════════════════
   TOAST HOVER PAUSE + STACKING
   ═══════════════════════════════════════════════════════════════ */
.toast { transition: transform 180ms ease-out, opacity 180ms ease-out; }
.toast:hover { transform: translateY(-1px); }

/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION OVERRIDES
   ═══════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .cmd-bg, .cmd-palette, .page-transition, .skeleton {
    animation: none !important;
  }
  .skeleton { background: var(--rule); }
}

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 860px) {
  .cmd-bg { padding: 8vh 16px 16px; }
  .cmd-palette { max-height: 70vh; }
  .modal-confirm { padding: 26px 22px 20px; }
}

/* ═══════════════════════════════════════════════════════════════
   KEYBOARD KEY BADGE
   ═══════════════════════════════════════════════════════════════ */
.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--sans);
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 6px;
  background: var(--raised);
  border: 1px solid var(--rule-2);
  border-radius: 4px;
  color: var(--ink-2);
  line-height: 1;
  min-width: 18px;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}
.kbd-sm {
  font-size: 9.5px;
  padding: 2px 5px;
  min-width: 16px;
}

/* ═══════════════════════════════════════════════════════════════
   SEARCH HINT PILL
   ═══════════════════════════════════════════════════════════════ */
.search-hint {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 8px 12px;
  background: var(--surface);
  border: 1px solid var(--rule-2);
  border-radius: 6px;
  color: var(--ink-3);
  font-family: var(--sans);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 120ms ease-out, background 120ms ease-out, color 120ms ease-out;
  height: 34px;
}
.search-hint:hover {
  border-color: var(--rule-2);
  background: var(--raised);
  color: var(--ink);
}
.search-hint:active { transform: scale(0.985); }
.search-hint svg { flex-shrink: 0; }
.search-hint-label {
  color: inherit;
  padding-right: 24px;
  text-align: left;
  min-width: 120px;
}
.search-hint-keys {
  display: inline-flex;
  gap: 3px;
  flex-shrink: 0;
}
.search-hint.compact {
  width: 40px;
  height: 40px;
  padding: 0;
  justify-content: center;
  border-radius: 8px;
}

/* Add the search hint into the desktop sidebar footer area */
@media (min-width: 861px) {
  .side-foot + .side-search {
    padding: 12px 20px 0;
  }
  .side-search {
    margin-top: 12px;
  }
}

/* ═══════════════════════════════════════════════════════════════
   RECENT SECTION IN COMMAND PALETTE
   ═══════════════════════════════════════════════════════════════ */
.cmd-recent-badge {
  font-family: var(--sans);
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  background: var(--accent-dim);
  color: var(--accent);
  border-radius: 3px;
  margin-left: auto;
  letter-spacing: 0.02em;
}

/* ═══════════════════════════════════════════════════════════════
   INLINE CLEAR BUTTONS ON FILTERED EMPTY STATES
   ═══════════════════════════════════════════════════════════════ */
.empty-state-actions .btn-text {
  color: var(--ink-3);
}
.empty-state-actions .btn-text:hover { color: var(--ink); }

/* ═══════════════════════════════════════════════════════════════
   STICKY SEARCH IN TABLES
   Keeps the filter bar pinned under the top bar on scroll
   ═══════════════════════════════════════════════════════════════ */
@media (min-width: 861px) {
  .gr-filter-bar {
    background: linear-gradient(
      to bottom,
      var(--bg) 0%,
      var(--bg) 92%,
      transparent 100%
    );
  }
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR FOOTER + SEARCH — prevent horizontal overflow
   ═══════════════════════════════════════════════════════════════ */
.side-foot .who {
  min-width: 0;                 /* allow flex child to shrink */
  overflow: hidden;
}
.side-foot .who,
.side-foot .who small {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.side-search {
  padding: 0 20px 16px;
}

.side-search .search-hint {
  width: 100%;
  min-width: 0;
  justify-content: space-between;
  padding: 8px 8px 8px 10px;
}

.side-search .search-hint-label {
  min-width: 0;                 /* was 120px — the culprit */
  flex: 1;
  padding-right: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.side-search .search-hint-keys {
  flex-shrink: 0;
}

/* Tighten the sidebar avatar row so long names still fit */
.side-foot {
  gap: 8px;
}
.side-foot .av {
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR SCROLL + TIGHTENING ON SHORT VIEWPORTS
   When the viewport is short, sidebar content overflows past the
   bottom. Make the sidebar scroll internally so the search pill
   and avatar row stay reachable.
   ═══════════════════════════════════════════════════════════════ */
.side {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--rule-2) transparent;
}
.side::-webkit-scrollbar { width: 6px; }
.side::-webkit-scrollbar-track { background: transparent; }
.side::-webkit-scrollbar-thumb {
  background: var(--rule-2);
  border-radius: 3px;
}
.side::-webkit-scrollbar-thumb:hover {
  background: var(--rule-strong);
}

/* Only compress when the viewport is genuinely short (small laptops
   in split-screen, tiny windows). 760px covers a normal 1366×768
   laptop viewport after browser chrome, without over-compressing on
   larger screens. */
@media (max-height: 620px) {
  .side { padding: 12px 0 10px; }
  .side-brand { padding: 0 20px 14px; margin-bottom: 12px; }
  .side-group { margin-bottom: 10px; }
  .side-item { padding: 6px 8px; }
  .side-foot { padding: 10px 20px 0; }
  .side-search { padding: 0 20px 10px; }
}

/* ═══════════════════════════════════════════════════════════════
   ROW ITEMS ON MOBILE — fix arrow wrapping
   Previous rule hid children 3+ but kept a 2-column grid, so 3
   visible children wrapped the arrow to a second row.
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 520px) {
  .rowitem {
    grid-template-columns: minmax(0, auto) 1fr auto !important;
    gap: 12px;
    padding: 14px 4px 14px 0;
  }
  .rowitem > * { min-width: 0; }
  .rowitem .rowname { overflow: hidden; text-overflow: ellipsis; }
  .rowitem .rowname small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
}

/* ═══════════════════════════════════════════════════════════════
   TAKE TEST BAR — compress for narrow phones
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  .take-bar {
    padding: 10px 12px;
    gap: 8px;
  }
  .take-bar .left {
    flex: 1;
    min-width: 0;
    gap: 8px;
  }
  .take-bar .pill { display: none; }
  .take-bar .test-name {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .take-bar > div:last-child {
    gap: 8px !important;      /* inline style override */
    flex-shrink: 0;
  }
  .timer { font-size: 15px; }
  .anti-bar { font-size: 9.5px; gap: 5px; }
  .anti-ind { padding: 3px 6px; gap: 4px; }
  .anti-ind .dot { width: 4px; height: 4px; }
  .take-bar .conn { font-size: 9.5px; padding: 3px 7px; }
}

@media (max-width: 480px) {
  .take-body { padding: 24px 16px; }
  .take-q { font-size: 19px; line-height: 1.35; margin-bottom: 28px; }
  .take-q-label { font-size: 11px; margin-bottom: 14px; }
  .take-opt { padding: 14px 16px; font-size: 14px; gap: 12px; }
  .take-opt .letter { width: 22px; height: 22px; font-size: 11px; }
  .take-textarea { min-height: 140px; padding: 14px 16px; font-size: 14px; }
  .take-progress { margin-bottom: 24px; }
}

/* ═══════════════════════════════════════════════════════════════
   MODALS — squeeze on narrow phones
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 520px) {
  .modal-head { padding: 16px 18px; gap: 10px; }
  .modal-head h2 {
    font-size: 16px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .modal-x { flex-shrink: 0; }
  .modal-body { padding: 18px; }
  .modal-foot {
    padding: 14px 18px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .modal-foot .btn {
    flex: 1 1 auto;
    justify-content: center;
    min-width: 100px;
  }
  /* Collapse inline 2-col grids inside modal bodies */
  .modal-body [style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }
}

/* ═══════════════════════════════════════════════════════════════
   TABLE CELL OVERFLOW PROTECTION
   Long emails, URLs, or strings push the table wider than its
   container. Break them so the layout stays put.
   ═══════════════════════════════════════════════════════════════ */
.dtable td,
.gr-table td {
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* ═══════════════════════════════════════════════════════════════
   DYNAMIC VIEWPORT HEIGHT
   100vh on iOS Safari includes the URL bar area, so content
   can slip under it. 100dvh adjusts as the URL bar shows/hides.
   ═══════════════════════════════════════════════════════════════ */
.side {
  height: 100vh;
  height: 100dvh;
}
.main {
  min-height: 100vh;
  min-height: 100dvh;
}
.login {
  min-height: 100vh;
  min-height: 100dvh;
}
.take {
  min-height: 100vh;
  min-height: 100dvh;
}

/* ═══════════════════════════════════════════════════════════════
   DATETIME-LOCAL INPUT OVERFLOW
   Browsers give these an intrinsic minimum width that grid/flex
   children can't shrink below unless min-width: 0 is set. This
   was the Publish modal's schedule-picker bug.
   ═══════════════════════════════════════════════════════════════ */
.fld input[type="datetime-local"],
.fld input[type="date"],
.fld input[type="time"] {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  font-family: var(--sans);
  font-size: 14px;
  padding: 10px 12px;
  background: var(--bg);
  border: 1px solid var(--rule-2);
  border-radius: 6px;
  color: var(--ink);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}
.fld input[type="datetime-local"]:focus,
.fld input[type="date"]:focus,
.fld input[type="time"]:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}

/* Any inline 2-col grid inside a modal body must allow children to shrink */
.modal-body > div[style*="grid-template-columns"] {
  min-width: 0;
}
.modal-body > div[style*="grid-template-columns"] > * {
  min-width: 0;
}

/* On narrow phones, the 2-col schedule grid stacks to 1 */
@media (max-width: 480px) {
  .modal-body > div[style*="grid-template-columns: 1fr 1fr"],
  .modal-body > div[style*="grid-template-columns:\"1fr 1fr\""] {
    grid-template-columns: 1fr !important;
  }
}
.modal-grid-2 {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
}
@media (max-width: 480px) {
  .modal-grid-2 { grid-template-columns: 1fr; }
}
.publish-notify-note {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 16px;
  margin: 16px 26px 0;
  background: var(--accent-dim);
  border: 1px solid rgba(91,155,213,0.25);
  border-radius: 6px;
  font-family: var(--sans);
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--accent);
}
.publish-notify-note svg { flex-shrink: 0; margin-top: 2px; }
.btn-text:disabled {
  color: var(--ink-4);
  cursor: not-allowed;
  background: transparent;
}
.btn-text:disabled:hover { background: transparent; }
@media (max-width: 860px) {
  .draft-row-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 2px;
  }
  .draft-row-actions .btn-text {
    padding: 4px 6px;
    font-size: 11.5px;
  }
}
@media (max-width: 520px) {
  .draft-row-actions .btn-text:nth-child(n+4) {
    display: none;
  }
}

/* ═══════════════════════════════════════════════════════════════
   CLASS SWITCHER
   Anchored at the top of the sidebar. Follows the workspace-switcher
   pattern from Notion / Slack / Linear.
   ═══════════════════════════════════════════════════════════════ */
.cs-wrap {
  position: relative;
  padding: 0 12px 16px;
  border-bottom: 1px solid var(--rule);
  margin-bottom: 12px;
}

.cs-trigger {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 16px;
  grid-template-areas:
    "subject  chevron"
    "name     chevron";
  align-items: center;
  gap: 0 8px;
  padding: 10px 12px;
  background: var(--surface);
  border: 1px solid var(--rule-2);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-family: var(--sans);
  transition: border-color 120ms ease-out, background 120ms ease-out;
}
.cs-trigger:hover { border-color: var(--ink-3); background: var(--raised); }
.cs-trigger.open { border-color: var(--accent); background: var(--raised); }
.cs-subject {
  grid-area: subject;
  font-family: var(--sans);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cs-name {
  grid-area: name;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cs-count {
  display: block;
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 400;
  color: var(--ink-3);
  margin-top: 1px;
}
.cs-chevron {
  grid-area: chevron;
  color: var(--ink-3);
  transition: transform 160ms ease-out;
  align-self: center;
}
.cs-trigger.open .cs-chevron { transform: rotate(180deg); }

.cs-menu {
  position: absolute;
  top: calc(100% - 6px);
  left: 12px;
  right: 12px;
  background: var(--raised);
  border: 1px solid var(--rule-2);
  border-radius: 10px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.55);
  padding: 6px;
  z-index: 50;
  animation: qin 180ms cubic-bezier(0.2, 0, 0, 1);
}

.cs-menu-label {
  font-family: var(--sans);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-4);
  padding: 8px 10px 4px;
}

.cs-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  font-family: var(--sans);
  transition: background 100ms ease-out;
}
.cs-item:hover { background: var(--surface); }
.cs-item.active { background: var(--accent-dim); }

.cs-item-mark {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: var(--surface);
  display: grid;
  place-items: center;
}
.cs-item.active .cs-item-mark { background: var(--accent); }
.cs-item-code {
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-3);
}
.cs-item.active .cs-item-code { color: #0F1115; }

.cs-item-body { flex: 1; min-width: 0; }
.cs-item-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cs-item.active .cs-item-name { color: var(--accent); font-weight: 600; }
.cs-item-meta {
  display: block;
  font-size: 11px;
  color: var(--ink-3);
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cs-check { color: var(--accent); flex-shrink: 0; }

.cs-menu-foot {
  padding: 8px 10px 4px;
  border-top: 1px solid var(--rule);
  margin-top: 4px;
}
.cs-hint {
  font-family: var(--sans);
  font-size: 10.5px;
  color: var(--ink-4);
  font-style: italic;
}

/* ═══════════════════════════════════════════════════════════════
   GROUPED SIDEBAR NAV
   Sections with muted 11px labels above each cluster, following
   the Rule of Proximity (Vercel redesign) and Ant Design's
   grouped-sidebar pattern.
   ═══════════════════════════════════════════════════════════════ */
.side-nav {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
}
.side-nav-group { margin-bottom: 14px; }
.side-nav-group:last-child { margin-bottom: 0; }

.side-group-label {
  font-family: var(--sans);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-4);
  padding: 6px 8px 4px;
}

/* The old flat .side-group is now unused; the .side-item style
   carries over unchanged so nothing else breaks. */

/* ═══════════════════════════════════════════════════════════════
   CLASS SETTINGS — DANGER ZONE
   ═══════════════════════════════════════════════════════════════ */
.settings-danger {
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid var(--rule);
}
.settings-danger-title {
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mark);
  margin-bottom: 12px;
}
.settings-danger-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  background: var(--mark-dim);
  border: 1px solid rgba(255, 77, 28, 0.28);
  border-radius: 8px;
}
.settings-danger-body > div { min-width: 0; flex: 1; }
.settings-danger-body strong {
  display: block;
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 3px;
}
.settings-danger-body span {
  display: block;
  font-family: var(--sans);
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.5;
}
.settings-danger-body .btn { flex-shrink: 0; }
@media (max-width: 520px) {
  .settings-danger-body {
    flex-direction: column;
    align-items: stretch;
  }
  .settings-danger-body .btn { width: 100%; justify-content: center; }
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION 1 — KPI STRIP STAGGERED ENTRANCE
   Research: staggered entrance guides the eye from the first KPI
   to the last, 40–60ms apart. "backwards" fill prevents a flash of
   visible-then-hidden during the initial delay.
   Fires on every view change because the page-transition wrapper
   remounts on 'key={view}'.
   ═══════════════════════════════════════════════════════════════ */
.kpis > .kpi {
  animation: kpi-in 320ms cubic-bezier(0.2, 0, 0, 1) backwards;
}
.kpis > .kpi:nth-child(1) { animation-delay: 0ms; }
.kpis > .kpi:nth-child(2) { animation-delay: 50ms; }
.kpis > .kpi:nth-child(3) { animation-delay: 100ms; }
.kpis > .kpi:nth-child(4) { animation-delay: 150ms; }

@keyframes kpi-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION 2 — CONFIRM DIALOG ICON PULSE
   One-time subtle overshoot. Draws the eye to the warning before
   the user reads the message. Under 500ms, no looping.
   ═══════════════════════════════════════════════════════════════ */
.modal-confirm .confirm-icon {
  animation: confirm-pulse 480ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes confirm-pulse {
  0%   { transform: scale(0.85); opacity: 0; }
  60%  { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(1);    opacity: 1; }
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION 3 — SIDEBAR NAV DOT ACTIVE STATE
   When a nav item becomes active, its dot scales up and gains a
   subtle halo. Feedback on state change, not decoration.
   ═══════════════════════════════════════════════════════════════ */
.side-item .side-dot {
  transition: background 160ms ease-out,
              transform   160ms ease-out,
              box-shadow  160ms ease-out;
}
.side-item.on .side-dot {
  background: var(--mark);
  transform: scale(1.3);
  box-shadow: 0 0 0 2px rgba(255, 77, 28, 0.15);
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION 4 — QUESTION NAVIGATOR BUTTON STATES
   Answering a question flips the button from neutral to green.
   The transition makes the state change feel deliberate.
   ═══════════════════════════════════════════════════════════════ */
.qn-btn {
  transition: background-color 220ms ease-out,
              border-color     220ms ease-out,
              color            220ms ease-out,
              transform        120ms ease-out;
}
.qn-btn:active:not(:disabled) { transform: scale(0.94); }

/* ═══════════════════════════════════════════════════════════════
   ANIMATION 5 — PILL STATE TRANSITIONS
   Live roster pills flip from "Active" (accent) to "Submitted"
   (good) when a student finishes. The transition smooths the flip.
   Pills that don't change state never animate — CSS transitions
   only fire on property changes after mount.
   ═══════════════════════════════════════════════════════════════ */
.pill {
  transition: background 220ms ease-out, color 220ms ease-out;
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION 6 — MODAL FOOTER BUTTONS ENTRANCE
   Slight upward drift into place with the modal. Pairs with the
   backdrop fade already handled by .fadein
   ═══════════════════════════════════════════════════════════════ */
.modal-head,
.modal-foot {
  animation: modal-chrome-in 260ms cubic-bezier(0.2, 0, 0, 1) backwards;
}
@keyframes modal-chrome-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION — kill every new animation cleanly.
   The existing catch-all in polish.js already handles most of
   this, but these overrides are explicit for clarity.
   ═══════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .kpis > .kpi,
  .modal-confirm .confirm-icon,
  .modal-head,
  .modal-foot {
    animation: none !important;
  }
  .side-item .side-dot,
  .qn-btn,
  .pill {
    transition: none !important;
  }
}

/* ═══════════════════════════════════════════════════════════════
   MODAL VIEWPORT FIT
   Every modal caps its height to the viewport and scrolls its
   body internally. Footer stays pinned. Fixes the "Start a new
   thread" cutoff on laptop screens.
   ═══════════════════════════════════════════════════════════════ */
.modal {
  max-height: calc(100vh - 48px);
  max-height: calc(100dvh - 48px);
  display: flex;
  flex-direction: column;
}
.modal-head { flex-shrink: 0; }
.modal-foot { flex-shrink: 0; }
.modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/* Inside the modal body, any inner scroll container still works */
.modal-body > div[style*="maxHeight"] { max-height: none !important; }

@media (max-width: 520px) {
  .modal { max-height: calc(100vh - 24px); max-height: calc(100dvh - 24px); }
}

/* ═══════════════════════════════════════════════════════════════
   DRAFTS TABLE — give the title room, pin actions to the right
   Without this, the actions column grows to fit five buttons and
   forces the title column down to ~40px, wrapping long test names
   onto six lines.
   ═══════════════════════════════════════════════════════════════ */
.gr-table td.col-student,
.gr-table th:first-child {
  min-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.gr-table td.col-student {
  white-space: normal;
  word-break: normal;
  line-height: 1.35;
}

/* Actions column shrinks to fit its own content instead of eating
   the rest of the table. */
.gr-table th:last-child,
.gr-table td:last-child {
  width: 1%;
  white-space: nowrap;
  text-align: right;
}

/* Keep action buttons on one line — no wrap, no overflow into
   the row above or below. */
.draft-row-actions {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  white-space: nowrap;
}
.draft-row-actions .btn-text {
  padding: 4px 8px;
  font-size: 12px;
}

/* On medium screens (tablet), drop the less-used actions behind
   a menu-less cutoff. Regenerate and Duplicate only show above
   1024px. Users can still Open / Publish / Delete everywhere. */
@media (max-width: 1024px) {
  .draft-row-actions .btn-text[data-action="regenerate"],
  .draft-row-actions .btn-text[data-action="duplicate"] {
    display: none;
  }
}

/* On phones, hide Publish and Live View too — the row itself is
   clickable and opens the same detail. Only Open and Delete stay. */
@media (max-width: 640px) {
  .draft-row-actions .btn-text {
    padding: 3px 6px;
    font-size: 11.5px;
  }
  .draft-row-actions .btn-text:not(:first-child):not(:last-child) {
    display: none;
  }
  .gr-table td.col-student,
  .gr-table th:first-child {
    min-width: 140px;
  }
}

/* Numbers and dates stay on one line */
.gr-table .col-num,
.gr-table td[style*="fontSize: 12.5"] {
  white-space: nowrap;
}


/* ═══════════════════════════════════════════════════════════════
   DRAFT SCOPE — horizontal strip below the test structure panel
   Replaces the side-column layout. Four stats on one row, note
   underneath, full width. Reads as a live summary of what the
   form will produce.
   ═══════════════════════════════════════════════════════════════ */
.draft-form > .scope-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 32px;
  padding: 20px 24px;
  align-items: center;
}

.draft-form > .scope-card .scope-head {
  grid-column: 1 / -1;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--rule);
}

.draft-form > .scope-card .scope-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 0;
  border: none;
  gap: 24px;
}

.draft-form > .scope-card .scope-stat {
  padding-right: 24px;
  border-right: 1px solid var(--rule);
}
.draft-form > .scope-card .scope-stat:last-child {
  border-right: none;
  padding-right: 0;
}

.draft-form > .scope-card .scope-value {
  font-size: 28px;
  line-height: 1.05;
}
.draft-form > .scope-card .scope-value-sm {
  font-size: 15px;
}

.draft-form > .scope-card .scope-note {
  grid-column: 1 / -1;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--rule);
}

@media (max-width: 860px) {
  .draft-form > .scope-card {
    display: block;
    padding: 18px 20px;
  }
  .draft-form > .scope-card .scope-grid {
    grid-template-columns: 1fr 1fr;
    gap: 18px 12px;
  }
  .draft-form > .scope-card .scope-stat {
    padding-right: 0;
    border-right: none;
  }
  .draft-form > .scope-card .scope-stat:nth-child(odd) {
    border-right: 1px solid var(--rule);
    padding-right: 12px;
  }
}
@media (max-width: 480px) {
  .draft-form > .scope-card .scope-grid {
    grid-template-columns: 1fr;
  }
  .draft-form > .scope-card .scope-stat:nth-child(odd) {
    border-right: none;
    padding-right: 0;
  }
}

/* ═══════════════════════════════════════════════════════════════
   TEACHER DASHBOARD — DASHBOARD HYGIENE
   Research-backed decluttering:
   · 4 unique KPIs, no duplicates
   · Alert bar becomes a single subtle line
   · Quick actions become a compact toolbar
   · Generous vertical rhythm between sections
   ═══════════════════════════════════════════════════════════════ */

/* ── KPI strip ─────────────────────────────────────────────── */
.kpi-sub-up {
  color: var(--good);
  font-weight: 500;
}

/* ── Subtle next-action bar ────────────────────────────────── */
.next-action-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px 18px;
  background: oklch(0.780 0.095 78 / 0.04);
  border: 1px solid oklch(0.780 0.095 78 / 0.14);
  border-left: 3px solid var(--accent);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-family: var(--sans);
  color: var(--ink-2);
  margin-top: 20px;
  transition: background 140ms ease-out, border-color 140ms ease-out;
}
.next-action-bar:hover {
  background: oklch(0.780 0.095 78 / 0.07);
  border-color: oklch(0.780 0.095 78 / 0.28);
}
.nab-icon {
  color: var(--accent);
  flex-shrink: 0;
  display: grid;
  place-items: center;
}
.nab-text {
  flex: 1;
  font-size: 13.5px;
  min-width: 0;
}
.nab-text strong {
  color: var(--ink);
  font-weight: 600;
}
.nab-cta {
  font-size: 13px;
  font-weight: 500;
  color: var(--accent);
  flex-shrink: 0;
  transition: transform 140ms ease-out;
}
.next-action-bar:hover .nab-cta {
  transform: translateX(2px);
}
@media (max-width: 640px) {
  .next-action-bar {
    flex-wrap: wrap;
    padding: 12px 14px;
  }
  .nab-text { font-size: 13px; }
  .nab-cta {
    width: 100%;
    text-align: right;
    margin-top: 2px;
  }
}

/* ── Compact quick action toolbar ──────────────────────────── */
.quick-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}
.quick-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 6px;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-2);
  cursor: pointer;
  transition: background 140ms ease-out,
              border-color 140ms ease-out,
              color 140ms ease-out;
}
.quick-btn:hover {
  background: var(--surface-2);
  border-color: var(--rule-2);
  color: var(--ink);
}
.quick-btn.primary {
  background: var(--mark);
  border-color: var(--mark);
  color: oklch(0.135 0.006 260);
  font-weight: 600;
}
.quick-btn.primary:hover {
  background: var(--mark-2);
  border-color: var(--mark-2);
}
.qb-icon {
  display: grid;
  place-items: center;
  color: inherit;
  flex-shrink: 0;
}
.qb-count {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 3px;
  background: oklch(0.780 0.095 78 / 0.18);
  color: var(--accent);
  margin-left: 2px;
}
.quick-btn.primary .qb-count {
  background: oklch(0.135 0.006 260 / 0.18);
  color: oklch(0.135 0.006 260);
}

/* ── Section rhythm — more space between zones ─────────────── */
.sec { margin-top: 44px; }
.sec:first-of-type { margin-top: 36px; }

/* ── Analysis section — reduce to 1 chart + findings ───────── */
.analysis {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: start;
}

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE — mobile-first discipline
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 860px) {
  .quick-bar {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 6px;
    margin: 18px -20px 0;
    padding-left: 20px;
    padding-right: 20px;
    scrollbar-width: none;
  }
  .quick-bar::-webkit-scrollbar { display: none; }
  .quick-btn { flex-shrink: 0; }
  .analysis { grid-template-columns: 1fr; gap: 20px; }
}
@media (max-width: 520px) {
  .nab-text strong { display: inline; }
  .next-action-bar { border-left-width: 2px; }
}
.logo-mark {
  width: 28px;
  height: 28px;
  display: inline-grid;
  place-items: center;
  color: var(--mark);
  --mark-fg: #17120B;
  flex-shrink: 0;
}
.brand-v {
  font-family: var(--sans);
  font-size: 10px;
  font-weight: 500;
  color: var(--ink-4);
  margin-left: 4px;
  padding: 2px 6px;
  border: 1px solid var(--rule);
  border-radius: 4px;
  vertical-align: 6px;
  letter-spacing: 0.04em;
}
/* Wordmark — confident weight, tight tracking */
.logo-name {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -0.025em;
  color: var(--ink);
  line-height: 1;
}
.logo-name span {
  font-family: var(--sans);
  font-weight: 400;
  font-size: 13px;
  color: var(--ink-3);
  margin-left: 4px;
}
/* ═══════════════════════════════════════════════════════════════
   CLASS SWITCHER REFINEMENT
   Tighter vertical rhythm, clearer chevron, better text hierarchy.
   ═══════════════════════════════════════════════════════════════ */
.cs-trigger {
  padding: 10px 12px 10px 14px;
}
.cs-subject {
  font-size: 10px;
  letter-spacing: 0.09em;
  font-weight: 700;
  margin-bottom: 2px;
}
.cs-name {
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-top: 0;
}
.cs-count {
  font-size: 11px;
  margin-top: 2px;
  font-variant-numeric: tabular-nums;
}
.cs-chevron {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}
.cs-trigger:hover .cs-chevron {
  opacity: 1;
}

`;

export default polish;