import { cn } from "@/lib/cn";

export const ModuleHeader = ({ module, open, onToggle, progress }) => (
  <button
    onClick={onToggle}
    className={cn(
      "flex w-full items-center gap-3 border-t border-rule px-5 py-3.5 text-left transition-colors first:border-t-0",
      open ? "bg-surface" : "hover:bg-raised/60",
    )}
  >
    <span className="w-3 shrink-0 text-[12px] text-ink-3">
      {open ? "▾" : "▸"}
    </span>
    <span className="flex-1 truncate text-[14px] font-semibold tracking-[-0.005em] text-ink">
      {module.title}
    </span>
    <span className="hidden shrink-0 font-mono text-[12px] text-ink-3 narrow:inline">
      {module.lessons.length}{" "}
      {module.lessons.length === 1 ? "lesson" : "lessons"}
    </span>
    <span className="flex shrink-0 items-center gap-2">
      <span className="h-1 w-12 overflow-hidden rounded-full bg-rule">
        <span
          className="block h-full rounded-full bg-gradient-to-r from-primary to-primary-2 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </span>
      <span className="min-w-[30px] text-right font-mono text-[12px] font-semibold tabular-nums text-ink-2">
        {progress}%
      </span>
    </span>
  </button>
);
