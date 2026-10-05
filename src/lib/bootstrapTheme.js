// Runs BEFORE React mounts so there is no theme flash on load.
// Sets BOTH:
//   · data-theme attribute — read by the token overrides in styles/index.css
//   · .dark / .light class — read by Tailwind's dark: / light: variants
// Uses the same localStorage key + fallback as hooks/useTheme.js.
export function bootstrapTheme() {
  const root = document.documentElement;
  try {
    const raw = window.localStorage.getItem("vellum.theme");
    const stored = raw != null ? JSON.parse(raw) : null;
    const theme =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
  } catch {
    root.setAttribute("data-theme", "light");
    root.classList.add("light");
  }
}
