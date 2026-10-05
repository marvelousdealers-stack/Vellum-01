import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ReferenceDot,
} from "recharts";
import { AXIS, TIP } from "./chartTheme";

export const Trend = ({ data, series, height = 200, focal }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 16, right: 36, bottom: 8, left: 4 }}>
      <XAxis
        dataKey="t"
        axisLine={{ stroke: "var(--color-rule)", strokeWidth: 1 }}
        tickLine={false}
        tick={AXIS}
      />
      <YAxis
        domain={[50, 100]}
        axisLine={false}
        tickLine={false}
        tick={AXIS}
        width={32}
      />
      <Tooltip {...TIP} cursor={{ stroke: "var(--color-rule-2)", strokeWidth: 1 }} />
      {series.map((s, i) => (
        <Line
          key={i}
          type="monotone"
          dataKey={s.key}
          stroke={s.color}
          strokeWidth={s.width || 1.5}
          strokeDasharray={s.dash}
          dot={false}
          isAnimationActive={false}
          name={s.label}
        />
      ))}
      {focal != null && (
        <ReferenceDot
          x={data[data.length - 1].t}
          y={focal}
          r={3.5}
          fill="var(--color-primary)"
          stroke="none"
        />
      )}
    </LineChart>
  </ResponsiveContainer>
);
