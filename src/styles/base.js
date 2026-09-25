const styles = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Instrument+Serif:ital@0;1&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:#0F1115; --surface:#161920; --raised:#1C2029; --rule:#252A35; --rule-2:#333A47;
  --ink:#E4E4E1; --ink-2:#9A9A97; --ink-3:#62625F; --ink-4:#3A3A38;
  --accent:#5B9BD5; --accent-2:#7AB3E0; --accent-dim:rgba(91,155,213,0.10);
  --mark:#FF4D1C; --mark-dim:rgba(255,77,28,0.12);
  --good:#3DB87F; --good-dim:rgba(61,184,127,0.12);
  --warn:#D9A63E; --warn-dim:rgba(217,166,62,0.12);

  --sans:'Instrument Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --serif:'Instrument Serif', Georgia, 'Times New Roman', serif;
}

html,body,#root { height:100%; }
body {
  font-family:var(--sans);
  font-size:14px;
  line-height:1.5;
  color:var(--ink);
  background:var(--bg);
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  font-feature-settings:"ss01","cv11";
}

/* ─── Shell ──────────────────────────────────── */
.shell { display:grid; grid-template-columns:220px 1fr; min-height:100vh; }
.side { background:var(--bg); border-right:1px solid var(--rule); padding:20px 0;
  display:flex; flex-direction:column; position:sticky; top:0; height:100vh; }
.side-brand { padding:0 20px 22px; display:flex; align-items:center; gap:10px;
  border-bottom:1px solid var(--rule); margin-bottom:16px; }
.side-brand.as-button { background:transparent; border:none; cursor:pointer;
  text-align:left; width:100%; font-family:inherit;
  transition:background 120ms ease-out; border-bottom:1px solid var(--rule); }
