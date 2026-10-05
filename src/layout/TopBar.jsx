import { Plus, Download, Search } from "lucide-react";
import { useLocation, useMatches, useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

// ── Action lookup ─────────────────────────────────────────────
function getActionFor(pathname, role, navigate) {
  if (pathname === "/teacher" || pathname === "/teacher/") {
    return {
      primary: {
        label: "New test",
        icon: Plus,
        onClick: () => navigate("/teacher/drafts/new"),
      },
    };
  }
  if (pathname.startsWith("/teacher/drafts")) {
    return {
      primary: {
        label: "New test",
        icon: Plus,
        onClick: () => navigate("/teacher/drafts/new"),
      },
    };
  }
  if (pathname.startsWith("/teacher/review")) {
    return {
      secondary: { label: "Download PDF", icon: Download, onClick: () => {} },
      primary:   { label: "Bulk approve", onClick: () => {} },
    };
  }
  if (pathname.startsWith("/teacher/drafts/new")) {
    return {
      primary: { label: "Create test", onClick: () => {} },
    };
  }
  if (pathname.startsWith("/student/history")) {
    return {
      primary: { label: "Export PDF", icon: Download, onClick: () => {} },
    };
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// TOP BAR
//
// Sticky. Left: page title (from route handle). Right: contextual
// controls + primary action. On mobile this is hidden — MobileTopBar
// takes over.
//
// The action slot varies by route:
//   teacher/home      → [+ New test]
//   teacher/review    → [Bulk approve] [Release results]
//   teacher/drafts    → [+ New test]
//   student/history   → [Export PDF]
//
// For now, we derive the action from the pathname. Later, routes can
// declare their actions via handle.action.
// ═══════════════════════════════════════════════════════════════
export const TopBar = ({ onSearch }) => {
  const location = useLocation();
  const matches = useMatches();
  const navigate = useNavigate();
  const { role } = useApp();

  const title = [...matches].reverse().find((m) => m.handle?.title)?.handle?.title || "";

  const action = getActionFor(location.pathname, role, navigate);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 hidden h-16 shrink-0 items-center gap-3 border-b border-rule bg-bg/90 px-10 backdrop-blur-sm tablet:flex"
      )}
    >
      <h1 className="truncate font-serif text-[19px] font-semibold tracking-[-0.015em] text-ink">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onSearch}
          className="flex h-10 min-w-[40px] items-center gap-2.5 rounded-full border border-rule-2 bg-surface px-3.5 text-[13px] text-ink-3 transition-colors hover:border-rule-3 hover:text-ink lg:w-[300px]"
          aria-label="Open search"
        >
          <Search size={15} />
          <span className="hidden lg:inline">Search anything</span>
          <kbd className="ml-auto hidden rounded-md border border-rule-2 bg-raised px-1.5 py-0.5 text-[12px] font-semibold text-ink-3 lg:inline">
            ⌘K
          </kbd>
        </button>

        {action?.secondary && (
          <Button
            onClick={action.secondary.onClick} variant="outline"
          >
            {action.secondary.icon && <action.secondary.icon size={14} />}
            {action.secondary.label}
          </Button>
        )}

        {action?.primary && (
          <Button
            onClick={action.primary.onClick}
          >
            {action.primary.icon && <action.primary.icon size={14} />}
            {action.primary.label}
          </Button>
        )}
      </div>
    </header>
  );
};
