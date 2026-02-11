const getStatusEmoji = (status) => {
  switch (status) {
    case "Comfortable":
      return "😊";
    case "Uncomfortable":
      return "😟";
    default:
      return "😐";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Comfortable":
      return "bg-green-500";
    case "Uncomfortable":
      return "bg-orange-500";
    default:
      return "bg-gray-400";
  }
};

const CurrentStatus = ({ status, recommendation, updatedAt }) => {
  return (
    <div className="medical-card w-64 text-center">
      <h3 className="font-semibold text-foreground mb-4">
        Current Status
      </h3>

      <div className="text-6xl mb-4">
        {getStatusEmoji(status)}
      </div>

      <span
        className={`inline-block px-4 py-2 rounded-full text-sm font-medium text-white ${getStatusClass(
          status
        )}`}
      >
        {status}
      </span>

      <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
        {recommendation}
      </p>

      <p className="text-muted-foreground text-xs mt-4">
        Updated: {updatedAt}
      </p>
    </div>
  );
};

export default CurrentStatus;
