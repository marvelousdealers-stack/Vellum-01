import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { createId } from "@/lib/id";

// ═══════════════════════════════════════════════════════════════
// LIVE ACTIVITY FEED
// ═══════════════════════════════════════════════════════════════
const FEED_DATA = [
  {
    id: 1,
    kind: "submit",
    text: "Maya Okafor submitted",
    detail: "Newton's Laws — Unit Test",
    when: "just now",
  },
  {
    id: 2,
    kind: "flag",
    text: "AI flagged a session",
    detail: "Adrian Bell · 3 tab switches",
    when: "2 min ago",
  },
  {
    id: 3,
    kind: "publish",
    text: "Test published",
    detail: "Thermodynamics — Mid-term",
    when: "18 min ago",
  },
  {
    id: 4,
    kind: "grade",
    text: "You graded 4 submissions",
    detail: "Newton's Laws — Unit Test",
    when: "1 hr ago",
  },
  {
    id: 5,
    kind: "chat",
    text: "New reply in Discussion",
    detail: "Tomás Reyes · Lens sign convention",
    when: "2 hr ago",
  },
  {
    id: 6,
    kind: "upload",
    text: "Materials extracted",
    detail: "IMG_2043.heic · 6 topics",
    when: "3 hr ago",
  },
];

const FEED_DOT = {
  submit: "bg-primary",
  flag: "bg-danger",
  publish: "bg-primary",
  grade: "bg-success",
  chat: "bg-primary",
  upload: "bg-success",
};

export const LiveActivityFeed = () => {
  const [items, setItems] = useState(FEED_DATA);

  useEffect(() => {
    const t = setTimeout(() => {
      setItems((prev) => [
        {
          id: createId(),
          kind: "submit",
          text: "Priya Nair submitted",
          detail: "Newton's Laws — Unit Test",
          when: "just now",
        },
        ...prev.slice(0, 5),
      ]);
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  // Five most recent. The relative time sits at the end of the detail line (never
  // truncated away) and long details wrap instead of ending in an ellipsis.
  return (
    <ul className="-mx-2 flex flex-col">
      {items.slice(0, 5).map((it) => (
        <li
          key={it.id}
          className="flex gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-raised"
        >
          <span
            className={cn("mt-[7px] size-2 shrink-0 rounded-full", FEED_DOT[it.kind])}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-medium leading-snug text-ink">{it.text}</div>
            <div className="mt-1 text-[12.5px] leading-snug text-ink-3">
              {it.detail} <span className="whitespace-nowrap">· {it.when}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
