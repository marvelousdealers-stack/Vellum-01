import { useEffect, useCallback } from "react";
import { usePersistentState } from "./usePersistentState";

// ═══════════════════════════════════════════════════════════════
// useTheme
// Persists the user's light/dark choice. LIGHT is the default and the
// OS preference is deliberately ignored — dark is an explicit opt-in.
// The inline script in index.html applies the stored theme before first
// paint (no flash); this hook keeps it in sync afterwards.
//
// Sets BOTH the data-theme attribute (for CSS token overrides in
// index.css) AND the .dark / .light class (for Tailwind dark: /
// light: variants defined via @custom-variant). Keeping these two
// in sync is what makes theme switching instant and flash-free.
// ═══════════════════════════════════════════════════════════════
const THEME_KEY = "vellum.theme";

// Keeps the mobile browser chrome tint in step with a manual theme switch.
const THEME_COLOR = { light: "#F7F6F2", dark: "#0A0D1B" };
const syncThemeColor = (theme) => {
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.setAttribute("content", THEME_COLOR[theme]);
    m.removeAttribute("media");
  });
};

export const useTheme = () => {
  const [theme, setTheme] = usePersistentState(
    THEME_KEY,
    "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark",  theme === "dark");
    root.classList.toggle("light", theme === "light");
    syncThemeColor(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
};
