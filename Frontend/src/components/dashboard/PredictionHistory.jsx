import { History } from "lucide-react";

/**
 * Normalize status ให้เหลือแค่ 2 ค่า
 */
const normalizeStatus = (status) => {
  if (status === "Uncomfortable") return "Uncomfortable";
  return "Comfortable"; // รวม Comfortable + Very comfortable
};

const getStatusEmoji = (status) => {
  switch (status) {
    case "Uncomfortable":
      return "😟";
    case "Comfortable":
    default:
      return "🙂";
  }
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Uncomfortable":
      return "bg-orange-500 text-white";
    case "Comfortable":
    default:
      return "bg-green-500 text-white";
  }
};

const PredictionHistory = ({ records }) => {
  if (!records?.length) {
    return (
      <div className="medical-card">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Prediction History
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          No prediction history available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">
          Prediction History
        </h3>
      </div>

      <div className="space-y-3">
        {records.map((record, index) => {
          const status = normalizeStatus(record.status);

          return (
            <div
              key={record.id ?? `${record.date}-${record.time}-${index}`}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getStatusEmoji(status)}
                </span>
                <div>
                  <p className="font-medium text-foreground">
                    {record.date}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {record.time}
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                  status
                )}`}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionHistory;