.side-brand.as-button:hover { background:var(--surface); }
.logo-mark { width:28px; height:28px; display:inline-grid; place-items:center; color:var(--mark); --mark-fg: #17120B; flex-shrink:0; }
.logo-name { font-family:var(--serif); font-size:22px; font-weight:400; letter-spacing:-0.01em; color:var(--ink); }
.logo-name span { color:var(--ink-3); font-style:italic; font-size:16px; }
.side-group { padding:0 12px; margin-bottom:20px; }
.side-label { font-family:var(--sans); font-size:11px; font-weight:500;
  color:var(--ink-4); padding:0 8px 8px; letter-spacing:0.01em; }
.side-item { display:flex; align-items:center; gap:10px; padding:7px 8px; border-radius:5px; color:var(--ink-2);
  font-size:13.5px; cursor:pointer; border:none; background:transparent; width:100%; text-align:left;
  font-family:var(--sans); transition:background 100ms ease-out, color 100ms ease-out; }
.side-item:hover { background:var(--surface); color:var(--ink); }
.side-item.on { background:var(--surface); color:var(--ink); font-weight:500; }
.side-item.on .side-dot { background:var(--mark); }
.side-dot { width:4px; height:4px; border-radius:50%; background:var(--ink-4); flex-shrink:0; }
.side-item .count { margin-left:auto; font-family:var(--sans); font-size:11.5px; font-weight:500; color:var(--ink-3); font-variant-numeric:tabular-nums; }
.side-item .count.alert { color:var(--mark); font-weight:600; }
.side-foot { margin-top:auto; padding:14px 20px 0; border-top:1px solid var(--rule); display:flex; align-items:center; gap:10px; }
.av { width:28px; height:28px; border-radius:6px; background:var(--raised); display:grid; place-items:center;
  font-family:var(--sans); font-size:11px; font-weight:600; color:var(--ink-2); flex-shrink:0; }
.side-foot .who { font-size:12px; line-height:1.35; }
.side-foot .who small { color:var(--ink-3); font-size:11px; }
.logout-btn { width:28px; height:28px; border-radius:6px;
  border:1px solid var(--rule-2); background:transparent;
  color:var(--ink-3); cursor:pointer;
  display:grid; place-items:center;
  transition:all 120ms ease-out; flex-shrink:0; }
.logout-btn:hover { color:var(--mark); border-color:var(--mark-dim); background:var(--mark-dim); }

/* ─── Main ────────────────────────────────────── */
.main { min-height:100vh; overflow-y:auto; }
.main-pad { max-width:1240px; padding:40px 48px 80px; }
.crumbs { font-family:var(--sans); font-size:12px; font-weight:500;
  color:var(--ink-3); margin-bottom:16px;
  display:flex; align-items:center; gap:8px; }
.crumbs b { color:var(--ink-2); font-weight:400; }

h1.title {
  font-family:var(--sans);
  font-size:32px;
  font-weight:600;
  letter-spacing:-0.025em;
  line-height:1.1;
  color:var(--ink);
}
h1.title .soft { color:var(--ink-3); font-weight:400; }

.lede {
  font-family:var(--sans);
  color:var(--ink-2);
  font-size:15px;
  margin-top:10px;
  max-width:640px;
  line-height:1.6;
}

/* ─── Connection ──────────────────────────────── */
.conn { display:inline-flex; align-items:center; gap:7px; font-family:var(--sans); font-size:11px;
  font-weight:500; color:var(--ink-3); padding:4px 10px;
  border-radius:4px; border:1px solid var(--rule); }
.conn .beacon { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.conn.live .beacon    { background:var(--good);  box-shadow:0 0 0 3px var(--good-dim);  animation:beacon 2.4s ease-in-out infinite; }
.conn.polling .beacon { background:var(--accent);box-shadow:0 0 0 3px var(--accent-dim);animation:beacon 1.2s ease-in-out infinite; }
.conn.retry .beacon   { background:var(--warn);  box-shadow:0 0 0 3px var(--warn-dim);  animation:spin 1.5s linear infinite; border-radius:2px; }
.conn.down .beacon    { background:var(--mark);  box-shadow:0 0 0 3px var(--mark-dim); }
@keyframes beacon { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
@keyframes spin   { to{transform:rotate(360deg);} }

/* ─── KPIs ────────────────────────────────────── */
.kpis { display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid var(--rule-2); border-bottom:1px solid var(--rule); margin:28px 0 0; }
.kpi { padding:22px 24px 22px 0; border-right:1px solid var(--rule); }
.kpi:last-child { border-right:none; }
.kpi:not(:first-child) { padding-left:24px; }
.kpi-label {
  font-family:var(--sans);
  font-size:11.5px;
  font-weight:500;
  color:var(--ink-3);
  margin-bottom:12px;
}
.kpi-num {
  font-family:var(--serif);
  font-size:44px;
  font-weight:400;
  letter-spacing:-0.025em;
  line-height:1;
  color:var(--ink);
  font-variant-numeric:tabular-nums;
}
.kpi-num .den { font-size:20px; color:var(--ink-3); font-weight:400; font-style:italic; }
.kpi-num .pct { font-size:22px; color:var(--ink-3); font-weight:400; margin-left:2px; font-style:italic; }
.kpi-num.alert { color:var(--mark); }
.kpi-sub { font-family:var(--sans); font-size:12.5px; color:var(--ink-3); margin-top:10px; line-height:1.4; }
.kpi-spark { margin-top:10px; height:22px; }

/* ─── Section ────────────────────────────────── */
.sec { margin-top:44px; }
.sec-head { display:flex; align-items:baseline; justify-content:space-between; padding-bottom:14px; border-bottom:1px solid var(--rule-2); margin-bottom:22px; }
.sec-title {
  font-family:var(--sans);
  font-size:15px;
  font-weight:600;
  letter-spacing:-0.01em;
  color:var(--ink);
}
.sec-note {
  font-family:var(--sans);
  font-size:11.5px;
  font-weight:500;
  color:var(--ink-3);
}

/* ─── Analysis block ──────────────────────────── */
.analysis { display:grid; grid-template-columns:1fr 320px; gap:36px; align-items:start; }
.finding { font-family:var(--sans); font-size:14.5px; line-height:1.65; color:var(--ink-2); }
.finding + .finding { margin-top:16px; }
.finding strong { color:var(--ink); font-weight:600; }
.finding .flag { color:var(--mark); font-weight:600; }
.finding .ok { color:var(--good); font-weight:600; }

/* ─── Small multiples ─────────────────────────── */
.sm-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(140px,1fr)); gap:1px; background:var(--rule); border:1px solid var(--rule); border-radius:6px; overflow:hidden; }
.sm-cell { background:var(--surface); padding:16px 16px 12px; }
.sm-cell:hover { background:var(--raised); }
.sm-topic { font-family:var(--sans); font-size:11.5px; font-weight:500; color:var(--ink-2); line-height:1.35; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sm-val { font-family:var(--serif); font-size:24px; font-weight:400; color:var(--ink); letter-spacing:-0.02em; font-variant-numeric:tabular-nums; }
.sm-val.weak { color:var(--mark); } .sm-val.mid { color:var(--warn); }
.sm-chart { height:34px; margin-top:8px; }

/* ─── Dot plot ────────────────────────────────── */
.dotplot { padding:8px 0; }
.dp-row { display:grid; grid-template-columns:160px 1fr 56px; align-items:center; gap:18px; padding:8px 0; }
.dp-label { font-family:var(--sans); font-size:13px; color:var(--ink-2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.dp-track { position:relative; height:18px; }
.dp-axis { position:absolute; top:50%; left:0; right:0; height:1px; background:var(--rule); }
.dp-tick { position:absolute; top:0; bottom:0; width:1px; background:var(--rule); }
.dp-dot { position:absolute; top:50%; width:10px; height:10px; border-radius:50%; transform:translate(-50%,-50%); transition:left 600ms cubic-bezier(0.2,0,0,1); }
.dp-dot.weak { background:var(--mark); } .dp-dot.mid { background:var(--warn); } .dp-dot.ok { background:var(--good); }
.dp-val { font-family:var(--sans); font-size:13px; color:var(--ink); text-align:right; font-variant-numeric:tabular-nums; font-weight:500; }
.dp-scale { display:grid; grid-template-columns:160px 1fr 56px; gap:18px; margin-top:6px; }
.dp-scale-mid { grid-column:2; display:flex; justify-content:space-between; font-family:var(--sans); font-size:10.5px; color:var(--ink-4); }

/* ─── Chart frame ─────────────────────────────── */
.chart-frame { background:var(--surface); border:1px solid var(--rule); border-radius:6px; padding:24px 24px 18px; }
.chart-cap { font-family:var(--sans); font-size:13px; font-weight:600; color:var(--ink); margin-bottom:5px; }
.chart-desc { font-family:var(--sans); font-size:13px; color:var(--ink-3); margin-bottom:20px; line-height:1.5; }
.chart-pair { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

/* ─── Rows ────────────────────────────────────── */
.rowlist { border-top:1px solid var(--rule-2); }
.rowitem { display:grid; align-items:center; gap:20px; padding:16px 4px 16px 0; border-bottom:1px solid var(--rule); cursor:pointer; transition:background 100ms ease-out; }
.rowitem:hover { background:var(--surface); }
.rowitem:hover .rowgo { color:var(--accent); transform:translateX(3px); }
.rowname { font-family:var(--sans); font-size:15px; font-weight:500; color:var(--ink); letter-spacing:-0.005em; }
.rowname small { display:block; font-family:var(--sans); font-size:12.5px; color:var(--ink-3); font-weight:400; margin-top:3px; letter-spacing:0; }
.rowmeta { font-family:var(--sans); font-size:12.5px; color:var(--ink-2); text-align:right; font-variant-numeric:tabular-nums; line-height:1.45; }
.rowmeta b { color:var(--ink); font-weight:600; }
.rowgo { font-family:var(--sans); font-size:14px; color:var(--ink-4); transition:color 120ms ease-out, transform 120ms ease-out; }

/* ─── Table ───────────────────────────────────── */
.dtable { width:100%; border-collapse:collapse; }
.dtable th {
  font-family:var(--sans);
  font-size:11.5px;
  font-weight:600;
  color:var(--ink-3);
  text-align:left;
  padding:10px 12px;
  border-bottom:1px solid var(--rule-2);
}
.dtable td { padding:14px 12px; border-bottom:1px solid var(--rule); font-family:var(--sans); font-size:13.5px; color:var(--ink-2); }
.dtable tbody tr:hover td { background:var(--surface); }
.dtable .num { font-family:var(--sans); text-align:right; font-variant-numeric:tabular-nums; font-weight:500; color:var(--ink); }
.dtable .nm { color:var(--ink); font-weight:500; }

/* ─── Pills ───────────────────────────────────── */
.pill { display:inline-flex; align-items:center; gap:5px;
  font-family:var(--sans); font-size:11.5px; font-weight:500;
  padding:3px 9px; border-radius:4px; background:var(--raised); color:var(--ink-2); white-space:nowrap; }
.pill.mark { background:var(--mark-dim); color:var(--mark); }
.pill.good { background:var(--good-dim); color:var(--good); }
.pill.accent { background:var(--accent-dim); color:var(--accent); }
.pill.warn { background:var(--warn-dim); color:var(--warn); }

/* ─── Buttons ─────────────────────────────────── */
.btn { font-family:var(--sans); font-size:13.5px; font-weight:500; padding:10px 18px; border-radius:6px;
  border:1px solid transparent; cursor:pointer; display:inline-flex; align-items:center; gap:7px;
  transition:background 100ms ease-out, border-color 100ms ease-out, transform 80ms ease-out; line-height:1; }
.btn:active { transform:scale(0.975); }
.btn-solid { background:var(--mark); color:#0F1115; font-weight:600; }
.btn-solid:hover { background:#FF6033; }
.btn-solid:disabled { background:var(--ink-4); color:var(--ink-3); cursor:not-allowed; }
.btn-line { background:transparent; color:var(--ink); border-color:var(--rule-2); }
.btn-line:hover { border-color:var(--ink-3); background:var(--surface); }
.btn-text { background:transparent; color:var(--ink-2); padding:8px 12px; }
.btn-text:hover { color:var(--ink); background:var(--surface); }
.btn-sm { padding:6px 11px; font-size:12.5px; }

/* ─── Login ───────────────────────────────────── */
.login { min-height:100vh; display:grid; grid-template-columns:1.15fr 1fr; background:var(--bg); }
.login-left { padding:48px 56px; display:flex; flex-direction:column; justify-content:space-between; border-right:1px solid var(--rule); position:relative; overflow:hidden; }
.login-left::before { content:''; position:absolute; top:-140px; left:-140px; width:520px; height:520px; border-radius:50%; background:radial-gradient(circle, rgba(255,77,28,0.05) 0%, transparent 70%); pointer-events:none; }
.login-wordmark {
  font-family:var(--sans);
  font-size:64px;
  font-weight:600;
  letter-spacing:-0.035em;
  line-height:1;
  color:var(--ink);
  position:relative; z-index:1;
}
.login-wordmark .cursor { display:inline-block; width:5px; height:52px; background:var(--mark); vertical-align:-6px; margin-left:8px; animation:blink 1.1s steps(2) infinite; }
@keyframes blink { 50% { opacity:0; } }
.login-tag { margin-top:28px; font-family:var(--sans); font-size:16.5px; color:var(--ink-2); max-width:460px; line-height:1.6; }
.login-meta { font-family:var(--sans); font-size:11.5px; font-weight:500; color:var(--ink-3); position:relative; z-index:1; }
.login-right { padding:48px 56px; display:flex; align-items:center; justify-content:center; background:var(--surface); }
.login-form { width:100%; max-width:380px; }
.login-form h2 { font-family:var(--sans); font-size:26px; font-weight:600; letter-spacing:-0.02em; margin-bottom:6px; }
.login-form .sub { font-family:var(--sans); color:var(--ink-3); font-size:13.5px; margin-bottom:30px; }
.role-select { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:24px; }
.role-btn { padding:13px 12px; border:1px solid var(--rule-2); border-radius:6px; background:transparent; cursor:pointer; text-align:left; font-family:var(--sans); transition:all 100ms ease-out; }
.role-btn:hover { border-color:var(--ink-3); }
.role-btn.on { border-color:var(--accent); background:var(--accent-dim); }
.role-btn .rt { font-family:var(--sans); font-size:14px; font-weight:500; color:var(--ink); }
.role-btn .rs { font-family:var(--sans); font-size:11.5px; color:var(--ink-3); margin-top:3px; }
.role-btn.on .rt { color:var(--accent); }

.fld { margin-bottom:16px; }
.fld label {
  display:block;
  font-family:var(--sans);
  font-size:12px;
  font-weight:500;
  color:var(--ink-3);
  margin-bottom:7px;
}
.fld input, .fld select { width:100%; font-family:var(--sans); font-size:14.5px; padding:11px 13px; background:var(--bg); border:1px solid var(--rule-2); border-radius:6px; color:var(--ink); outline:none; transition:border-color 120ms ease-out, box-shadow 120ms ease-out; }
.fld input:focus, .fld select:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
.login-foot { font-family:var(--sans); font-size:11.5px; font-weight:500; color:var(--ink-4); margin-top:22px; text-align:center; }

/* ─── Utility ─────────────────────────────────── */
.stack { display:flex; flex-direction:column; gap:10px; }
.hstack { display:flex; align-items:center; gap:10px; }
.mono { font-family:var(--sans); font-variant-numeric:tabular-nums; }
.dim { color:var(--ink-3); }
.empty { padding:48px 24px; text-align:center; color:var(--ink-3); font-size:14px; }

/* ─── Field textarea (proper treatment) ──────── */
.field-textarea {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field-textarea-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.field-textarea-head label {
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink);
}
.field-textarea-counter {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ink-4);
  font-variant-numeric: tabular-nums;
}
.field-textarea-counter.warn { color: var(--warn); }
.field-textarea-counter.full { color: var(--mark); }
.field-textarea textarea {
  width: 100%;
  min-height: 96px;
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.55;
  padding: 12px 14px;
  background: var(--bg);
  border: 1px solid var(--rule-2);
  border-radius: 6px;
  color: var(--ink);
  resize: vertical;
  outline: none;
  transition: border-color 120ms ease-out, box-shadow 120ms ease-out;
}
.field-textarea textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.field-textarea textarea::placeholder { color: var(--ink-4); }
.field-textarea-hint {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--ink-3);
  line-height: 1.5;
}
.field-quick {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding-top: 2px;
}
.field-quick-chip {
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 20px;
  border: 1px dashed var(--rule-2);
  background: transparent;
  color: var(--ink-2);
  cursor: pointer;
  transition: all 120ms ease-out;
}
.field-quick-chip:hover { border-style: solid; border-color: var(--ink-3); color: var(--ink); }
.field-quick-chip.on { background: var(--accent-dim); border: 1px solid var(--accent); color: var(--accent); }

/* ─── Upload ──────────────────────────────────── */
.up-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:32px; margin-top:32px; align-items:start; }
.dropzone { border:1.5px dashed var(--rule-2); border-radius:8px; padding:48px 32px; text-align:center; background:var(--surface); cursor:pointer; transition:all 160ms ease-out; }
.dropzone:hover, .dropzone.over { border-color:var(--accent); background:var(--accent-dim); }
.dropzone .dz-icon { width:40px; height:40px; margin:0 auto 16px; color:var(--accent); }
.dropzone h3 { font-family:var(--sans); font-size:18px; font-weight:600; color:var(--ink); margin-bottom:6px; letter-spacing:-0.015em; }
.dropzone p { font-family:var(--sans); color:var(--ink-2); font-size:13.5px; }
.dz-formats { margin-top:20px; display:flex; gap:6px; justify-content:center; flex-wrap:wrap; }
.file-row { display:grid; grid-template-columns:34px 1fr auto; align-items:center; gap:14px; padding:14px 4px; border-bottom:1px solid var(--rule); }
.file-row:first-child { border-top:1px solid var(--rule-2); margin-top:22px; }
.file-tag { width:34px; height:34px; border-radius:6px; display:grid; place-items:center; font-family:var(--sans); font-size:10px; font-weight:700; letter-spacing:0.02em; }
.file-tag.pdf { background:var(--mark-dim); color:var(--mark); }
.file-tag.img { background:var(--accent-dim); color:var(--accent); }
.file-tag.txt { background:var(--warn-dim); color:var(--warn); }
.file-tag.scan { background:rgba(217,166,62,0.12); color:var(--warn); }
.file-name { font-family:var(--sans); font-size:14px; color:var(--ink); }
.file-name small { display:block; font-family:var(--sans); font-size:12px; color:var(--ink-3); margin-top:2px; }
.file-status { font-family:var(--sans); font-size:11.5px; font-weight:500; color:var(--ink-3); }
.file-status.done { color:var(--good); }
.file-status.working { color:var(--accent); }
.file-status.wait { color:var(--ink-3); }
.bar { height:2px; background:var(--rule); border-radius:2px; overflow:hidden; margin-top:6px; }
.bar::after { content:''; display:block; height:100%; width:30%; background:var(--accent); animation:slide 1.4s ease-in-out infinite; }
@keyframes slide { 0% { transform:translateX(-100%); } 100% { transform:translateX(400%); } }
.topic-line { display:grid; grid-template-columns:1fr auto auto; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--rule); font-family:var(--sans); font-size:14px; }
.topic-line:last-child { border-bottom:none; }
.topic-line .t-name { color:var(--ink); }
.topic-line .t-count { font-family:var(--sans); font-size:12px; color:var(--ink-3); font-variant-numeric:tabular-nums; }
.topic-line .t-bar { width:52px; height:4px; background:var(--rule); border-radius:2px; overflow:hidden; }
.topic-line .t-bar span { display:block; height:100%; background:var(--accent); }

/* ─── Generate ────────────────────────────────── */
.gen-grid { display:grid; grid-template-columns:360px 1fr; gap:44px; margin-top:36px; align-items:start; }
.panel { background:var(--surface); border:1px solid var(--rule); border-radius:8px; padding:24px; }
.panel-title { font-family:var(--sans); font-size:13px; font-weight:600; color:var(--ink); margin-bottom:22px; padding-bottom:14px; border-bottom:1px solid var(--rule); letter-spacing:-0.005em; }
.rule-row { margin-bottom:24px; }
.rule-row:last-child { margin-bottom:0; }
.rule-label { font-family:var(--sans); font-size:13.5px; font-weight:500; color:var(--ink); margin-bottom:11px; display:flex; justify-content:space-between; align-items:baseline; }
.rule-label .val { font-family:var(--sans); font-size:12.5px; font-weight:500; color:var(--accent); font-variant-numeric:tabular-nums; }
.chip-row { display:flex; gap:6px; flex-wrap:wrap; }
.chip { font-family:var(--sans); font-size:12.5px; font-weight:500; padding:6px 12px; border-radius:6px; border:1px solid var(--rule-2); background:transparent; color:var(--ink-2); cursor:pointer; transition:all 100ms ease-out; }
.chip:hover { border-color:var(--ink-3); }
.chip.on { background:var(--accent); color:#0F1115; border-color:var(--accent); font-weight:600; }

.q-list { display:flex; flex-direction:column; gap:12px; }
.q-card { background:var(--surface); border:1px solid var(--rule); border-radius:8px; padding:22px 24px; opacity:0; transform:translateY(6px); animation:qin 460ms cubic-bezier(0.2,0,0,1) forwards; position:relative; }
@keyframes qin { to { opacity:1; transform:none; } }
.q-card:hover { border-color:var(--rule-2); }
.q-head { display:flex; align-items:center; gap:10px; margin-bottom:14px; font-family:var(--sans); font-size:11.5px; font-weight:600; color:var(--ink-3); }
.q-num { color:var(--accent); font-weight:600; font-variant-numeric:tabular-nums; }
.q-actions { margin-left:auto; display:flex; gap:4px; }
.q-act { font-family:var(--sans); font-size:11px; font-weight:500; padding:4px 8px; border-radius:4px; border:1px solid var(--rule-2); background:transparent; color:var(--ink-3); cursor:pointer; }
.q-act:hover { color:var(--ink); border-color:var(--ink-3); }
.q-text { font-family:var(--serif); font-size:21px; font-weight:400; line-height:1.4; color:var(--ink); letter-spacing:-0.005em; }
.q-opts { margin-top:16px; display:grid; grid-template-columns:1fr 1fr; gap:6px; }
.q-opt { padding:10px 13px; background:var(--bg); border:1px solid var(--rule); border-radius:6px; font-family:var(--sans); font-size:13.5px; color:var(--ink-2); display:flex; gap:10px; align-items:baseline; }
.q-opt .letter { font-family:var(--sans); font-size:11.5px; font-weight:600; color:var(--ink-3); }
.q-meta { margin-top:16px; display:flex; gap:6px; flex-wrap:wrap; align-items:center; }

/* ─── Stepper ─────────────────────────────────── */
.stepper { display:inline-flex; align-items:stretch; border:1px solid var(--rule-2); border-radius:6px; background:var(--bg); overflow:hidden; height:40px; }
.stepper-btn { width:40px; display:grid; place-items:center; background:transparent; border:none; color:var(--ink-2); cursor:pointer; transition:background 100ms ease-out, color 100ms ease-out; }
.stepper-btn:hover:not(:disabled) { background:var(--raised); color:var(--ink); }
.stepper-btn:active:not(:disabled) { background:var(--rule); }
.stepper-btn:disabled { color:var(--ink-4); cursor:not-allowed; }
.stepper-input { width:68px; text-align:center; background:transparent; border:none; border-left:1px solid var(--rule); border-right:1px solid var(--rule); color:var(--ink); font-family:var(--sans); font-size:15px; font-weight:500; outline:none; font-variant-numeric:tabular-nums; }
.stepper-input:focus { background:var(--surface); }
.stepper-suffix { display:grid; place-items:center; padding:0 14px; font-family:var(--sans); font-size:12.5px; font-weight:500; color:var(--ink-3); border-left:1px solid var(--rule); background:var(--surface); }

/* ─── Topic input ─────────────────────────────── */
.topic-input { position:relative; }
.topic-chips { display:flex; flex-wrap:wrap; gap:6px; align-items:center; min-height:46px; padding:7px 10px; background:var(--bg); border:1px solid var(--rule-2); border-radius:6px; transition:border-color 120ms ease-out, box-shadow 120ms ease-out; cursor:text; }
.topic-chips:focus-within { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
.topic-chip { display:inline-flex; align-items:center; gap:4px; font-family:var(--sans); font-size:12.5px; font-weight:500; padding:3px 4px 3px 10px; border-radius:5px; background:var(--accent-dim); color:var(--accent); animation:chippop 200ms cubic-bezier(0.2,0,0,1); }
@keyframes chippop { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:none; } }
.topic-chip button { background:transparent; border:none; color:inherit; cursor:pointer; font-size:15px; line-height:1; padding:0 4px; opacity:0.65; transition:opacity 100ms ease-out; }
.topic-chip button:hover { opacity:1; }
.topic-field { flex:1; min-width:140px; background:transparent; border:none; outline:none; color:var(--ink); font-family:var(--sans); font-size:13.5px; padding:4px; }
.topic-field::placeholder { color:var(--ink-4); }
.topic-suggest { position:absolute; top:calc(100% + 4px); left:0; right:0; background:var(--raised); border:1px solid var(--rule-2); border-radius:8px; padding:5px; z-index:20; box-shadow:0 12px 32px rgba(0,0,0,0.5); max-height:240px; overflow-y:auto; animation:qin 180ms cubic-bezier(0.2,0,0,1); }
.topic-suggest-item { display:flex; justify-content:space-between; align-items:center; gap:12px; width:100%; padding:9px 11px; background:transparent; border:none; border-radius:5px; color:var(--ink-2); font-family:var(--sans); font-size:13.5px; text-align:left; cursor:pointer; transition:background 80ms ease-out, color 80ms ease-out; }
.topic-suggest-item:hover { background:var(--surface); color:var(--ink); }
.topic-suggest-meta { font-family:var(--sans); font-size:11.5px; color:var(--ink-3); font-variant-numeric:tabular-nums; flex-shrink:0; }
.topic-suggest-new { border-top:1px solid var(--rule); margin-top:3px; padding-top:11px; color:var(--accent); }
.topic-suggest-new .topic-suggest-meta { color:var(--accent); }
.topic-hint { font-family:var(--sans); font-size:11.5px; color:var(--ink-4); margin-top:7px; }

/* ─── Take test ───────────────────────────────── */
.take { min-height:100vh; display:flex; flex-direction:column; background:var(--bg); }
.take-bar { border-bottom:1px solid var(--rule); padding:16px 36px; display:flex; align-items:center; justify-content:space-between; background:var(--surface); }
.take-bar .left { display:flex; align-items:center; gap:14px; }
.take-bar .test-name { font-family:var(--sans); font-size:15px; font-weight:600; color:var(--ink); letter-spacing:-0.01em; }
.timer { font-family:var(--sans); font-size:20px; font-weight:600; color:var(--ink); font-variant-numeric:tabular-nums; letter-spacing:0.01em; }
.timer.warn { color:var(--mark); }
.anti-bar { display:flex; align-items:center; gap:10px; font-family:var(--sans); font-size:11.5px; font-weight:500; color:var(--ink-3); }
.anti-ind { display:flex; align-items:center; gap:6px; padding:4px 9px; border-radius:4px; border:1px solid var(--rule); }
.anti-ind .dot { width:5px; height:5px; border-radius:50%; background:var(--good); }
.anti-ind.warn .dot { background:var(--mark); }
.anti-ind.warn { border-color:var(--mark-dim); color:var(--mark); }
.take-body { flex:1; display:flex; align-items:flex-start; justify-content:center; padding:64px 32px; }
.take-inner { max-width:680px; width:100%; }
.take-progress { display:flex; gap:3px; margin-bottom:40px; }
.take-progress span { flex:1; height:3px; border-radius:2px; background:var(--rule); }
.take-progress span.on { background:var(--accent); }
.take-progress span.done { background:var(--ink-3); }
.take-q-label { font-family:var(--sans); font-size:12px; font-weight:500; color:var(--ink-3); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; }
.take-q { font-family:var(--serif); font-size:32px; font-weight:400; line-height:1.3; letter-spacing:-0.015em; color:var(--ink); margin-bottom:36px; }
.take-options { display:flex; flex-direction:column; gap:8px; }
.take-opt { padding:18px 22px; border:1px solid var(--rule-2); border-radius:8px; background:var(--surface); cursor:pointer; display:flex; gap:16px; align-items:center; font-family:var(--sans); font-size:15px; color:var(--ink); transition:all 100ms ease-out; text-align:left; width:100%; }
.take-opt:hover { border-color:var(--ink-3); }
.take-opt.on { border-color:var(--accent); background:var(--accent-dim); }
.take-opt .letter { width:26px; height:26px; border-radius:50%; background:var(--raised); display:grid; place-items:center; font-family:var(--sans); font-size:12px; font-weight:600; flex-shrink:0; transition:all 100ms ease-out; }
.take-opt.on .letter { background:var(--accent); color:#0F1115; }
.take-foot { margin-top:40px; display:flex; justify-content:space-between; align-items:center; }
.take-textarea { width:100%; font-family:var(--sans); font-size:15px; line-height:1.6; padding:16px 18px; background:var(--surface); border:1px solid var(--rule-2); border-radius:8px; color:var(--ink); outline:none; resize:vertical; min-height:180px; }
.take-textarea:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
.stop-banner { background:var(--mark-dim); border:1px solid var(--mark); border-radius:8px; padding:16px 20px; margin-bottom:28px; color:var(--mark); font-family:var(--sans); font-size:14px; font-weight:500; display:flex; align-items:center; gap:10px; }

/* ─── Grade review ────────────────────────────── */
.gr-filter-bar {
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  align-items:center;
  padding:14px 0;
  border-bottom:1px solid var(--rule);
  margin-bottom:0;
  position:sticky;
  top:0;
  background:var(--bg);
  z-index:10;
}
.gr-search {
  flex:1;
  min-width:220px;
  display:flex;
  align-items:center;
  gap:8px;
  padding:8px 12px;
  background:var(--surface);
  border:1px solid var(--rule-2);
  border-radius:6px;
  transition:border-color 120ms ease-out, box-shadow 120ms ease-out;
}
.gr-search:focus-within { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
.gr-search svg { color:var(--ink-3); flex-shrink:0; }
.gr-search input { flex:1; background:transparent; border:none; outline:none; color:var(--ink); font-family:var(--sans); font-size:13.5px; }
.gr-search input::placeholder { color:var(--ink-4); }

.gr-filter-chip {
  font-family:var(--sans);
  font-size:12.5px;
  font-weight:500;
  padding:7px 13px;
  border-radius:6px;
  border:1px solid var(--rule-2);
  background:transparent;
  color:var(--ink-2);
  cursor:pointer;
  transition:all 100ms ease-out;
  display:inline-flex;
  align-items:center;
  gap:6px;
  white-space:nowrap;
}
.gr-filter-chip:hover { border-color:var(--ink-3); color:var(--ink); }
.gr-filter-chip.on { background:var(--accent); color:#0F1115; border-color:var(--accent); font-weight:600; }
.gr-filter-chip .fc-count {
  font-family:var(--sans);
  font-size:11px;
  font-weight:600;
  font-variant-numeric:tabular-nums;
  opacity:0.75;
}

.gr-progress {
  display:flex;
  align-items:center;
  gap:12px;
  margin-left:auto;
  font-family:var(--sans);
  font-size:12px;
  font-weight:500;
  color:var(--ink-3);
}
.gr-progress-track { width:100px; height:4px; background:var(--rule); border-radius:2px; overflow:hidden; }
.gr-progress-fill { height:100%; background:var(--good); border-radius:2px; transition:width 400ms cubic-bezier(0.2,0,0,1); }

.gr-table-wrap { overflow:visible; }
.gr-table { width:100%; border-collapse:collapse; }
.gr-table thead th {
  font-family:var(--sans);
  font-size:11.5px;
  font-weight:600;
  color:var(--ink-3);
  text-align:left;
  padding:11px 14px;
  border-bottom:1px solid var(--rule-2);
  background:var(--bg);
  position:sticky;
  top:0;
  z-index:5;
  cursor:pointer;
  user-select:none;
  transition:color 100ms ease-out;
  white-space:nowrap;
}
.gr-table thead th:hover { color:var(--ink); }
.gr-table thead th .sort-arrow { margin-left:4px; font-size:10px; opacity:0.5; }
.gr-table thead th.sorted .sort-arrow { opacity:1; color:var(--accent); }
.gr-table tbody tr { cursor:pointer; transition:background 80ms ease-out; }
.gr-table tbody tr:hover { background:var(--surface); }
.gr-table tbody tr.selected { background:var(--surface); }
.gr-table tbody td { padding:14px; border-bottom:1px solid var(--rule); font-family:var(--sans); font-size:13.5px; color:var(--ink-2); vertical-align:middle; }
.gr-table .col-student { font-weight:500; color:var(--ink); }
.gr-table .col-num { font-variant-numeric:tabular-nums; text-align:right; font-weight:500; color:var(--ink); }

.conf-dot { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:7px; vertical-align:middle; flex-shrink:0; }
.conf-dot.high { background:var(--good); box-shadow:0 0 0 3px var(--good-dim); }
.conf-dot.med  { background:var(--warn); box-shadow:0 0 0 3px var(--warn-dim); }
.conf-dot.low  { background:var(--mark); box-shadow:0 0 0 3px var(--mark-dim); }

.status-badge { display:inline-flex; align-items:center; gap:5px; font-family:var(--sans); font-size:11.5px; font-weight:500; padding:3px 9px; border-radius:4px; white-space:nowrap; }
.status-badge.pending  { background:var(--warn-dim); color:var(--warn); }
.status-badge.reviewed { background:var(--good-dim); color:var(--good); }
.status-badge.flagged  { background:var(--mark-dim); color:var(--mark); }

.gr-detail {
  padding:28px 48px 32px;
  border-bottom:1px solid var(--rule);
  animation:qin 300ms cubic-bezier(0.2,0,0,1);
  background:var(--surface);
  margin:0 -48px;
}
.gr-detail-inner { max-width:1000px; }
.gr-detail-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:22px; gap:20px; }
.gr-detail-student { font-family:var(--sans); font-size:20px; font-weight:600; color:var(--ink); letter-spacing:-0.015em; }
.gr-detail-meta { font-family:var(--sans); font-size:12.5px; color:var(--ink-3); margin-top:4px; display:flex; gap:14px; flex-wrap:wrap; }
.gr-detail-meta span { display:flex; align-items:center; gap:5px; }

.gr-answer-block { margin-bottom:20px; }
.gr-answer-label { font-family:var(--sans); font-size:11.5px; font-weight:600; color:var(--ink-3); margin-bottom:8px; }
.gr-answer-question { font-family:var(--sans); font-size:15px; font-weight:500; line-height:1.5; color:var(--ink-2); margin-bottom:16px; }
.gr-answer-text { background:var(--bg); border-left:3px solid var(--accent); border-radius:4px; padding:16px 20px; font-family:var(--serif); font-size:17px; line-height:1.55; color:var(--ink); }
.gr-answer-text.correct { border-left-color:var(--good); }
.gr-answer-text.wrong   { border-left-color:var(--mark); }

.gr-score-row { display:grid; grid-template-columns:160px 1fr auto; gap:20px; align-items:center; padding:18px 0; border-top:1px solid var(--rule); margin-top:18px; }
.gr-score-label { font-family:var(--sans); font-size:12.5px; font-weight:500; color:var(--ink-3); }
.gr-score-input-group { display:flex; align-items:center; gap:10px; }
.gr-score-input { font-family:var(--sans); font-size:18px; font-weight:600; padding:8px 14px; width:88px; text-align:center; background:var(--bg); border:1px solid var(--rule-2); border-radius:6px; color:var(--ink); font-variant-numeric:tabular-nums; }
.gr-score-input:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
.gr-score-max { font-family:var(--sans); font-size:14px; color:var(--ink-3); font-variant-numeric:tabular-nums; }

.gr-rubric { margin-top:18px; padding:16px 18px; background:var(--bg); border:1px solid var(--rule); border-radius:6px; }
.gr-rubric-title { font-family:var(--sans); font-size:11.5px; font-weight:600; color:var(--ink-3); margin-bottom:12px; }
.gr-rubric-item { display:flex; justify-content:space-between; align-items:center; padding:7px 0; font-family:var(--sans); font-size:13px; color:var(--ink-2); border-bottom:1px solid var(--rule); }
.gr-rubric-item:last-child { border-bottom:none; }
.gr-rubric-item .ri-score { font-family:var(--sans); font-size:12.5px; font-weight:500; color:var(--ink); font-variant-numeric:tabular-nums; }

.gr-actions { display:flex; gap:10px; margin-top:24px; padding-top:20px; border-top:1px solid var(--rule); }

.remark-input { width:100%; font-family:var(--sans); font-size:13.5px; padding:10px 13px; background:var(--bg); border:1px solid var(--rule-2); border-radius:6px; color:var(--ink); resize:vertical; min-height:56px; line-height:1.5; }
.remark-input:focus { outline:none; border-color:var(--accent); }

/* ─── Manual grading mode ─────────────────────── */
.mg-empty {
  padding: 72px 32px;
  text-align: center;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--surface);
}
.mg-empty-title {
  font-family: var(--sans);
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}
.mg-empty p {
  font-family: var(--sans);
  font-size: 14px;
  color: var(--ink-3);
  line-height: 1.6;
  max-width: 420px;
  margin: 0 auto;
}

/* ─── Modal ───────────────────────────────────── */
.modal-bg { position:fixed; inset:0; background:rgba(0,0,0,0.65); display:grid; place-items:center; z-index:100; padding:20px; animation:fadein 160ms ease-out; }
@keyframes fadein { from { opacity:0; } to { opacity:1; } }
.modal { background:var(--surface); border:1px solid var(--rule-2); border-radius:12px; width:100%; max-width:480px; animation:qin 220ms cubic-bezier(0.2,0,0,1); }
.modal-lg { max-width:720px; }
.modal-head { padding:22px 26px; border-bottom:1px solid var(--rule); display:flex; align-items:center; justify-content:space-between; }
.modal-head h2 { font-family:var(--sans); font-size:18px; font-weight:600; letter-spacing:-0.015em; }
.modal-x { background:transparent; border:none; color:var(--ink-3); font-size:24px; line-height:1; cursor:pointer; padding:0 4px; }
.modal-x:hover { color:var(--ink); }
.modal-body { padding:26px; }
.modal-foot { padding:18px 26px; border-top:1px solid var(--rule); display:flex; justify-content:flex-end; gap:8px; }

/* ─── Extracted text review (7.3) ─────────────── */
.xr-file {
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--bg);
  margin-bottom: 14px;
  overflow: hidden;
}
.xr-file-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--rule);
  background: var(--surface);
}
.xr-file-name {
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink);
}
.xr-file-meta {
  font-family: var(--sans);
  font-size: 11.5px;
  color: var(--ink-3);
  margin-top: 2px;
}
.xr-file-quality {
  margin-left: auto;
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}
.xr-file-quality .q-dot { width: 6px; height: 6px; border-radius: 50%; }
.xr-file-quality.high .q-dot { background: var(--good); }
.xr-file-quality.med  .q-dot { background: var(--warn); }
.xr-file-quality.low  .q-dot { background: var(--mark); }
.xr-file-quality.high { color: var(--good); }
.xr-file-quality.med  { color: var(--warn); }
.xr-file-quality.low  { color: var(--mark); }
.xr-file-body {
  padding: 16px;
}
.xr-file-body textarea {
  width: 100%;
  min-height: 140px;
  font-family: var(--serif);
  font-size: 15px;
  line-height: 1.6;
  padding: 12px 14px;
  background: var(--bg);
  border: 1px solid var(--rule-2);
  border-radius: 6px;
  color: var(--ink);
  resize: vertical;
  outline: none;
  transition: border-color 120ms ease-out;
}
.xr-file-body textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }

