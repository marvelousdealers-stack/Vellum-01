const themeLoveable = `
/* ═══════════════════════════════════════════════════════════════
   VELLUM NOIR
   An off-black command center with a single warm brass accent.
   
   Design principles (from Linear / Mercury / Stripe / Vercel research):
     · Depth via 4-step surface lightness ladder, never drop shadows
     · White hairlines at 6–14% opacity for borders
     · ONE functional accent (brass) + desaturated semantic colors
     · 4-step muted text ramp, never pure white
     · Tabular numerals everywhere; Space Grotesk for hero figures
     · Tight negative tracking on headlines (−0.02em to −0.04em)
     · 8pt grid; generous between sections, dense within data
     · Sub-150ms motion, transform/opacity only
   ═══════════════════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  /* ── Surfaces — 4-step off-black ladder ────────────────────── */
  --bg:         oklch(0.135 0.006 260);
  --surface:    oklch(0.180 0.007 260);
  --surface-2:  oklch(0.225 0.008 260);
  --surface-3:  oklch(0.270 0.009 260);

  /* Legacy aliases mapped to the ladder */
  --raised:     oklch(0.225 0.008 260);
  --sunken:     oklch(0.108 0.006 260);

  /* ── Borders — white hairlines ─────────────────────────────── */
  --rule:       oklch(1 0 0 / 0.06);
  --rule-2:     oklch(1 0 0 / 0.10);
  --rule-3:     oklch(1 0 0 / 0.14);

  /* ── Text — 4-step muted ramp, never pure white ─────────────── */
  --ink:        oklch(0.945 0.003 260);
  --ink-2:      oklch(0.720 0.008 260);
  --ink-3:      oklch(0.545 0.010 260);
  --ink-4:      oklch(0.410 0.012 260);

  /* ── Accent — warm brass (the only color) ──────────────────── */
  --accent:      oklch(0.780 0.095 78);
  --accent-2:    oklch(0.830 0.100 78);
  --accent-dim:  oklch(0.780 0.095 78 / 0.14);
  --accent-soft: oklch(0.780 0.095 78 / 0.06);

  /* ── CTA — same brass, slightly bolder ─────────────────────── */
  --mark:      oklch(0.820 0.105 78);
  --mark-2:    oklch(0.870 0.110 78);
  --mark-dim:  oklch(0.820 0.105 78 / 0.15);

  /* ── Semantic — desaturated ────────────────────────────────── */
  --good:      oklch(0.740 0.110 155);
  --good-dim:  oklch(0.740 0.110 155 / 0.14);
  --warn:      oklch(0.790 0.110 75);
  --warn-dim:  oklch(0.790 0.110 75 / 0.14);
  --danger:    oklch(0.700 0.130 25);
  --danger-dim: oklch(0.700 0.130 25 / 0.14);

  /* ── Sidebar — recessed (dimmer than content) ──────────────── */
  --sidebar-bg:      oklch(0.108 0.005 260);
  --sidebar-surface: oklch(0.165 0.006 260);
  --sidebar-hover:   oklch(0.220 0.007 260);
  --sidebar-active:  oklch(0.255 0.008 260);
  --sidebar-ink:     oklch(0.945 0.003 260);
  --sidebar-ink-2:   oklch(0.650 0.008 260);
  --sidebar-ink-3:   oklch(0.460 0.010 260);
  --sidebar-rule:    oklch(1 0 0 / 0.05);
  --sidebar-accent:  oklch(0.780 0.095 78);

  /* ── Fonts ─────────────────────────────────────────────────── */
  --sans:  'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --serif: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  --mono:  'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
}

/* ═══════════════════════════════════════════════════════════════
   BASE
   ═══════════════════════════════════════════════════════════════ */
html, body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
}
* { border-color: var(--rule); }

/* ═══════════════════════════════════════════════════════════════
   TYPOGRAPHY
   Space Grotesk for display, Inter for UI, JetBrains Mono for data.
   ═══════════════════════════════════════════════════════════════ */
h1.title {
  font-family: var(--serif);
  font-weight: 600;
  letter-spacing: -0.028em;
  color: var(--ink);
}
h1.title .soft {
  font-family: var(--serif);
  font-weight: 400;
  color: var(--ink-3);
  font-style: normal;
  margin-left: 10px;
}

.crumbs {
  color: var(--ink-3);
  font-weight: 500;
}
.crumbs b {
  color: var(--ink-4);
  font-weight: 400;
}
.lede {
  color: var(--ink-2);
}

.sec-title {
  font-family: var(--serif);
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.012em;
}
.sec-note {
  color: var(--ink-3);
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR — recessed chrome
   Sidebar is DIMMER than the content area. Standard Linear move.
   ═══════════════════════════════════════════════════════════════ */
.side {
  background: var(--sidebar-bg);
  color: var(--sidebar-ink);
  border-right: 1px solid var(--sidebar-rule);
}
.side-brand {
  border-bottom-color: var(--sidebar-rule);
}
.side-brand.as-button:hover {
  background: var(--sidebar-hover);
}
.side .logo-name {
  color: var(--sidebar-ink);
  font-family: var(--serif);
  font-weight: 600;
  letter-spacing: -0.01em;
}
.side .logo-name span {
  color: var(--sidebar-ink-3);
  font-weight: 400;
}
.side .logo-mark {
  /* color fills the SVG's rounded square (via currentColor). */
  color: var(--sidebar-accent);
  /* --mark-fg is the ink of the V inside the square. */
  --mark-fg: oklch(0.180 0.010 250);
}
.side .logo-mark svg {
  filter: drop-shadow(0 0 12px oklch(0.780 0.095 78 / 0.15));
}
.side .side-label,
.side .side-group-label {
  color: var(--sidebar-ink-3);
  font-weight: 600;
  letter-spacing: 0.08em;
}
.side-nav { padding: 0 12px; }
.side-nav-group { margin-bottom: 16px; }

.side .side-item {
  color: var(--sidebar-ink-2);
  position: relative;
  font-weight: 500;
}
.side .side-item:hover {
  background: var(--sidebar-hover);
  color: var(--sidebar-ink);
}
.side .side-item.on {
  background: var(--sidebar-active);
  color: var(--sidebar-ink);
  font-weight: 500;
}
.side .side-item.on::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 18px;
  background: var(--sidebar-accent);
  border-radius: 0 2px 2px 0;
}
.side .side-item .side-dot {
  width: 5px;
  height: 5px;
  background: var(--sidebar-ink-3);
  transition: background 140ms ease-out,
              transform 140ms ease-out,
              box-shadow 140ms ease-out;
}
.side .side-item:hover .side-dot {
  background: var(--sidebar-ink-2);
}
.side .side-item.on .side-dot {
  background: var(--sidebar-accent);
  transform: scale(1.35);
  box-shadow: 0 0 0 3px oklch(0.780 0.095 78 / 0.18);
}
.side .side-item .count {
  color: var(--sidebar-ink-3);
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
}
.side .side-item .count.alert {
  color: var(--sidebar-accent);
}
.side .side-foot {
  border-top-color: var(--sidebar-rule);
}
.side .side-foot .who {
  color: var(--sidebar-ink);
  font-weight: 500;
}
.side .side-foot .who small {
  color: var(--sidebar-ink-3);
  font-weight: 400;
}
.side .av {
  background: var(--sidebar-accent);
  color: var(--sidebar-bg);
  font-weight: 600;
}
.side .logout-btn {
  border-color: var(--sidebar-rule);
  color: var(--sidebar-ink-2);
}
.side .logout-btn:hover {
  color: var(--sidebar-accent);
  border-color: oklch(0.780 0.095 78 / 0.28);
  background: oklch(0.780 0.095 78 / 0.10);
}

/* ── Class switcher ────────────────────────────────────────── */
.side .cs-trigger {
  background: var(--sidebar-surface);
  border-color: var(--sidebar-rule);
  color: var(--sidebar-ink);
}
.side .cs-trigger:hover {
  background: var(--sidebar-hover);
  border-color: var(--rule-2);
}
.side .cs-trigger.open {
  border-color: oklch(0.780 0.095 78 / 0.35);
  background: var(--sidebar-hover);
}
.side .cs-subject {
  color: var(--sidebar-accent);
  font-weight: 600;
  letter-spacing: 0.06em;
}
.side .cs-name {
  color: var(--sidebar-ink);
  font-weight: 600;
}
.side .cs-count {
  color: var(--sidebar-ink-3);
}
.side .cs-chevron {
  color: var(--sidebar-ink-2);
}
.side .cs-menu {
  background: var(--sidebar-surface);
  border-color: var(--rule-2);
  box-shadow: 0 20px 48px oklch(0 0 0 / 0.55),
              0 0 0 1px oklch(1 0 0 / 0.02);
}
.side .cs-menu-label {
  color: var(--sidebar-ink-3);
  font-weight: 600;
  letter-spacing: 0.08em;
}
.side .cs-item {
  color: var(--sidebar-ink-2);
}
.side .cs-item:hover {
  background: var(--sidebar-hover);
  color: var(--sidebar-ink);
}
.side .cs-item.active {
  background: oklch(0.780 0.095 78 / 0.12);
}
.side .cs-item-mark {
  background: var(--sidebar-hover);
}
.side .cs-item-code {
  color: var(--sidebar-ink-2);
  font-family: var(--mono);
}
.side .cs-item.active .cs-item-mark {
  background: var(--sidebar-accent);
}
.side .cs-item.active .cs-item-code {
  color: var(--sidebar-bg);
}
.side .cs-item-name {
  color: var(--sidebar-ink);
}
.side .cs-item.active .cs-item-name {
  color: var(--sidebar-accent);
  font-weight: 600;
}
.side .cs-item-meta {
  color: var(--sidebar-ink-3);
}
.side .cs-menu-foot {
  border-top-color: var(--rule);
}
.side .cs-hint {
  color: var(--sidebar-ink-3);
}

/* ═══════════════════════════════════════════════════════════════
   KPI STRIP — hero typography, layered surfaces
   ═══════════════════════════════════════════════════════════════ */
.kpis {
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.kpis.kpis-fixed {
  align-items: stretch;
}
.kpis.kpis-fixed > .kpi {
  min-height: 0;
  padding: 26px 26px 24px;
  display: flex;
  flex-direction: column;
  background: transparent;
  border-right: 1px solid var(--rule);
  border-bottom: none;
  transition: background 140ms ease-out;
}
.kpis.kpis-fixed > .kpi:first-child { padding-left: 0; }
.kpis.kpis-fixed > .kpi:last-child  { border-right: none; }
.kpis.kpis-fixed > .kpi.kpi-clickable:hover {
  background: var(--surface);
}

.kpi-label {
  color: var(--ink-3);
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.kpi-num {
  font-family: var(--mono);
  font-weight: 500;
  font-size: 44px;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.kpi-num .pct,
.kpi-num .den {
  font-family: var(--sans);
  font-size: 15px;
  font-weight: 500;
  font-style: normal;
  color: var(--ink-3);
  margin-left: 6px;
  letter-spacing: 0;
  vertical-align: 6px;
}
.kpi-num.alert {
  color: var(--danger);
}
.kpi-sub {
  color: var(--ink-3);
  margin-top: 12px;
  font-size: 12.5px;
}
.kpi-spark {
  height: 32px;
  margin-top: 16px;
  opacity: 0.85;
}

/* ═══════════════════════════════════════════════════════════════
   CARDS & PANELS — surface-1 with lit top edge
   ═══════════════════════════════════════════════════════════════ */
.panel,
.chart-frame,
.course-card,
.qe-card,
.grade-item,
.feed-card,
.dp-card,
.skeleton-card,
.empty-state,
.admin-card {
  background: var(--surface);
  border: 1px solid var(--rule);
  box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.04);
}

.panel-title,
.chart-cap {
  color: var(--ink);
  font-family: var(--sans);
  font-weight: 600;
  letter-spacing: -0.005em;
}
.chart-desc {
  color: var(--ink-3);
  margin-bottom: 22px;
  line-height: 1.5;
}
.chart-frame {
  overflow: visible;
  padding: 24px 24px 28px;
}

/* ═══════════════════════════════════════════════════════════════
   BUTTONS
   ═══════════════════════════════════════════════════════════════ */
.btn {
  transition: background 140ms ease-out,
              border-color 140ms ease-out,
              transform 80ms ease-out;
}
.btn-solid {
  background: var(--mark);
  color: oklch(0.135 0.006 260);
  font-weight: 600;
}
.btn-solid:hover {
  background: var(--mark-2);
}
.btn-solid:disabled {
  background: var(--surface-2);
  color: var(--ink-4);
}

.btn-line {
  border-color: var(--rule-2);
  color: var(--ink);
  background: transparent;
}
.btn-line:hover {
  border-color: var(--rule-3);
  background: var(--surface);
}
.btn-text {
  color: var(--ink-2);
}
.btn-text:hover {
  color: var(--ink);
  background: var(--surface);
}
.btn-danger {
  background: var(--danger);
  color: oklch(0.135 0.006 260);
  font-weight: 600;
}
.btn-danger:hover {
  background: oklch(0.740 0.140 25);
}

/* ═══════════════════════════════════════════════════════════════
   TABLES
   ═══════════════════════════════════════════════════════════════ */
.dtable th,
.gr-table thead th {
  color: var(--ink-3);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 10.5px;
  border-bottom: 1px solid var(--rule);
  background: var(--bg);
}
.dtable td,
.gr-table tbody td {
  color: var(--ink-2);
  border-bottom: 1px solid var(--rule);
}
.dtable .nm,
.gr-table .col-student {
  color: var(--ink);
  font-weight: 500;
}
.dtable .num,
.gr-table .col-num {
  color: var(--ink);
  font-family: var(--mono);
  font-weight: 500;
}
.dtable tbody tr:hover td,
.gr-table tbody tr:hover {
  background: var(--surface);
}

/* ═══════════════════════════════════════════════════════════════
   FORMS
   ═══════════════════════════════════════════════════════════════ */
.fld label {
  color: var(--ink-3);
  font-weight: 500;
  letter-spacing: 0.02em;
}
.fld input,
.fld select,
.fld textarea,
.take-textarea,
.remark-input,
.qe-text,
.qe-textarea,
.disc-reply-input,
.topic-chips,
.rule-input {
  background: var(--sunken);
  border-color: var(--rule-2);
  color: var(--ink);
}
.fld input::placeholder,
.fld textarea::placeholder,
.take-textarea::placeholder {
  color: var(--ink-4);
}
.fld input:focus,
.fld select:focus,
.fld textarea:focus,
.take-textarea:focus,
.remark-input:focus,
.qe-text:focus,
.qe-textarea:focus,
.disc-reply-input:focus,
.topic-chips:focus-within {
  border-color: oklch(0.780 0.095 78 / 0.5);
  box-shadow: 0 0 0 3px oklch(0.780 0.095 78 / 0.12);
  background: var(--surface);
}

/* ═══════════════════════════════════════════════════════════════
   PILLS & TAGS
   ═══════════════════════════════════════════════════════════════ */
.pill {
  background: var(--surface-2);
  color: var(--ink-2);
  border: 1px solid var(--rule);
}
.pill.accent {
  background: oklch(0.780 0.095 78 / 0.10);
  color: var(--accent);
  border-color: oklch(0.780 0.095 78 / 0.20);
}
.pill.mark {
  background: oklch(0.700 0.130 25 / 0.12);
  color: var(--danger);
  border-color: oklch(0.700 0.130 25 / 0.22);
}
.pill.good {
  background: oklch(0.740 0.110 155 / 0.12);
  color: var(--good);
  border-color: oklch(0.740 0.110 155 / 0.22);
}
.pill.warn {
  background: oklch(0.790 0.110 75 / 0.12);
  color: var(--warn);
  border-color: oklch(0.790 0.110 75 / 0.22);
}

/* ═══════════════════════════════════════════════════════════════
   STATUS BADGES
   ═══════════════════════════════════════════════════════════════ */
.status-badge.pending {
  background: oklch(0.790 0.110 75 / 0.12);
  color: var(--warn);
}
.status-badge.reviewed {
  background: oklch(0.740 0.110 155 / 0.12);
  color: var(--good);
}
.status-badge.flagged {
  background: oklch(0.700 0.130 25 / 0.12);
  color: var(--danger);
}

/* ═══════════════════════════════════════════════════════════════
   FOCUS RINGS
   ═══════════════════════════════════════════════════════════════ */
:focus { outline: none; }
:focus-visible {
  outline: 2px solid oklch(0.780 0.095 78 / 0.7);
  outline-offset: 2px;
  border-radius: 4px;
}
.side-item:focus-visible {
  outline-color: var(--sidebar-accent);
  outline-offset: -2px;
}

/* ═══════════════════════════════════════════════════════════════
   MODALS
   ═══════════════════════════════════════════════════════════════ */
.modal-bg {
  background: oklch(0.05 0.005 260 / 0.7);
  backdrop-filter: blur(6px);
}
.modal {
  background: var(--surface);
  border: 1px solid var(--rule-2);
  box-shadow: 0 32px 64px oklch(0 0 0 / 0.5),
              inset 0 1px 0 oklch(1 0 0 / 0.05);
}
.modal-head,
.modal-foot {
  border-color: var(--rule);
}
.modal-head h2 {
  color: var(--ink);
  font-family: var(--serif);
  font-weight: 600;
  letter-spacing: -0.015em;
}
.modal-x {
  color: var(--ink-3);
}
.modal-x:hover { color: var(--ink); }

/* ═══════════════════════════════════════════════════════════════
   COMMAND PALETTE
   ═══════════════════════════════════════════════════════════════ */
.cmd-bg {
  background: oklch(0.05 0.005 260 / 0.7);
  backdrop-filter: blur(6px);
}
.cmd-palette {
  background: var(--surface);
  border: 1px solid var(--rule-2);
  box-shadow: 0 32px 64px oklch(0 0 0 / 0.55),
              inset 0 1px 0 oklch(1 0 0 / 0.05);
}
.cmd-input-row {
  border-bottom-color: var(--rule);
  color: var(--ink-3);
}
.cmd-input {
  color: var(--ink);
}
.cmd-input::placeholder { color: var(--ink-4); }
.cmd-kbd {
  background: var(--surface-2);
  border-color: var(--rule-2);
  color: var(--ink-3);
}
.cmd-section-title {
  color: var(--ink-3);
  letter-spacing: 0.08em;
}
.cmd-item {
  color: var(--ink-2);
}
.cmd-item:hover,
.cmd-item.active {
  background: var(--surface-2);
  color: var(--ink);
}
.cmd-item.active {
  border-left-color: var(--accent);
}
.cmd-item-icon {
  background: var(--surface-2);
  color: var(--ink-3);
}
.cmd-item.active .cmd-item-icon {
  background: oklch(0.780 0.095 78 / 0.14);
  color: var(--accent);
}
.cmd-item-hint { color: var(--ink-4); }
.cmd-footer {
  color: var(--ink-3);
  border-top-color: var(--rule);
}

/* ═══════════════════════════════════════════════════════════════
   TOASTS
   ═══════════════════════════════════════════════════════════════ */
.toast {
  background: var(--surface-2);
  border-color: var(--rule-2);
  color: var(--ink);
  box-shadow: 0 16px 40px oklch(0 0 0 / 0.5),
              inset 0 1px 0 oklch(1 0 0 / 0.05);
}
.toast-msg { color: var(--ink); }
.toast-close { color: var(--ink-3); }
.toast-close:hover { color: var(--ink); }
.toast-action { color: var(--accent); }

/* ═══════════════════════════════════════════════════════════════
   LOGIN
   ═══════════════════════════════════════════════════════════════ */
.login {
  background: var(--bg);
}
.login-left {
  background:
    radial-gradient(ellipse at 25% 15%, oklch(0.780 0.095 78 / 0.05), transparent 55%),
    radial-gradient(ellipse at 75% 85%, oklch(0.780 0.095 78 / 0.03), transparent 55%),
    var(--bg);
  border-right-color: var(--rule);
}
.login-right {
  background: var(--surface);
  border-left: 1px solid var(--rule);
}
.login-wordmark {
  color: var(--ink);
  font-family: var(--serif);
  font-weight: 500;
  letter-spacing: -0.03em;
}
.login-wordmark .cursor {
  background: var(--accent);
}
.login-tag {
  color: var(--ink-2);
  line-height: 1.55;
}
.login-form h2 {
  color: var(--ink);
  font-family: var(--serif);
  font-weight: 600;
  letter-spacing: -0.015em;
}
.login-form .sub { color: var(--ink-3); }
.role-btn {
  background: var(--surface);
  border-color: var(--rule-2);
}
.role-btn:hover {
  border-color: var(--rule-3);
  background: var(--surface-2);
}
.role-btn.on {
  border-color: oklch(0.780 0.095 78 / 0.5);
  background: oklch(0.780 0.095 78 / 0.08);
  box-shadow: 0 0 0 3px oklch(0.780 0.095 78 / 0.10);
}
.role-btn .rt {
  color: var(--ink);
  font-family: var(--serif);
  font-weight: 600;
}
.role-btn.on .rt {
  color: var(--accent);
}
.role-btn .rs { color: var(--ink-3); }

/* ═══════════════════════════════════════════════════════════════
   MISC — media, discussions, misc
   ═══════════════════════════════════════════════════════════════ */
.video-poster,
.file-card {
  background: var(--surface);
  border-color: var(--rule);
}
.video-poster:hover {
  border-color: oklch(0.780 0.095 78 / 0.35);
}
.file-card:hover {
  border-color: var(--rule-2);
  background: var(--surface-2);
}

.disc-thread {
  background: var(--surface);
  border-color: var(--rule);
  box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.03);
}
.disc-reply-text {
  background: var(--surface-2);
  border-color: var(--rule);
}
.disc-reply.teacher .disc-reply-text {
  background: oklch(0.780 0.095 78 / 0.06);
  border-color: oklch(0.780 0.095 78 / 0.20);
}
.disc-avatar {
  background: var(--surface-2);
  color: var(--ink-2);
}
.disc-avatar.teacher {
  background: oklch(0.780 0.095 78 / 0.14);
  color: var(--accent);
}

.draft-queued {
  background: oklch(0.790 0.110 75 / 0.10);
  border-color: oklch(0.790 0.110 75 / 0.25);
  color: var(--warn);
}
.draft-queued-spinner {
  border-color: var(--warn);
  border-top-color: transparent;
}

.qn-btn {
  background: var(--surface);
  border-color: var(--rule-2);
  color: var(--ink-3);
}
.qn-btn:hover {
  border-color: var(--rule-3);
  color: var(--ink);
}
.qn-btn.answered {
  background: oklch(0.740 0.110 155 / 0.12);
  border-color: oklch(0.740 0.110 155 / 0.5);
  color: var(--good);
}
.qn-btn.current {
  background: var(--accent);
  border-color: var(--accent);
  color: oklch(0.135 0.006 260);
  font-weight: 600;
}

/* Chart axis */
.dotplot-recharts .recharts-cartesian-axis-tick-value {
  fill: var(--ink-3);
}
.recharts-cartesian-grid line {
  stroke: var(--rule) !important;
}

/* Skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface) 0%,
    var(--surface-2) 40%,
    var(--surface) 80%
  );
  background-size: 200% 100%;
}

/* Empty state */
.empty-state {
  background: var(--surface);
  border-color: var(--rule);
}
.empty-state-title {
  color: var(--ink);
  font-family: var(--serif);
  font-weight: 600;
}
.empty-state-body { color: var(--ink-3); }
.empty-state-icon {
  background: var(--surface-2);
  color: var(--ink-3);
}

/* Confirm dialog */
.modal-confirm .confirm-icon.danger {
  background: oklch(0.700 0.130 25 / 0.12);
  color: var(--danger);
}
.modal-confirm .confirm-icon.default {
  background: oklch(0.780 0.095 78 / 0.12);
  color: var(--accent);
}
.modal-confirm .confirm-title { color: var(--ink); }
.modal-confirm .confirm-message { color: var(--ink-2); }

/* Drafts list */
.draft-row-actions .btn-text { color: var(--ink-2); }
.draft-row-actions .btn-text:hover { color: var(--ink); }

/* Class switcher chevron */
.cs-chevron { color: var(--ink-2); }

/* Overview split */
.overview-split { /* inherits */ }

/* Panels — small refinements */
.panel-title {
  color: var(--ink-3);
}

/* ═══════════════════════════════════════════════════════════════
   SCROLLBARS — subtle, matches theme
   ═══════════════════════════════════════════════════════════════ */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--rule-2);
  border-radius: 5px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--rule-3);
  background-clip: padding-box;
  border: 2px solid transparent;
}

/* ═══════════════════════════════════════════════════════════════
   PRINT
   ═══════════════════════════════════════════════════════════════ */
@media print {
  html, body { background: #fff !important; color: #111 !important; }
  .side {
    background: #fff !important;
    color: #111 !important;
    border-right-color: #ccc !important;
  }
  .side * {
    color: #111 !important;
    border-color: #ccc !important;
    background: transparent !important;
  }
}

/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .side .side-item .side-dot {
    transition: none !important;
  }
}
`;

export default themeLoveable;