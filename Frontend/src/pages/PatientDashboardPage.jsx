import DashboardLayout from "@/components/layout/DashboardLayout";
import AlertBanner from "@/components/dashboard/AlertBanner";
import PatientInfo from "@/components/dashboard/PatientInfo";
import CurrentStatus from "@/components/dashboard/CurrentStatus";
import MeasurementCards from "@/components/dashboard/MeasurementCards";
import PredictionHistory from "@/components/dashboard/PredictionHistory";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPatient, fetchPredictionHistory } from "@/lib/api";

const formatGenderLabel = (value) => {
  if (!value) return "Unknown";
  const normalized = value.toLowerCase();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return value;
};

const normalizePredictionLabel = (predictionLabel, predictionValue) => {
  if (predictionLabel) return predictionLabel;
  if (predictionValue === 0) return "Uncomfortable";
  if (predictionValue === 1) return "Comfortable";
  return "Unknown";
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return { date: "-", time: "-" };
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return { date: "-", time: "-" };
  return {
    date: parsed.toLocaleDateString("en-GB"),
    time: parsed.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
};

const PatientDashboardPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadPatientData = async () => {
      if (!id) {
        if (isMounted) {
          setErrorMessage("Patient ID is missing.");
          setIsLoading(false);
        }
        return;
      }
      setIsLoading(true);
      setErrorMessage("");
      try {
        const patientData = await fetchPatient(id);
        if (!patientData) {
          throw new Error("Patient not found.");
        }
        if (!isMounted) return;
        setPatient({
          hn: patientData.hospital_number ?? "",
          room: patientData.room ?? "",
          name: patientData.full_name ?? "",
          gender: formatGenderLabel(patientData.gender),
          age: patientData.age ?? "",
          height: patientData.height_cm ? `${patientData.height_cm} cm` : "-",
          weight: patientData.weight_kg ? `${patientData.weight_kg} kg` : "-",
          statusUpdatedAt: patientData.status_updated_at ?? "",
        });

        if (patientData.hospital_number) {
          const history = await fetchPredictionHistory(
            patientData.hospital_number
          );
          if (!isMounted) return;
          const normalizedHistory = (history || []).map((record) => {
            const { date, time } = formatTimestamp(record.timestamp);
            return {
              id: record.id,
              date,
              time,
              status: normalizePredictionLabel(
                record.prediction_label,
                record.prediction
              ),
              raw: record.raw_data ?? {},
              timestamp: record.timestamp ?? "",
            };
          });
          setPredictionHistory(normalizedHistory);
        } else {
          setPredictionHistory([]);
        }
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load patient data."
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPatientData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const latestPrediction = predictionHistory[0];
  const patientStatus = latestPrediction?.status || "Unknown";
  const measurementData = latestPrediction?.raw || {};
  const updatedAt = useMemo(() => {
    if (latestPrediction?.timestamp) {
      const { date, time } = formatTimestamp(latestPrediction.timestamp);
      return `${date} ${time}`;
    }
    if (patient?.statusUpdatedAt) {
      const { date, time } = formatTimestamp(patient.statusUpdatedAt);
      return `${date} ${time}`;
    }
    return "No recent updates";
  }, [latestPrediction, patient]);

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
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading patient data...
            </p>
          ) : null}
          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}

          {/* Alert Banner */}
          <AlertBanner
            type={alertConfig.type}
            title={alertConfig.title}
            message={alertConfig.message}
          />

          {/* Patient Info + Status */}
          <div className="flex gap-6">
            <PatientInfo
              hn={patient?.hn || "-"}
              room={patient?.room || "-"}
              name={patient?.name || "-"}
              gender={patient?.gender || "Unknown"}
              age={patient?.age || "-"}
              height={patient?.height || "-"}
              weight={patient?.weight || "-"}
            />
            <CurrentStatus
              status={patientStatus}
              recommendation={
                patientStatus === "Comfortable" ||
                patientStatus === "Very comfortable"
                  ? "Patient comfort level is optimal. Continue monitoring."
                  : "Increase airflow or lower the temperature to improve comfort."
              }
              updatedAt={updatedAt}
            />
          </div>

          {/* Measurements */}
          <MeasurementCards
            windSpeed={measurementData.windSpeed}
            skinTemp={measurementData.skintemp}
            tonic={measurementData.eda_raw}
            lfhf={measurementData.hrv_raw}
          />

          {/* Prediction History */}
          <PredictionHistory records={predictionHistory} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboardPage;