.xr-note {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 16px;
  background: var(--accent-dim);
  border: 1px solid var(--accent);
  border-radius: 6px;
  margin-bottom: 20px;
  font-family: var(--sans);
  font-size: 12.5px;
  color: var(--accent);
  line-height: 1.55;
}
.xr-note strong { font-weight: 600; }

/* ─── LMS ─────────────────────────────────────── */
.course-card { background:var(--surface); border:1px solid var(--rule); border-radius:8px; padding:24px; margin-bottom:14px; }
.lesson-list { margin-top:20px; border-top:1px solid var(--rule); }
.lesson-row { display:flex; align-items:center; gap:14px; padding:14px 0; border-bottom:1px solid var(--rule); }
.lesson-row:last-child { border-bottom:none; }
.lesson-icon { width:28px; height:28px; border-radius:6px; display:grid; place-items:center; flex-shrink:0; font-size:13px; font-family:var(--sans); font-weight:600; }
.lesson-icon.text  { background:var(--accent-dim); color:var(--accent); }
.lesson-icon.video { background:var(--mark-dim);   color:var(--mark); }
.lesson-icon.file  { background:var(--warn-dim);   color:var(--warn); }

/* ─── Question bank ───────────────────────────── */
.qb-select {
  font-family:var(--sans);
  font-size:12.5px;
  font-weight:500;
  padding:8px 10px;
  background:var(--surface);
  border:1px solid var(--rule-2);
  border-radius:6px;
  color:var(--ink);
  cursor:pointer;
  outline:none;
  transition:border-color 120ms ease-out;
}
.qb-select:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
.qb-bulk-bar {
  display:flex;
  align-items:center;
  gap:14px;
  padding:12px 16px;
  background:var(--accent-dim);
  border:1px solid var(--accent);
  border-radius:6px;
  margin-top:16px;
  font-family:var(--sans);
  font-size:13px;
  font-weight:500;
  color:var(--accent);
  animation:toast-in 200ms cubic-bezier(0.2, 0, 0, 1);
}
.qb-bulk-bar .btn-solid { background:var(--accent); color:#0F1115; }
.qb-bulk-bar .btn-solid:hover { background:var(--accent-2); }

.gr-table input[type="checkbox"] {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid var(--rule-2);
  border-radius: 3px;
  background: var(--bg);
  cursor: pointer;
  position: relative;
  transition: all 100ms ease-out;
  vertical-align: middle;
}
.gr-table input[type="checkbox"]:hover { border-color: var(--ink-3); }
.gr-table input[type="checkbox"]:checked { background: var(--accent); border-color: var(--accent); }
.gr-table input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 4px; top: 1px;
  width: 4px; height: 8px;
  border: solid #0F1115;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* ─── Toasts ──────────────────────────────────── */
.toast-viewport {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 200;
  max-width: 380px;
  pointer-events: none;
}
.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--raised);
  border: 1px solid var(--rule-2);
  border-left-width: 3px;
  border-radius: 8px;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.4;
  box-shadow: 0 12px 32px rgba(0,0,0,0.45);
  animation: toast-in 240ms cubic-bezier(0.2, 0, 0, 1);
}
.toast-success { border-left-color: var(--good); }
.toast-error   { border-left-color: var(--mark); }
.toast-info    { border-left-color: var(--accent); }
.toast-icon { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; }
.toast-success .toast-icon { background: var(--good-dim); color: var(--good); }
.toast-error   .toast-icon { background: var(--mark-dim); color: var(--mark); }
.toast-info    .toast-icon { background: var(--accent-dim); color: var(--accent); }
.toast-msg { flex: 1; }
.toast-action {
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--accent);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  transition: background 100ms ease-out;
}
.toast-action:hover { background: var(--accent-dim); }
.toast-close {
  background: transparent; border: none; color: var(--ink-3);
  font-size: 18px; line-height: 1; cursor: pointer; padding: 0 4px; flex-shrink: 0;
}
.toast-close:hover { color: var(--ink); }
@keyframes toast-in {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to   { opacity: 1; transform: none; }
}

