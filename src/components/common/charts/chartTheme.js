// ═══════════════════════════════════════════════════════════════
// CHART THEME
// Shared Recharts tooltip + axis styling. Values reference the
// same design tokens the rest of the app uses — no hardcoded
// colors, so both themes render correctly without any per-chart
// overrides.
// ═══════════════════════════════════════════════════════════════
export const TIP = {
  contentStyle: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-rule-2)",
    borderRadius: 10,
    fontFamily: "var(--font-sans)",
    fontSize: 12.5,
    color: "var(--color-ink)",
    padding: "9px 13px",
    boxShadow: "var(--shadow-raised)",
  },
  labelStyle: {
    fontFamily: "var(--font-sans)",
    fontSize: 11.5,
    fontWeight: 600,
    color: "var(--color-ink-2)",
    marginBottom: 5,
  },
  itemStyle: {
    color: "var(--color-ink)",
    fontSize: 12.5,
    padding: "2px 0",
  },
};

export const AXIS = {
  stroke: "var(--color-ink-4)",
  fontSize: 11,
  fontFamily: "var(--font-sans)",
  fill: "var(--color-ink-3)",
};
