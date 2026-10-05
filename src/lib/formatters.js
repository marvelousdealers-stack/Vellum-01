// ═══════════════════════════════════════════════════════════════
// TIME FORMATTER
// ═══════════════════════════════════════════════════════════════
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  const then =
    typeof timestamp === "number" ? timestamp : new Date(timestamp).getTime();
  const diff = Date.now() - then;
  if (diff < 10 * 1000) return "just now";
  if (diff < 60 * 1000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
  if (diff < 24 * 60 * 60 * 1000)
    return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
  if (diff < 7 * 24 * 60 * 60 * 1000)
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
  return new Date(then).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};