/* ─── Print ───────────────────────────────────── */
@media print {
  html, body, #root, .shell, .main, .main-pad { height:auto !important; overflow:visible !important; background:#fff !important; position:static !important; color:#111 !important; }
  .side, .no-print, .conn, .btn { display:none !important; }
  .print-only { display:block !important; }
  .main-pad { padding:0 !important; max-width:100% !important; }
  .kpis, .chart-frame, .sm-grid, .rowlist, .dtable { break-inside:avoid; }
  .chart-frame, .sm-cell, .kpi { background:#fff !important; border-color:#ccc !important; }
  .sm-grid { background:#ccc !important; }
  .print-header { display:block !important; border-bottom:2px solid #111; padding-bottom:12px; margin-bottom:24px; }
  .print-header h1 { font-family:'Instrument Sans', sans-serif; font-size:22px; font-weight:600; }
  .print-header .meta { font-family:'Instrument Sans', sans-serif; font-size:10px; color:#666; margin-top:4px; }
  .print-footer { display:block !important; margin-top:40px; padding-top:12px; border-top:1px solid #ccc; font-family:'Instrument Sans', sans-serif; font-size:9.5px; color:#888; }
  @page { size:A4 portrait; margin:18mm 15mm; }
  * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
}
.print-header, .print-footer, .print-only { display:none; }

/* ─── Responsive ──────────────────────────────── */
@media (max-width:860px) {
  .shell { grid-template-columns:1fr; } .side { display:none; }
  .login { grid-template-columns:1fr; }
  .login-left { padding:36px 28px; border-right:none; border-bottom:1px solid var(--rule); }
  .login-right { padding:36px 28px; }
  .login-wordmark { font-size:44px; }
  .main-pad { padding:28px 20px 64px; }
  .kpis { grid-template-columns:1fr 1fr; }
  .kpi { padding:18px 18px 18px 0; border-bottom:1px solid var(--rule); }
  .kpi:nth-child(even) { border-right:none; }
  .kpi:nth-child(odd) { border-right:1px solid var(--rule); }
  .analysis, .chart-pair, .up-grid, .gen-grid { grid-template-columns:1fr; }
  h1.title { font-size:26px; }
  .dp-row, .dp-scale { grid-template-columns:110px 1fr 48px; }
  .gr-filter-bar { flex-direction:column; align-items:stretch; }
  .gr-filter-chip { justify-content:center; }
  .gr-progress { margin-left:0; justify-content:center; }
  .gr-detail { margin:0 -20px; padding:24px 20px; }
  .gr-score-row { grid-template-columns:1fr; gap:12px; }
  .gr-table { font-size:12px; }
  .gr-table thead th, .gr-table tbody td { padding:10px 8px; }
  .toast-viewport { right: 12px; left: 12px; bottom: 12px; max-width: none; }
  .qb-select { width: 100%; }
}

/* ─── Stop-test overlay ─────────────────────────── */
.stop-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 17, 21, 0.92);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 500;
  animation: fadein 220ms ease-out;
  padding: 24px;
}
.stop-overlay-card {
  background: var(--surface);
  border: 1px solid var(--rule-2);
  border-top: 3px solid var(--mark);
  border-radius: 12px;
  padding: 40px 36px 32px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  animation: qin 320ms cubic-bezier(0.2, 0, 0, 1);
}
.stop-overlay-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--mark-dim);
  color: var(--mark);
  display: grid;
  place-items: center;
  margin: 0 auto 18px;
}
.stop-overlay-title {
  font-family: var(--sans);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-bottom: 10px;
}
.stop-overlay-body {
  font-family: var(--sans);
  font-size: 15px;
  color: var(--ink-2);
  line-height: 1.55;
  margin-bottom: 10px;
}
.stop-overlay-note {
  font-family: var(--sans);
  font-size: 13px;
  color: var(--ink-3);
  line-height: 1.55;
  margin-bottom: 24px;
}
.stop-overlay-count {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-3);
  margin-bottom: 16px;
}
.stop-overlay-num {
  font-family: var(--serif);
  font-size: 22px;
  color: var(--mark);
  font-weight: 500;
  margin: 0 3px;
  font-variant-numeric: tabular-nums;
}

