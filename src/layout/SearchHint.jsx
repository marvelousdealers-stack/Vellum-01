import { Search as SearchIcon } from "lucide-react";
import { Kbd } from "@/components/common";
import { cn } from "@/lib/cn";

// ═══════════════════════════════════════════════════════════════
// SEARCH HINT
// ═══════════════════════════════════════════════════════════════
export const SearchHint = ({ onClick, compact = false }) => {
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform || "");
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open search"
      className={cn(
        "flex items-center gap-2.5 rounded-[var(--radius-control)] border border-sidebar-rule bg-sidebar-surface text-sidebar-ink-2 transition-colors duration-200 hover:bg-sidebar-hover hover:text-sidebar-ink",
        compact
          ? "size-10 justify-center p-0"
          : "h-9 w-full justify-between px-3 pr-2",
      )}
    >
      <SearchIcon size={14} />
      {!compact && (
        <>
          <span className="flex-1 truncate text-left text-[13px]">Search…</span>
          <span className="flex shrink-0 gap-0.5">
            <Kbd size="sm" className="border-sidebar-rule bg-sidebar-hover text-sidebar-ink-2">{isMac ? "⌘" : "Ctrl"}</Kbd>
            <Kbd size="sm" className="border-sidebar-rule bg-sidebar-hover text-sidebar-ink-2">K</Kbd>
          </span>
        </>
      )}
    </button>
  );
};
