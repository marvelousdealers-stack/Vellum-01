import { useState, useRef, useEffect } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Scatter,
  Cell,
} from "recharts";
import { cn } from "@/lib/cn";

const dotColor = (acc) => acc < 60 ? "var(--color-danger)" : acc < 80 ? "var(--color-warning)" : "var(--color-success)";

// ─── Interactive dot plot ──────────────────────────────────────
export const InteractiveDotPlot = ({ rows, onDrillDown }) => {
  const [hover, setHover] = useState(null);
  const hideTimer = useRef(null);
  const containerRef = useRef(null);
  const cancelHide = () => { if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; } };
  const scheduleHide = () => { cancelHide(); hideTimer.current = setTimeout(() => setHover(null), 200); };
  useEffect(() => () => cancelHide(), []);

  const data = [...rows].sort((a, b) => a.accuracy - b.accuracy).map((r) => ({
    topic: r.name, accuracy: r.accuracy, affected: r.affected || Math.round((100 - r.accuracy) * 0.4), x: r.accuracy, y: r.name,
  }));

  const showDot = (entry, evt) => {
    cancelHide();
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    setHover({ d: entry, x: evt.clientX - box.left, y: evt.clientY - box.top });
  };

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: Math.max(220, data.length * 40 + 36) }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 24, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} stroke="var(--color-rule)" />
          <XAxis type="number" dataKey="x" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`}
                 axisLine={{ stroke: "var(--color-rule-2)" }} tickLine={false}
                 tick={{ fill: "var(--color-ink-3)", fontSize: 12, fontFamily: "var(--font-sans)" }} />
          <YAxis type="category" dataKey="y" width={136} axisLine={false} tickLine={false}
                 tick={{ fill: "var(--color-ink-2)", fontSize: 12.5, fontFamily: "var(--font-sans)" }} />
          <ZAxis range={[110, 110]} />
          <Tooltip content={() => null} cursor={{ stroke: "var(--color-rule-2)", strokeDasharray: "3 3" }} />
          <Scatter data={data} isAnimationActive={false}>
            {data.map((entry, i) => (
              <Cell key={i} fill={dotColor(entry.accuracy)} style={{ cursor: "pointer" }}
                    onMouseEnter={(evt) => showDot(entry, evt)} onMouseLeave={scheduleHide} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      {hover && (
        <div className="absolute z-20 min-w-[200px] rounded-[var(--radius-container)] border border-rule-2 bg-surface p-3.5 shadow-[var(--shadow-elevated)]"
             style={{ left: hover.x + 14, top: hover.y - 10 }} onMouseEnter={cancelHide} onMouseLeave={scheduleHide}>
          <div className="mb-2.5 border-b border-rule pb-2 font-display text-[13px] font-semibold text-ink">{hover.d.topic}</div>
          <div className="flex items-center justify-between gap-4 py-0.5 text-[12.5px]">
            <span className="text-ink-3">Class accuracy</span>
            <span className={cn("font-mono font-semibold tabular-nums", hover.d.accuracy < 60 ? "text-danger" : hover.d.accuracy < 80 ? "text-warning" : "text-success")}>
              {hover.d.accuracy}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-0.5 text-[12.5px]">
            <span className="text-ink-3">Students affected</span>
            <span className="font-mono font-semibold tabular-nums text-ink">{hover.d.affected}</span>
          </div>
          <button type="button" className="mt-2.5 w-full rounded-[var(--radius-control)] border border-primary bg-primary-soft py-1.5 text-[12.5px] font-semibold text-primary transition-colors hover:bg-primary-dim"
                  onClick={() => { setHover(null); onDrillDown?.(hover.d); }}>
            View students →
          </button>
        </div>
      )}
    </div>
  );
};