/* ─── Question mix builder ─────────────────────── */
.qmb {
  border: 1px solid var(--rule-2);
  border-radius: 8px;
  background: var(--bg);
  overflow: hidden;
}
.qmb-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--rule);
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-2);
}
.qmb-total-badge {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
}
.qmb-total-badge.ok  { background: var(--good-dim); color: var(--good); }
.qmb-total-badge.off { background: var(--warn-dim); color: var(--warn); }
.qmb-list {
  display: flex;
  flex-direction: column;
}
.qmb-row {
  display: grid;
  grid-template-columns: 130px 1fr 52px 28px;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--rule);
  transition: background 100ms ease-out;
}
.qmb-row:hover { background: var(--surface); }
.qmb-row:last-child { border-bottom: none; }
.qmb-type { display: flex; flex-direction: column; gap: 2px; }
.qmb-type-short {
  font-family: var(--sans);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.02em;
}
.qmb-type-name {
  font-family: var(--sans);
  font-size: 12.5px;
  color: var(--ink-2);
}
.qmb-fields {
  display: flex;
  align-items: center;
  gap: 10px;
}
.qmb-stepper {
  display: inline-flex;
  align-items: stretch;
  border: 1px solid var(--rule-2);
  border-radius: 5px;
  background: var(--surface);
  height: 32px;
}
.qmb-step-btn {
  width: 28px;
  display: grid;
  place-items: center;
  background: transparent;
  border: none;
  color: var(--ink-2);
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: background 100ms ease-out, color 100ms ease-out;
}
.qmb-step-btn:hover:not(:disabled) { background: var(--raised); color: var(--ink); }
.qmb-step-btn:disabled { color: var(--ink-4); cursor: not-allowed; }
.qmb-step-input {
  width: 44px;
  text-align: center;
  background: transparent;
  border: none;
  border-left: 1px solid var(--rule);
  border-right: 1px solid var(--rule);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  outline: none;
  font-variant-numeric: tabular-nums;
}
.qmb-step-input:focus { background: var(--bg); }
.qmb-mult {
  font-family: var(--sans);
  font-size: 13px;
  color: var(--ink-4);
}
.qmb-marks-input {
  width: 44px;
  height: 32px;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--rule-2);
  border-radius: 5px;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  outline: none;
  font-variant-numeric: tabular-nums;
}
.qmb-marks-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.qmb-marks-label {
  font-family: var(--sans);
  font-size: 11.5px;
  color: var(--ink-3);
  white-space: nowrap;
}
.qmb-subtotal {
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.qmb-remove {
  background: transparent;
  border: none;
  color: var(--ink-4);
  font-size: 16px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 100ms ease-out, background 100ms ease-out;
}
.qmb-remove:hover { color: var(--mark); background: var(--mark-dim); }
.qmb-add {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 12px 14px;
  border-top: 1px solid var(--rule);
  background: var(--surface);
}
.qmb-add-label {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--ink-3);
  margin-right: 4px;
}
.qmb-target {
  padding: 10px 14px;
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 500;
  border-top: 1px solid var(--rule);
}
.qmb-target.ok  { background: var(--good-dim); color: var(--good); }
.qmb-target.off { background: var(--warn-dim); color: var(--warn); }

