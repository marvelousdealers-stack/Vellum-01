// Runs BEFORE React mounts so there is no theme flash on load.
// Sets BOTH:
//   · data-theme attribute — read by the token overrides in styles/index.css
//   · .dark / .light class — read by Tailwind's dark: / light: variants
// Same rule as hooks/useTheme.js and the inline script in index.html.
export function bootstrapTheme() {
  const root = document.documentElement;
  try {
    const raw = window.localStorage.getItem("vellum.theme");
    const stored = raw != null ? JSON.parse(raw) : null;
    // Light is the default; the OS preference is ignored. Dark is opt-in.
    const theme = stored === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
  } catch {
    root.setAttribute("data-theme", "light");
    root.classList.add("light");
  }
}
