import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { cn } from "@/lib/cn";

export const SmallMultiple = ({ topic }) => {
  const tone =
    topic.accuracy < 60
      ? "text-danger"
      : topic.accuracy < 80
        ? "text-warning"
        : "text-ink";

  const color =
    topic.accuracy < 60
      ? "var(--color-danger)"
      : topic.accuracy < 80
        ? "var(--color-warning)"
        : "var(--color-success)";

  const gid = `sg-${topic.name.replace(/\W/g, "")}`;

  return (
    <div className="bg-surface p-4 pb-3">
      <div className="mb-1 truncate font-mono text-[12px] font-medium text-ink-2">
        {topic.name}
      </div>
      <div
        className={cn(
          "font-display text-[24px] font-medium leading-none tracking-[-0.02em] tabular-nums",
          tone
        )}
      >
        {topic.accuracy}%
      </div>
      <div className="mt-2 h-[34px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={topic.trend.map((v, i) => ({ i, v }))}
            margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.2}
              fill={`url(#${gid})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
