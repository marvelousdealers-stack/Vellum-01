import { cn } from "@/lib/cn";

// ── Connection indicator ──
const CONN_LABEL = { live: "Live", polling: "Polling", retry: "Reconnecting", down: "Offline" };

const CONN_COLOR = { live: "bg-success", polling: "bg-primary", retry: "bg-warning", down: "bg-danger" };

export const Conn = ({ state = "live", secs = 12 }) => (
  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-raised px-2.5 py-0.5 text-[12px] font-medium text-ink-2">
    <span className={cn("size-1.5 rounded-full", CONN_COLOR[state], state === "live" && "animate-beacon")} />
    {CONN_LABEL[state]}
  </span>
);
