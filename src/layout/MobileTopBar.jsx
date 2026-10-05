import { Menu, Search } from "lucide-react";
import { Wordmark } from "@/components/common";

export const MobileTopBar = ({ onMenuToggle, onSearch, showSearch = true }) => (
  <div className="sticky top-0 z-25 flex h-16 items-center gap-2 border-b border-rule bg-bg px-3 tablet:hidden">
    <button
      onClick={onMenuToggle}
      aria-label="Open navigation menu"
      className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-rule-2 bg-surface text-ink-2 transition-colors hover:bg-raised hover:text-ink active:scale-95"
    >
      <Menu size={18} />
    </button>

    <div className="flex flex-1 items-center gap-2">
      <Wordmark size={28} />
    </div>

    {showSearch && onSearch && (
      <button
        onClick={onSearch}
        aria-label="Search"
        className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-rule-2 bg-surface text-ink-2 transition-colors hover:bg-raised hover:text-ink"
      >
        <Search size={16} />
      </button>
    )}
  </div>
);
