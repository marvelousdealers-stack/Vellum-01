import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

// ═══════════════════════════════════════════════════════════════
// THEME TOGGLE
// Shows the icon for the mode you'd switch TO (sun while dark,
// moon while light) — matches the convention used by most toggles.
// ═══════════════════════════════════════════════════════════════
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const label = isLight ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className="grid size-7 shrink-0 place-items-center rounded-md border border-sidebar-rule text-sidebar-ink-3 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-sidebar-accent"
    >
      {isLight ? <Moon size={14} /> : <Sun size={14} />}
    </button>
  );
};
