import DashboardLayout from "@/components/layout/DashboardLayout";
import AlertBanner from "@/components/dashboard/AlertBanner";
import PatientInfo from "@/components/dashboard/PatientInfo";
import CurrentStatus from "@/components/dashboard/CurrentStatus";
import MeasurementCards from "@/components/dashboard/MeasurementCards";
import PredictionHistory from "@/components/dashboard/PredictionHistory";

const mockPredictionHistory = [
  { date: "07/03/2025", time: "03:39:20 pm", status: "Uncomfortable" },
  { date: "07/03/2025", time: "03:37:42 pm", status: "Comfortable" },
  { date: "07/03/2025", time: "03:37:08 pm", status: "Comfortable" },
];

const PatientDashboardPage = () => {
  const patientStatus = "Comfortable";

  const getAlertConfig = (status) => {
    if (status === "Comfortable" || status === "Very comfortable") {
      return {
        type: "success",
        title: "Optimal Comfort",
        message: "Patient comfort level is within optimal range",
      };
    }
    return {
      type: "error",
      title: "Attention Required",
      message: "Patient comfort level is below optimal range",
    };
  };

  const alertConfig = getAlertConfig(patientStatus);

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Patient Dashboard
          </h1>
        </div>

        <div className="space-y-6">
          {/* Alert Banner */}
          <AlertBanner
            type={alertConfig.type}
            title={alertConfig.title}
            message={alertConfig.message}
          />

          {/* Patient Info + Status */}
          <div className="flex gap-6">
            <PatientInfo
              hn="HN001"
              room="A101"
              name="พิพิฐ ศรีพลบายุล"
              gender="Male"
              age="20"
              height="158 cm"
              weight="51.25 kg"
            />
            <CurrentStatus
              status={patientStatus}
              recommendation={
                patientStatus === "Comfortable" ||
                patientStatus === "Very comfortable"
                  ? "Patient comfort level is optimal. Continue monitoring."
                  : "Increase airflow or lower the temperature to improve comfort."
              }
              updatedAt="2 months ago"
            />
          </div>

          {/* Measurements */}
          <MeasurementCards
            windSpeed={1.68}
            skinTemp={31.3}
            tonic={35.45}
            lfhf={3.21}
          />

          {/* Prediction History */}
          <PredictionHistory records={mockPredictionHistory} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboardPage;