/* ─── Class detail ─────────────────────────────── */
.cd-header-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.cd-empty {
  padding: 56px 24px;
  text-align: center;
  color: var(--ink-3);
  font-family: var(--sans);
  font-size: 13.5px;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--surface);
  margin-top: 16px;
}
.cd-empty strong {
  display: block;
  font-size: 15px;
  color: var(--ink-2);
  font-weight: 600;
  margin-bottom: 6px;
}

/* ─── Responsive ───────────────────────────────── */
@media (max-width: 860px) {
  .qmb-row { grid-template-columns: 1fr 52px 28px; }
  .qmb-type { grid-column: 1 / -1; }
  .qmb-fields { grid-column: 1 / -1; }
  .stop-overlay-card { padding: 32px 24px 24px; }
}

/* ─── Full-width draft form ───────────────────── */
.draft-form {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.draft-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 10px;
  margin-top: 8px;
}
.draft-actions-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.draft-summary {
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}

.draft-queued {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: var(--warn-dim);
  border: 1px solid var(--warn);
  border-radius: 10px;
  color: var(--warn);
  font-family: var(--sans);
  font-size: 13.5px;
}
.draft-queued strong { font-weight: 600; }
.draft-queued-sub { font-size: 12.5px; opacity: 0.85; margin-top: 2px; }
.draft-queued-spinner {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid var(--warn);
  border-top-color: transparent;
  animation: spin 900ms linear infinite;
  flex-shrink: 0;
}

/* ─── Question editor cards ───────────────────── */
.qe-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.qe-card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 10px;
  padding: 20px 22px;
  transition: border-color 120ms ease-out;
}
.qe-card:focus-within { border-color: var(--rule-2); }

.qe-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.qe-head-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.qe-num {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.qe-type {
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ink-2);
}
.qe-head-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.qe-marks-field {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.qe-marks-input {
  width: 48px;
  height: 32px;
  text-align: center;
  background: var(--bg);
  border: 1px solid var(--rule-2);
  border-radius: 6px;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  font-variant-numeric: tabular-nums;
}
.qe-marks-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.qe-marks-label {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--ink-3);
}
.qe-actions {
  display: flex;
  gap: 4px;
}

.qe-text {
  width: 100%;
  min-height: 56px;
  font-family: var(--serif);
  font-size: 17px;
  line-height: 1.5;
  padding: 12px 14px;
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 8px;
  color: var(--ink);
  outline: none;
  resize: vertical;
  transition: border-color 120ms ease-out;
}
.qe-text:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }

/* MCQ options editor */
.qe-options { margin-top: 16px; }
.qe-options-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-3);
}
.qe-options-hint {
  font-size: 11.5px;
  font-weight: 400;
  color: var(--ink-4);
}
.qe-option {
  display: grid;
  grid-template-columns: 32px 26px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 8px;
  margin-bottom: 8px;
  transition: border-color 120ms ease-out, background 120ms ease-out;
}
.qe-option.correct {
  background: var(--good-dim);
  border-color: var(--good);
}
.qe-correct-radio {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--rule-2);
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
  transition: border-color 120ms ease-out;
}
.qe-option.correct .qe-correct-radio { border-color: var(--good); }
.qe-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  transition: background 120ms ease-out;
}
.qe-option.correct .qe-radio-dot { background: var(--good); }
.qe-option-letter {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-3);
  text-align: center;
}
.qe-option.correct .qe-option-letter { color: var(--good); }
.qe-option-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 14px;
  padding: 6px 0;
}
.qe-correct-badge {
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 600;
  color: var(--good);
  background: rgba(61,184,127,0.15);
  padding: 3px 8px;
  border-radius: 4px;
}
.qe-correct-note {
  font-family: var(--sans);
  font-size: 11.5px;
  color: var(--ink-4);
  margin-top: 10px;
  font-style: italic;
}

/* Written answer editor */
.qe-written { margin-top: 16px; display: flex; flex-direction: column; gap: 14px; }
.qe-field { display: flex; flex-direction: column; gap: 6px; }
.qe-field-label {
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-3);
}
.qe-textarea {
  width: 100%;
  min-height: 76px;
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.55;
  padding: 10px 12px;
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 8px;
  color: var(--ink);
  outline: none;
  resize: vertical;
  transition: border-color 120ms ease-out;
}
.qe-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.qe-rubric {
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 10px 14px;
}
.qe-rubric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--rule);
  font-family: var(--sans);
  font-size: 13px;
}
.qe-rubric-row:last-child { border-bottom: none; }
.qe-rubric-label { color: var(--ink-2); }
.qe-rubric-points {
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

/* Drafts list row actions */
.draft-row-actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 860px) {
  .draft-form { max-width: none; }
  .draft-actions-bar { flex-direction: column; align-items: stretch; }
  .draft-actions-right { flex-direction: column; align-items: stretch; }
  .draft-summary { text-align: center; }
  .qe-card { padding: 16px 16px; }
  .qe-option { grid-template-columns: 28px 22px 1fr auto; gap: 8px; padding: 8px 10px; }
  .qe-head { gap: 10px; }
  .qe-actions { width: 100%; justify-content: flex-end; }
}

