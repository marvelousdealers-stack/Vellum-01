import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";

// ═══════════════════════════════════════════════════════════════
// CHART PRIMITIVES
// ═══════════════════════════════════════════════════════════════
export const Spark = ({ data, color = "var(--color-primary)", height = 22 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
      {/* Fit the vertical range to the data; the default starts at 0 and flattens real trends. */}
      <YAxis hide domain={["dataMin - 3", "dataMax + 3"]} />
      <Line
        type="monotone"
        dataKey="v"
        stroke={color}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  </ResponsiveContainer>
);
