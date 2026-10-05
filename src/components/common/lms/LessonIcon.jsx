import { cn } from "@/lib/cn";

export const LessonIcon = ({ kind, size = 32 }) => {
  const glyph = kind === "video" ? "▶" : kind === "file" ? "▤" : "≡";
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-[10px] font-mono font-semibold",
        kind === "video" && "bg-danger-dim text-danger",
        kind === "file" && "bg-warning-dim text-warning",
        kind === "text" && "bg-primary-dim text-primary",
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {glyph}
    </span>
  );
};
