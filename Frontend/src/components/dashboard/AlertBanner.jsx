import { AlertCircle } from "lucide-react";

const AlertBanner = ({ type, title, message }) => {
  const getBgClass = () => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getIconClass = () => {
    switch (type) {
      case "error":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      case "info":
      default:
        return "text-blue-500";
    }
  };

  const getTitleClass = () => {
    switch (type) {
      case "error":
        return "text-red-700";
      case "warning":
        return "text-amber-700";
      case "info":
      default:
        return "text-blue-700";
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 flex items-start gap-3 ${getBgClass()}`}
    >
      <AlertCircle className={`w-5 h-5 mt-0.5 ${getIconClass()}`} />
      <div>
        <h4 className={`font-semibold ${getTitleClass()}`}>{title}</h4>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default AlertBanner;
