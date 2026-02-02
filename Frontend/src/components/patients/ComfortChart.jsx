import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { category: "Very uncomfortable", male: 1, female: 1 },
  { category: "Uncomfortable", male: 0, female: 1 },
  { category: "Neutral", male: 0, female: 1 },
  { category: "Very comfortable", male: 1, female: 2 },
];

const ComfortChart = () => {
  return (
    <div className="medical-card mb-6">
      <h3 className="font-semibold text-foreground mb-4">
        ระดับความสบายตามเพศ
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
          />

          <XAxis
            dataKey="category"
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />

          <YAxis
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />

          <Legend
            formatter={(value) => (
              <span className="text-sm text-foreground">
                {value === "male" ? "ผู้ชาย" : "ผู้หญิง"}
              </span>
            )}
          />

          <Bar
            dataKey="male"
            fill="hsl(210, 90%, 55%)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="female"
            fill="hsl(330, 85%, 60%)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComfortChart;
