const responsive = `
/* ═══════════════════════════════════════════════════════════════
   FIX 1 · Panel content no longer overflows
   ═══════════════════════════════════════════════════════════════
   The grid tracks now use minmax(0, ...) so they can shrink
   below their content's intrinsic width instead of forcing the
   panel wider and getting clipped. */

.qmb-row {
  grid-template-columns: minmax(0, 130px) minmax(0, 1fr) 52px 28px;
  min-width: 0;
}
.qmb-fields { flex-wrap: wrap; min-width: 0; }
.qmb-type { min-width: 0; }
.qmb-type-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.qmb-step-input, .qmb-marks-input { flex-shrink: 0; }

.gen-grid {
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  min-width: 0;
}
.up-grid {
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  min-width: 0;
}

/* Prevent any grid child from pushing its parent wider */
.panel, .chart-frame, .course-card { min-width: 0; }

/* ═══════════════════════════════════════════════════════════════
   FIX 2 · Sidebar becomes a slide-in drawer on mobile
   ═══════════════════════════════════════════════════════════════ */

@media (max-width: 860px) {
  html, body { overflow-x: hidden; }

  .shell { grid-template-columns: 1fr; }

  /* Override the display:none from styles.js */
  .side {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    height: 100dvh;
    width: min(84vw, 300px);
    z-index: 40;
    transform: translateX(-100%);
    transition: transform 220ms cubic-bezier(0.2, 0, 0, 1);
    box-shadow: 4px 0 32px rgba(0,0,0,0.45);
    overscroll-behavior: contain;
  }
  .side.open { transform: translateX(0); }

  .side-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 35;
    animation: backdrop-in 180ms ease-out;
  }
  @keyframes backdrop-in { from { opacity: 0; } to { opacity: 1; } }

  /* Bigger touch targets for nav */
  .side-item { padding: 12px 10px; font-size: 14.5px; }
  .side-item .side-dot { width: 5px; height: 5px; }

  /* Mobile top bar */
  .mobile-topbar {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 25;
    background: var(--bg);
    border-bottom: 1px solid var(--rule);
    padding: 10px 14px;
    align-items: center;
    gap: 12px;
  }
  .hamburger-btn {
    width: 42px;
    height: 42px;
    border-radius: 8px;
    border: 1px solid var(--rule-2);
    background: transparent;
    color: var(--ink-2);
    display: grid;
    place-items: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 100ms ease-out, transform 80ms ease-out;
    -webkit-tap-highlight-color: transparent;
  }
  .hamburger-btn:hover { background: var(--surface); color: var(--ink); }
  .hamburger-btn:active { transform: scale(0.96); }

  .mobile-brand { display: flex; align-items: center; gap: 8px; flex: 1; }
  .mobile-brand .logo-mark { width: 24px; height: 24px; font-size: 16px; }
  .mobile-brand .logo-name { font-size: 18px; }
}

/* Hide the mobile top bar on desktop */
@media (min-width: 861px) {
  .mobile-topbar { display: none; }
}

/* ═══════════════════════════════════════════════════════════════
   FIX 3 · Two-column layouts stack cleanly
   ═══════════════════════════════════════════════════════════════ */

/* Tablet: side-by-side becomes stacked */
@media (max-width: 1024px) {
  .gen-grid,
  .up-grid,
  .analysis {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .gen-grid > div:first-child { position: static; }
  .chart-pair { grid-template-columns: 1fr; gap: 14px; }
}

/* Question mix row stacks to two lines instead of five columns */
@media (max-width: 1024px) {
  .qmb-row {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "type     subtotal"
      "fields   remove";
    row-gap: 10px;
    align-items: start;
    padding: 14px;
  }
  .qmb-type {
    grid-area: type;
    flex-direction: row;
    align-items: baseline;
    gap: 8px;
  }
  .qmb-fields {
    grid-area: fields;
    align-self: center;
  }
  .qmb-subtotal {
    grid-area: subtotal;
    align-self: center;
    font-size: 15px;
  }
  .qmb-remove {
    grid-area: remove;
    align-self: start;
    justify-self: end;
  }
  .qmb-add { flex-direction: column; align-items: flex-start; }
}

/* ═══════════════════════════════════════════════════════════════
   FIX 4 · KPIs and stat grids reflow
   ═══════════════════════════════════════════════════════════════ */

@media (max-width: 860px) {
  .kpis { grid-template-columns: 1fr 1fr; }
  .kpi {
    padding: 18px 18px 18px 0;
    border-bottom: 1px solid var(--rule);
  }
  .kpi:nth-child(even) { border-right: none; }
  .kpi:nth-child(odd) { border-right: 1px solid var(--rule); }
  .kpi:last-child { padding-bottom: 18px; }
}

@media (max-width: 520px) {
  .kpis { grid-template-columns: 1fr; }
  .kpi {
    padding: 16px 0;
    border-right: none !important;
    border-bottom: 1px solid var(--rule);
  }
  .kpi:not(:first-child) { padding-left: 0; }
  .kpi-num { font-size: 36px; }
}

/* ═══════════════════════════════════════════════════════════════
   FIX 5 · Typography and spacing scale down
   ═══════════════════════════════════════════════════════════════ */

@media (max-width: 860px) {
  .main-pad { padding: 24px 20px 64px; }
  h1.title { font-size: 26px; }
  .lede { font-size: 14.5px; }
  .sec { margin-top: 36px; }
  .sec-title { font-size: 14.5px; }
  .chart-frame { padding: 18px 16px 14px; }
  .panel { padding: 20px 18px; }
  .panel-title { font-size: 12.5px; margin-bottom: 18px; }

  .take-q { font-size: 22px; }
  .take-body { padding: 40px 20px; }
  .take-bar { padding: 12px 16px; }
  .take-bar .test-name { font-size: 14px; }
  .timer { font-size: 17px; }
  .take-foot {
    flex-wrap: wrap;
    gap: 10px;
  }
  .take-foot > span { order: -1; flex-basis: 100%; text-align: center; }

  .stop-overlay-card { padding: 32px 22px 26px; }
  .stop-overlay-title { font-size: 20px; }

  .modal { max-width: calc(100vw - 32px); }
  .modal-body { padding: 20px; }
  .modal-head, .modal-foot { padding: 18px 20px; }

  .toast-viewport { right: 12px; left: 12px; bottom: 12px; max-width: none; }

  .login-left { padding: 32px 24px; }
  .login-right { padding: 32px 24px; }
  .login-wordmark { font-size: 40px; }
  .login-tag { font-size: 14.5px; }
  .role-select { grid-template-columns: 1fr; }
}

@media (max-width: 520px) {
  .main-pad { padding: 20px 16px 56px; }
  h1.title { font-size: 22px; }
  .sec-title { font-size: 14px; }
  .lede { font-size: 14px; }
  .chart-cap { font-size: 12.5px; }
  .chart-desc { font-size: 12px; }
  .finding { font-size: 13.5px; }
}

/* ═══════════════════════════════════════════════════════════════
   FIX 6 · Tables scroll horizontally instead of overflowing
   ═══════════════════════════════════════════════════════════════ */

@media (max-width: 860px) {
  .dtable, .gr-table { font-size: 12.5px; }
  .dtable th, .dtable td { padding: 10px 8px; }
  .gr-table thead th, .gr-table tbody td { padding: 11px 9px; }
  .gr-filter-bar { flex-direction: column; align-items: stretch; gap: 8px; }
  .gr-filter-chip { justify-content: center; }
  .gr-search { min-width: 0; }
  .gr-progress { margin-left: 0; justify-content: space-between; }
  .gr-detail { margin: 0 -16px; padding: 22px 16px; }
  .gr-detail-inner { max-width: none; }
  .gr-detail-student { font-size: 18px; }
  .gr-answer-text { font-size: 16px; padding: 14px 16px; }
  .gr-score-row { grid-template-columns: 1fr; gap: 12px; }
  .gr-rubric-item { font-size: 12.5px; }

  /* Row item grids: collapse the extra columns */
  .rowitem { gap: 12px; }
}

/* Very narrow: hide low-priority table columns */
@media (max-width: 520px) {
  .gr-table thead th:nth-child(2),
  .gr-table tbody td:nth-child(2),
  .gr-table thead th:nth-child(6),
  .gr-table tbody td:nth-child(6),
  .gr-table thead th:nth-child(7),
  .gr-table tbody td:nth-child(7) { display: none; }

  .dtable thead th:nth-child(4),
  .dtable tbody td:nth-child(4) { display: none; }

  .rowitem { grid-template-columns: 1fr auto !important; }
  .rowitem > *:nth-child(n+3):not(:last-child) { display: none; }
}

/* ═══════════════════════════════════════════════════════════════
   FIX 7 · Charts and small multiples
   ═══════════════════════════════════════════════════════════════ */

@media (max-width: 860px) {
  .sm-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
  .sm-cell { padding: 12px 12px 8px; }
  .sm-val { font-size: 20px; }
  .dp-row, .dp-scale { grid-template-columns: 90px 1fr 44px; gap: 12px; }
  .dp-label { font-size: 12px; }
  .dotplot { padding: 4px 0; }
}

@media (max-width: 520px) {
  .sm-grid { grid-template-columns: 1fr 1fr; }
  .dp-row, .dp-scale { grid-template-columns: 76px 1fr 40px; gap: 8px; }
  .dp-label { font-size: 11.5px; }
  .dp-val { font-size: 12px; }
}

/* ═══════════════════════════════════════════════════════════════
   FIX 8 · Touch targets
   ═══════════════════════════════════════════════════════════════ */

@media (hover: none) and (pointer: coarse) {
  .btn, .chip, .q-act, .stepper-btn, .field-quick-chip,
  .gr-filter-chip, .side-item, .logout-btn {
    min-height: 44px;
  }
  .btn-sm { min-height: 38px; }
  .q-act { min-height: 32px; }
  .stepper-btn, .qmb-step-btn { min-width: 44px; }

  /* Sticky hover feels wrong on touch */
  .rowitem:hover { background: transparent; }
  .rowitem:active { background: var(--surface); }
  .side-item:hover { background: transparent; }
  .side-item:active { background: var(--surface); }

  /* Remove tap highlight flash */
  * { -webkit-tap-highlight-color: rgba(91,155,213,0.15); }
}

/* ═══════════════════════════════════════════════════════════════
   FIX 9 · Charts inside the draft preview
   ═══════════════════════════════════════════════════════════════ */

@media (max-width: 860px) {
  .q-card { padding: 18px 16px; }
  .q-text { font-size: 17px; }
  .q-opts { grid-template-columns: 1fr; }
  .q-head { flex-wrap: wrap; row-gap: 6px; }
  .q-head > span[style*="margin-left: auto"] { margin-left: 0 !important; }
}

@media (max-width: 520px) {
  .q-text { font-size: 16px; }
  .q-card { padding: 16px 14px; }
  .q-actions { gap: 3px; }
}

/* ═══════════════════════════════════════════════════════════════
   FIX 10 · Login page on mobile
   ═══════════════════════════════════════════════════════════════ */

@media (max-width: 860px) {
  .login { grid-template-columns: 1fr; }
  .login-left {
    padding: 32px 24px;
    border-right: none;
    border-bottom: 1px solid var(--rule);
    min-height: auto;
  }
  .login-right { padding: 32px 24px; }
  .login-wordmark { font-size: 40px; }
  .login-wordmark .cursor { height: 36px; }
  .role-select { grid-template-columns: 1fr; gap: 8px; }
  .role-btn { padding: 14px 16px; }
}

/* ═══════════════════════════════════════════════════════════════
   FIX 11 · Print safety (avoid mobile-only rules leaking)
   ═══════════════════════════════════════════════════════════════ */

@media print {
  .mobile-topbar, .side-backdrop { display: none !important; }
  .side { display: none !important; position: static !important; transform: none !important; }
}
`;

export default responsive;