/* ─── Interactive dot plot (Recharts) ──────────── */
.dotplot-recharts { position: relative; }
.dotplot-scale {
  display: flex;
  justify-content: space-between;
  padding: 4px 48px 0 168px;
  font-family: var(--sans);
  font-size: 10.5px;
  color: var(--ink-4);
  font-variant-numeric: tabular-nums;
}
.dot-tooltip {
  background: var(--raised);
  border: 1px solid var(--rule-2);
  border-radius: 8px;
  padding: 12px 14px;
  min-width: 200px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.5);
  font-family: var(--sans);
  pointer-events: auto;
}
.dot-tooltip-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--rule);
}
.dot-tooltip-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 3px 0;
  font-size: 12.5px;
}
.dot-tooltip-label { color: var(--ink-3); }
.dot-tooltip-value {
  font-weight: 600;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.dot-tooltip-value.weak { color: var(--mark); }
.dot-tooltip-value.mid  { color: var(--warn); }
.dot-tooltip-value.ok   { color: var(--good); }
.dot-tooltip-cta {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 7px 10px;
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 5px;
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 100ms ease-out;
}
.dot-tooltip-cta:hover { background: rgba(91,155,213,0.18); }

/* ─── Quick actions ────────────────────────────── */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 28px 0 0;
}
.quick-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  font-family: var(--sans);
  transition: border-color 120ms ease-out, background 120ms ease-out, transform 80ms ease-out;
}
.quick-action:hover {
  border-color: var(--rule-2);
  background: var(--raised);
}
.quick-action:active { transform: scale(0.98); }
.quick-action.primary {
  background: var(--mark);
  border-color: var(--mark);
  color: #0F1115;
}
.quick-action.primary:hover { background: #FF6033; border-color: #FF6033; }
.quick-action.primary .qa-title { color: #0F1115; }
.quick-action.primary .qa-sub { color: rgba(15,17,21,0.7); }
.quick-action.primary .qa-icon { background: rgba(15,17,21,0.15); color: #0F1115; }
.qa-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--raised);
  color: var(--ink-2);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.qa-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.qa-title {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.qa-sub {
  font-size: 11.5px;
  color: var(--ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Next action hero ─────────────────────────── */
.next-action {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--mark);
  border-radius: 10px;
  margin-top: 14px;
  animation: qin 260ms cubic-bezier(0.2, 0, 0, 1);
}
.next-action.done {
  border-left-color: var(--good);
}
.na-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--good-dim);
  color: var(--good);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.na-icon.alert {
  background: var(--mark-dim);
  color: var(--mark);
}
.na-text { flex: 1; min-width: 0; }
.na-title {
  font-family: var(--sans);
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.005em;
}
.na-sub {
  font-family: var(--sans);
  font-size: 12.5px;
  color: var(--ink-3);
  margin-top: 3px;
}

/* ─── KPI strip — fixed height, clickable ──────── */
.kpis.kpis-fixed {
  align-items: stretch;
}
.kpis.kpis-fixed > .kpi {
  display: flex;
  flex-direction: column;
  min-height: 148px;
  padding: 22px 24px 22px 0;
  background: transparent;
  border: none;
  border-right: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  cursor: pointer;
  text-align: left;
  font-family: var(--sans);
  color: inherit;
  transition: background 120ms ease-out;
}
.kpis.kpis-fixed > .kpi:first-child { padding-left: 0; }
.kpis.kpis-fixed > .kpi:not(:first-child) { padding-left: 24px; }
.kpis.kpis-fixed > .kpi:last-child { border-right: none; }
.kpis.kpis-fixed > .kpi.kpi-clickable:hover { background: var(--surface); }
.kpis.kpis-fixed > .kpi.kpi-clickable:active { background: var(--raised); }
.kpis.kpis-fixed .kpi-num { margin-top: 4px; }
.kpis.kpis-fixed .kpi-sub { margin-top: auto; }

/* Responsive */
@media (max-width: 1024px) {
  .quick-actions { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 860px) {
  .quick-actions { grid-template-columns: 1fr; gap: 8px; margin-top: 22px; }
  .quick-action { padding: 14px; }
  .next-action { flex-direction: column; align-items: flex-start; gap: 12px; }
  .next-action .btn { width: 100%; justify-content: center; }
  .kpis.kpis-fixed > .kpi { min-height: 130px; }
  .dotplot-scale { padding-left: 130px; padding-right: 32px; }
}
@media (max-width: 520px) {
  .dotplot-scale { display: none; }
}

/* ─── Video embed ──────────────────────────────── */
.video-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 10px;
  overflow: hidden;
  margin: 4px 0 16px;
}
.video-iframe iframe {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  border: 0;
}
.video-poster {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  cursor: pointer;
  border: 1px solid var(--rule);
  background:
    radial-gradient(circle at 50% 40%, rgba(91,155,213,0.10), transparent 60%),
    var(--bg);
  transition: border-color 140ms ease-out, background 140ms ease-out;
  font-family: var(--sans);
}
.video-poster:hover { border-color: var(--accent); }
.video-play-btn {
  width: 60px; height: 60px;
  border-radius: 50%;
  background: var(--accent);
  color: #0F1115;
  display: grid; place-items: center;
  padding-left: 4px;
  transition: transform 140ms ease-out;
}
.video-poster:hover .video-play-btn { transform: scale(1.06); }
.video-poster-meta { text-align: center; }
.video-poster-title {
  font-size: 15px; font-weight: 600;
  color: var(--ink);
  max-width: 80%;
  margin: 0 auto;
}
.video-poster-source {
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 4px;
}
.video-error {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px;
  color: var(--ink-3);
}
.video-error strong { color: var(--ink-2); font-size: 14px; }
.video-error p { font-size: 12.5px; margin-top: 3px; }

/* ─── File card ────────────────────────────────── */
.file-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 10px;
  text-decoration: none;
  transition: border-color 120ms ease-out, background 120ms ease-out;
  margin-bottom: 16px;
}
.file-card:hover { border-color: var(--rule-2); background: var(--surface); }
.file-card-icon {
  width: 40px; height: 40px;
  border-radius: 8px;
  display: grid; place-items: center;
  font-family: var(--sans);
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}
.file-card-text { flex: 1; min-width: 0; }
.file-card-name {
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.file-card-meta {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 2px;
}
.file-card-cta { color: var(--ink-3); flex-shrink: 0; transition: color 120ms ease-out; }
.file-card:hover .file-card-cta { color: var(--accent); }

/* ─── Lesson body ──────────────────────────────── */
.lesson-body {
  padding: 20px 0 24px;
  border-bottom: 1px solid var(--rule);
}
.lesson-text {
  font-family: var(--sans);
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--ink-2);
  max-width: 660px;
  margin-bottom: 20px;
}
.lesson-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* ─── Course switcher ──────────────────────────── */
.course-switch {
  display: flex;
  gap: 6px;
  margin-top: 24px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
}
.course-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid var(--rule-2);
  background: transparent;
  border-radius: 8px;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-2);
  cursor: pointer;
  white-space: nowrap;
  transition: all 120ms ease-out;
}
.course-tab:hover { border-color: var(--ink-3); color: var(--ink); }
.course-tab.on {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 600;
}
.course-tab-progress {
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 10px;
  background: var(--raised);
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
}
.course-tab.on .course-tab-progress {
  background: var(--accent);
  color: #0F1115;
}

/* ─── LMS progress band ────────────────────────── */
.lms-progress-band {
  margin-top: 24px;
  padding: 18px 20px;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 10px;
}
.lms-progress-bar {
  height: 6px;
  background: var(--rule);
  border-radius: 3px;
  overflow: hidden;
}
.lms-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--good));
  border-radius: 3px;
  transition: width 500ms cubic-bezier(0.2, 0, 0, 1);
}
.lms-progress-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  gap: 16px;
  flex-wrap: wrap;
  font-family: var(--sans);
  font-size: 13px;
  color: var(--ink-3);
}
.lms-progress-meta b { color: var(--ink); font-weight: 600; }
.lms-resume {
  background: transparent;
  border: none;
  color: var(--accent);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 120ms ease-out;
}
.lms-resume:hover { color: var(--accent-2); text-decoration: underline; }
.lms-complete-badge { color: var(--good); font-weight: 600; }

/* ─── Teacher LMS course card ──────────────────── */
.course-card-title {
  font-family: var(--sans);
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.course-card-meta {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 4px;
}
.lesson-title {
  font-family: var(--sans);
  font-size: 13.5px;
  color: var(--ink);
}
.lesson-meta {
  font-family: var(--sans);
  font-size: 11.5px;
  color: var(--ink-3);
  margin-top: 3px;
}
.lesson-meta a { color: var(--accent); text-decoration: none; }
.lesson-meta a:hover { text-decoration: underline; }
.lesson-progress {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
}
.lesson-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.fld-hint {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 6px;
  line-height: 1.5;
}

/* ─── Discussion board ─────────────────────────── */
.disc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.disc-thread {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 120ms ease-out;
}
.disc-thread:hover { border-color: var(--rule-2); }
.disc-thread.pinned { border-left: 3px solid var(--accent); }
.disc-thread.resolved { opacity: 0.72; }
.disc-thread.resolved .disc-title { text-decoration: line-through; text-decoration-color: var(--ink-4); }
.disc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  cursor: pointer;
  flex-wrap: wrap;
}
.disc-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}
.disc-head-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}
.disc-pin { font-size: 13px; }
.disc-title {
  font-family: var(--sans);
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.disc-author {
  display: flex;
  align-items: center;
  gap: 8px;
}
.disc-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--raised);
  color: var(--ink-2);
  display: grid; place-items: center;
  font-family: var(--sans);
  font-size: 10.5px; font-weight: 700;
  flex-shrink: 0;
}
.disc-avatar.teacher { background: var(--accent-dim); color: var(--accent); }
.disc-avatar.sm { width: 24px; height: 24px; font-size: 9.5px; }
.disc-author-meta {
  display: flex; flex-direction: column;
  font-family: var(--sans); font-size: 11.5px;
  line-height: 1.3;
}
.disc-author-meta b { color: var(--ink); font-weight: 600; font-size: 12px; }
.disc-author-meta span { color: var(--ink-3); }
.disc-replies-count {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ink-3);
  padding: 3px 9px;
  background: var(--bg);
  border-radius: 12px;
  white-space: nowrap;
}
.disc-body {
  padding: 0 20px 20px;
  border-top: 1px solid var(--rule);
  animation: qin 260ms cubic-bezier(0.2, 0, 0, 1);
}
.disc-op {
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.65;
  color: var(--ink-2);
  padding: 16px 0;
  max-width: 720px;
}
.disc-replies {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid var(--rule);
}
.disc-reply {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  position: relative;
}
.disc-reply.teacher { padding-left: 4px; }
.disc-reply-text {
  flex: 1;
  min-width: 0;
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 10px 14px;
}
.disc-reply.teacher .disc-reply-text {
  border-color: rgba(91,155,213,0.3);
  background: rgba(91,155,213,0.06);
}
.disc-reply-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}
.disc-reply-head b {
  font-family: var(--sans); font-size: 12.5px;
  color: var(--ink); font-weight: 600;
}
.disc-reply-time { font-size: 11px; color: var(--ink-4); margin-left: auto; }
.disc-reply-body {
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--ink-2);
}
.disc-delete {
  background: transparent; border: none;
  color: var(--ink-4); cursor: pointer;
  font-size: 16px; line-height: 1; padding: 0 4px;
  transition: color 100ms ease-out;
}
.disc-delete:hover { color: var(--mark); }
.disc-reply-box {
  border-top: 1px solid var(--rule);
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.disc-reply-input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--rule-2);
  border-radius: 8px;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.5;
  padding: 10px 12px;
  outline: none;
  resize: vertical;
  min-height: 56px;
}
.disc-reply-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.disc-reply-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.disc-rules {
  padding: 12px 16px;
  background: var(--warn-dim);
  border: 1px solid var(--warn);
  border-radius: 8px;
  color: var(--warn);
  font-family: var(--sans);
  font-size: 12.5px;
  line-height: 1.55;
  margin-top: 16px;
}
.disc-rules b { font-weight: 600; }

@media (max-width: 860px) {
  .disc-head { padding: 14px 16px; gap: 10px; }
  .disc-head-right { width: 100%; justify-content: space-between; }
  .disc-body { padding: 0 16px 16px; }
  .disc-op { font-size: 13.5px; padding: 14px 0; }
  .video-poster-title { font-size: 14px; }
  .course-switch { margin-left: -20px; margin-right: -20px; padding-left: 20px; padding-right: 20px; }
}

