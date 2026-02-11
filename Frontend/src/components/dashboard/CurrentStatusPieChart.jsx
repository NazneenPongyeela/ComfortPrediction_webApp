import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  Comfortable: "#22c55e",
  Uncomfortable: "#f97316",
};

const normalizeStatus = (status) => {
  if (status === "Uncomfortable") return "Uncomfortable";
  return "Comfortable";
};

const CurrentStatusPieChart = ({ records = [] }) => {
  const summary = records.reduce(
    (acc, record) => {
      const status = normalizeStatus(record.status);
      acc[status] += 1;
      return acc;
    },
    { Comfortable: 0, Uncomfortable: 0 }
  );

  const chartData = [
    { name: "Comfortable", value: summary.Comfortable },
    { name: "Uncomfortable", value: summary.Uncomfortable },
  ];

  const total = summary.Comfortable + summary.Uncomfortable;

  return (
    <div className="medical-card w-72">
      <h3 className="font-semibold text-foreground mb-4 text-center">
        Current Status
      </h3>

      {total === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No prediction history available yet.
        </p>
      ) : (
        <>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={3}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Comfortable
              </span>
              <span className="font-medium text-foreground">
                {summary.Comfortable} times
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                Uncomfortable
              </span>
              <span className="font-medium text-foreground">
                {summary.Uncomfortable} times
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentStatusPieChart;
