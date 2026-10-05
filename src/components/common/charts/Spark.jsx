import { ResponsiveContainer, LineChart, Line } from "recharts";

// ═══════════════════════════════════════════════════════════════
// CHART PRIMITIVES
// ═══════════════════════════════════════════════════════════════
export const Spark = ({ data, color = "var(--color-primary)", height = 22 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
      <Line
        type="monotone"
        dataKey="v"
        stroke={color}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  </ResponsiveContainer>
);