/* ─── Live activity feed ────────────────────────── */
.feed-card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 10px;
  overflow: hidden;
}
.feed-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--rule);
}
.feed-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
}
.feed-live-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--good);
  box-shadow: 0 0 0 3px var(--good-dim);
  animation: beacon 2.4s ease-in-out infinite;
}
.feed-meta {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ink-3);
}
.feed-list {
  list-style: none;
  padding: 6px 0;
}
.feed-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 18px;
  transition: background 100ms ease-out;
}
.feed-item:hover { background: var(--raised); }
.feed-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}
.feed-dot.accent { background: var(--accent); }
.feed-dot.good   { background: var(--good); }
.feed-dot.mark   { background: var(--mark); }
.feed-body { flex: 1; min-width: 0; }
.feed-text {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}
.feed-detail {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.feed-when {
  font-family: var(--sans);
  font-size: 11px;
  color: var(--ink-4);
  flex-shrink: 0;
  margin-top: 2px;
  font-variant-numeric: tabular-nums;
}

/* ─── Scope estimate card ───────────────────────── */
.scope-card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 10px;
  padding: 18px 20px;
}
.scope-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
}
.scope-title {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}
.scope-sub {
  font-family: var(--sans);
  font-size: 11.5px;
  color: var(--ink-3);
}
.scope-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  padding: 14px 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.scope-stat { min-width: 0; }
.scope-label {
  font-family: var(--sans);
  font-size: 11px;
  color: var(--ink-3);
  margin-bottom: 4px;
}
.scope-value {
  font-family: var(--serif);
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.scope-value.ok    { color: var(--ink); }
.scope-value.over  { color: var(--warn); }
.scope-value.under { color: var(--mark); }
.scope-value-sm {
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.005em;
}
.scope-target { color: var(--ink-3); font-size: 16px; font-weight: 400; }
.scope-unit { color: var(--ink-3); font-size: 15px; font-weight: 400; }
.scope-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  font-family: var(--sans);
  font-size: 12.5px;
  color: var(--ink-2);
  line-height: 1.5;
}
.scope-note svg { margin-top: 3px; flex-shrink: 0; color: var(--accent); }

/* ─── Grading detail panel ──────────────────────── */
.gd-panel {
  background: var(--surface);
  border-bottom: 1px solid var(--rule);
  padding: 26px 48px 30px;
  margin: 0 -48px;
  animation: qin 260ms cubic-bezier(0.2, 0, 0, 1);
}
.gd-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}
.gd-student {
  font-family: var(--sans);
  font-size: 20px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.015em;
}
.gd-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-family: var(--sans);
  font-size: 12.5px;
  color: var(--ink-3);
  margin-top: 4px;
}
.gd-question {
  padding: 16px 18px;
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 8px;
  margin-bottom: 20px;
}
.gd-question-label {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-3);
  margin-bottom: 6px;
}
.gd-question-text {
  font-family: var(--serif);
  font-size: 17px;
  line-height: 1.5;
  color: var(--ink-2);
}
.gd-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.gd-col {
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 16px 18px;
  min-width: 0;
}
.gd-col-head {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-3);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.gd-col-head-ai { color: var(--accent); }
.gd-answer {
  font-family: var(--serif);
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink);
}
.gd-verdicts {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gd-verdict {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: var(--sans);
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--ink-2);
}
.gd-verdict-icon {
  width: 18px; height: 18px;
  border-radius: 4px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}
.gd-verdict.pass .gd-verdict-icon   { background: var(--good-dim); color: var(--good); }
.gd-verdict.partial .gd-verdict-icon { background: var(--warn-dim); color: var(--warn); }
.gd-verdict.fail .gd-verdict-icon   { background: var(--mark-dim); color: var(--mark); }
.gd-verdict.fail .gd-verdict-label   { color: var(--mark); }
.gd-verdict.pass .gd-verdict-label   { color: var(--ink); }
.gd-ai-just {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--rule);
  font-family: var(--sans);
  font-size: 12px;
  color: var(--ink-3);
  line-height: 1.5;
  font-style: italic;
}
.gd-override {
  padding: 16px 18px;
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 8px;
  margin-bottom: 14px;
}
.gd-override-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.gd-override-title {
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-2);
}
.gd-override-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.gd-score-input {
  font-family: var(--sans);
  font-size: 18px;
  font-weight: 600;
  padding: 8px 14px;
  width: 84px;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--rule-2);
  border-radius: 6px;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  outline: none;
}
.gd-score-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.gd-score-max {
  font-family: var(--sans);
  font-size: 14px;
  color: var(--ink-3);
}
.gd-score-bar {
  flex: 1;
  height: 6px;
  background: var(--rule);
  border-radius: 3px;
  overflow: hidden;
}
.gd-score-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--good));
  border-radius: 3px;
  transition: width 300ms cubic-bezier(0.2, 0, 0, 1);
}
.gd-remark {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--rule-2);
  border-radius: 6px;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13.5px;
  line-height: 1.55;
  padding: 11px 13px;
  outline: none;
  resize: vertical;
  margin-bottom: 14px;
}
.gd-remark:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.gd-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--rule);
  flex-wrap: wrap;
}
.gd-actions-right {
  display: flex;
  gap: 8px;
}

/* ─── Question navigator ────────────────────────── */
.qn-wrap { display: flex; flex-direction: column; gap: 10px; }
.qn-label {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-3);
}
.qn-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.qn-btn {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  border: 1px solid var(--rule-2);
  background: transparent;
  color: var(--ink-3);
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 120ms ease-out;
  font-variant-numeric: tabular-nums;
}
.qn-btn:hover { border-color: var(--ink-3); color: var(--ink); }
.qn-btn.answered { background: var(--good-dim); border-color: var(--good); color: var(--good); }
.qn-btn.current  { background: var(--accent); border-color: var(--accent); color: #0F1115; }
.qn-legend {
  display: flex;
  gap: 14px;
  font-family: var(--sans);
  font-size: 11.5px;
  color: var(--ink-3);
  flex-wrap: wrap;
}
.qn-legend span { display: flex; align-items: center; gap: 5px; }
.qn-legend-dot {
  width: 8px; height: 8px;
  border-radius: 3px;
  background: var(--rule-2);
}
.qn-legend-dot.current { background: var(--accent); }
.qn-legend-dot.answered { background: var(--good); }

/* ─── Auto-save indicator ───────────────────────── */
.autosave {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ink-3);
  transition: color 200ms ease-out;
}
.autosave.saved { color: var(--good); }
.autosave svg { flex-shrink: 0; }

/* ─── Module grouping ───────────────────────────── */
.module-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: transparent;
  border: none;
  border-top: 1px solid var(--rule);
  cursor: pointer;
  text-align: left;
  font-family: var(--sans);
  transition: background 100ms ease-out;
}
.module-head:first-of-type { border-top: none; }
.module-head:hover { background: var(--raised); }
.module-head.open { background: var(--surface); }
.module-chevron {
  color: var(--ink-3);
  font-size: 12px;
  width: 14px;
  flex-shrink: 0;
}
.module-title {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.005em;
}
.module-count {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ink-3);
  flex-shrink: 0;
}
.module-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.module-progress-bar {
  width: 60px;
  height: 4px;
  background: var(--rule);
  border-radius: 2px;
  overflow: hidden;
}
.module-progress-fill {
  display: block;
  height: 100%;
  background: var(--good);
  border-radius: 2px;
  transition: width 400ms cubic-bezier(0.2, 0, 0, 1);
}
.module-progress-num {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
  min-width: 30px;
  text-align: right;
}
.module-body { border-top: 1px solid var(--rule); }

/* ─── Discussion preview ────────────────────────── */
.dp-card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 10px;
  overflow: hidden;
}
.dp-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--rule);
}
.dp-title {
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
}
.dp-link {
  background: transparent;
  border: none;
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 500;
  color: var(--accent);
  cursor: pointer;
  padding: 0;
}
.dp-link:hover { text-decoration: underline; }
.dp-list { list-style: none; padding: 6px 0; }
.dp-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 18px;
  cursor: pointer;
  transition: background 100ms ease-out;
}
.dp-item:hover { background: var(--raised); }
.dp-tag {
  font-family: var(--sans);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
  letter-spacing: 0.02em;
  flex-shrink: 0;
  margin-top: 2px;
}
.dp-tag-question   { background: var(--warn-dim); color: var(--warn); }
.dp-tag-discussion { background: var(--accent-dim); color: var(--accent); }
.dp-tag-resource   { background: var(--good-dim); color: var(--good); }
.dp-tag-announcement { background: var(--mark-dim); color: var(--mark); }
.dp-body { flex: 1; min-width: 0; }
.dp-thread-title {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dp-thread-meta {
  font-family: var(--sans);
  font-size: 11.5px;
  color: var(--ink-3);
  margin-top: 2px;
}

@media (max-width: 1024px) {
  .scope-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 860px) {
  .gd-panel { margin: 0 -20px; padding: 22px 20px 26px; }
  .gd-two-col { grid-template-columns: 1fr; gap: 14px; }
  .gd-head { flex-direction: column; gap: 10px; }
  .gd-actions { flex-direction: column; align-items: stretch; }
  .gd-actions-right { flex-direction: column; }
  .gd-actions-right .btn { width: 100%; justify-content: center; }
  .scope-grid { grid-template-columns: 1fr 1fr; }
  .scope-value { font-size: 22px; }
  .qn-btn { width: 40px; height: 40px; font-size: 13px; }
  .module-progress-bar { width: 40px; }
  .module-count { display: none; }
}
@media (max-width: 520px) {
  .scope-grid { grid-template-columns: 1fr; }
  .qn-grid { gap: 5px; }
  .qn-btn { width: 38px; height: 38px; }
}
.take-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.take-toolbar .qn-wrap { flex: 1; min-width: 260px; }
@media (max-width: 520px) {
  .take-toolbar { flex-direction: column; }
  .take-toolbar .qn-wrap { width: 100%; }
}
.course-modules {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 10px;
  overflow: hidden;
}
.course-module { border-top: 1px solid var(--rule); }
.course-module:first-child { border-top: none; }
.course-module .rowitem { padding-left: 24px; padding-right: 18px; }
.overview-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 860px) {
  .overview-split { grid-template-columns: 1fr; }
}
`;

export default styles;