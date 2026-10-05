// ═══════════════════════════════════════════════════════════════
// BRAND MARK
// The Vellum "V": a broad-nib letterform (heavy downstroke, hairline
// upstroke) on ink-indigo, with a gold-leaf dot like an illuminated
// initial. Colors are fixed brand colors, NOT theme tokens — the mark
// must look identical on the navy sidebar, the paper login page, and
// in a browser tab.
//
// Same geometry as public/favicon.svg (regular weight here; the
// favicon uses a slightly bolder cut so it survives 16px). Source of
// truth for generating every icon size: scripts in /public are
// derived from this shape — change both together.
// ═══════════════════════════════════════════════════════════════
export const BRAND = {
  indigo: "#414FD2",
  navy: "#0E143B",
  gold: "#EBBD57",
  paper: "#F7F6F2",
};

export const BrandMark = ({ size = 28, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    role={title ? "img" : undefined}
    aria-label={title}
    aria-hidden={title ? undefined : "true"}
    style={{ flexShrink: 0, display: "block" }}
  >
    <rect width="32" height="32" rx="8" fill={BRAND.indigo} />
    <path
      d="M7.4 8 L12.1 8 L16.4 18.3 L19.6 8 L22.9 8 L17.9 24.2 L14.1 24.2 Z"
      fill="#fff"
      stroke="#fff"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    <circle cx="26" cy="8.2" r="2.1" fill={BRAND.gold} />
  </svg>
);

// Mark + serif wordmark. `tone` picks the wordmark color for the surface it sits on.
export const Wordmark = ({ size = 28, tone = "ink", className = "" }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <BrandMark size={size} />
    <span
      className={`font-serif font-semibold leading-none tracking-[-0.02em] ${
        tone === "sidebar" ? "text-sidebar-ink" : "text-ink"
      }`}
      style={{ fontSize: Math.round(size * 0.82) }}
    >
      Vellum
    </span>
  </span>
);
