import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCards from "@/components/patients/StatsCards";
import ComfortChart from "@/components/patients/ComfortChart";
import PatientTable from "@/components/patients/PatientTable";
import {
  createPatient,
  deletePatient,
  fetchPatients,
  updatePatient,
} from "@/lib/api";

const formatGenderLabel = (value) => {
  if (!value) return "Unknown";
  const normalized = value.toLowerCase();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return value;
};

const formatStatusLabel = (value) => {
  if (!value) return "";

  const normalized = value.trim().toLowerCase();
  if (normalized === "uncomfortable" || normalized === "discomfort") {
    return "Uncomfortable";
  }
  if (normalized === "comfortable" || normalized === "comfort") {
    return "Comfortable";
  }
  return value;
};

const PatientManagementPage = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPatients = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await fetchPatients();
      const normalized = Object.entries(data || {}).map(([id, patient]) => ({
        id,
        hn: patient.hospital_number ?? "",
        name: patient.full_name ?? "",
        age: patient.age ?? "",
        gender: formatGenderLabel(patient.gender),
        genderValue: patient.gender ?? "",
        heightCm: patient.height_cm ?? "",
        weightKg: patient.weight_kg ?? "",
        room: patient.room ?? "",
        status: formatStatusLabel(patient.status),
      }));
      setPatients(normalized);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load patients"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleAddPatient = async (payload) => {
    try {
      setErrorMessage("");
      await createPatient(payload);
      await loadPatients();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to add patient.";
      setErrorMessage(message);
      throw new Error(message);
    }
  };

  const handleEditPatient = async (patientId, payload) => {
    try {
      setErrorMessage("");
      await updatePatient(patientId, payload);
      await loadPatients();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update patient.";
      setErrorMessage(message);
      throw new Error(message);
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      setErrorMessage("");
      await deletePatient(patientId);
      await loadPatients();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete patient."
      );
    }
  };

  const maleCount = useMemo(
    () => patients.filter((p) => p.gender === "Male").length,
    [patients]
  );
  const femaleCount = useMemo(
    () => patients.filter((p) => p.gender === "Female").length,
    [patients]
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Patient Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor patient records
          </p>
        </div>

        <StatsCards
          totalPatients={patients.length}
          malePatients={maleCount}
          femalePatients={femaleCount}
        />

        <ComfortChart patients={patients} />

        {isLoading ? (
          <p className="text-sm text-muted-foreground mb-4">
            Loading patients from Firebase...
          </p>
        ) : null}
        {errorMessage ? (
          <p className="text-sm text-destructive mb-4">
            {errorMessage}
          </p>
        ) : null}

        <PatientTable
          patients={patients}
          onAddPatient={handleAddPatient}
          onEditPatient={handleEditPatient}
          onDeletePatient={handleDeletePatient}
        />
      </div>
    </DashboardLayout>
  );
};

export default PatientManagementPage;
