import { Download } from "lucide-react";
import { cn } from "@/lib/cn";

export const FileCard = ({ title, url }) => {
  const ext = (title.match(/\.(\w+)$/)?.[1] || "file").toLowerCase();
  const isPDF = ext === "pdf";
  const isDoc = ext === "doc" || ext === "docx";
  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        if (!url) e.preventDefault();
      }}
      className="group mb-4 flex items-center gap-3.5 rounded-[var(--radius-container)] border border-rule bg-bg px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-rule-2 hover:bg-surface hover:shadow-[var(--shadow-raised)]"
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-[10px] font-mono text-[12px] font-bold tracking-wider",
          isPDF && "bg-danger-dim text-danger",
          isDoc && "bg-primary-dim text-primary",
          !isPDF && !isDoc && "bg-warning-dim text-warning",
        )}
      >
        {ext.slice(0, 4).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium text-ink">{title}</div>
        <div className="mt-0.5 text-[12px] text-ink-3">
          {url ? "Click to open in a new tab" : "No file linked yet"}
        </div>
      </div>
      <span className="shrink-0 text-ink-3 transition-colors group-hover:text-primary">
        <Download size={15} />
      </span>
    </a>
  );
};
