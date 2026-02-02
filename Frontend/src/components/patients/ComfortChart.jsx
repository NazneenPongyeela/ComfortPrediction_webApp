import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const STATUS_BUCKETS = [
  "Uncomfortable",
  "Comfortable"
];

const ComfortChart = ({ patients }) => {
  const data = STATUS_BUCKETS.map((category) => {
    const male = patients.filter(
      (patient) =>
        patient.gender === "Male" &&
        patient.status?.toLowerCase() === category.toLowerCase()
    ).length;
    const female = patients.filter(
      (patient) =>
        patient.gender === "Female" &&
        patient.status?.toLowerCase() === category.toLowerCase()
    ).length;
    return { category, male, female };
  });

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
