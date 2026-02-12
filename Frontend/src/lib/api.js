import { auth } from "@/lib/firebase";

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/$/, "");
  return "http://localhost:8000";
};

const getStoredAuthToken = () =>
  localStorage.getItem("idToken") || sessionStorage.getItem("idToken");

const refreshAuthTokenFromFirebase = async () => {
  const currentUser = auth.currentUser; // ✅ FIX: no ".current"
  if (!currentUser?.getIdToken) return null;

  const token = await currentUser.getIdToken();
  if (token) {
    // เลือกเก็บ session เพื่อกัน stale token ใน local
    sessionStorage.setItem("idToken", token);
  }
  return token || null;
};

const getAuthToken = async () => {
  const storedToken = getStoredAuthToken();
  if (storedToken) return storedToken;
  return refreshAuthTokenFromFirebase();
};

const buildHeaders = async (extraHeaders = {}) => {
  const token = await getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
};

const requestJson = async (path, options = {}) => {
  const apiBaseUrl = resolveApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: await buildHeaders(options.headers),
  });

  // ✅ FIX: clear tokens on 401
  if (response.status === 401) {
    localStorage.removeItem("idToken");
    sessionStorage.removeItem("idToken");
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let message = "";

    if (contentType.includes("application/json")) {
      const data = await response.json().catch(() => ({}));
      if (typeof data?.detail === "string") message = data.detail;
      else if (typeof data?.message === "string") message = data.message;
      else if (typeof data?.error === "string") message = data.error;
    } else {
      message = await response.text();
    }

    throw new Error(message || "Request failed");
  }

  // ✅ FIX: return json only when it is json
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

export const fetchPatients = () => requestJson("/patients", { method: "GET" });

export const fetchPatient = (patientId) =>
  requestJson(`/patients/${patientId}`, { method: "GET" });

export const fetchPredictionHistory = (hospitalNumber) =>
  requestJson(`/predictions/${hospitalNumber}`, { method: "GET" });

export const createPatient = (payload) =>
  requestJson("/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const updatePatient = (patientId, payload) =>
  requestJson(`/patients/${patientId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const deletePatient = (patientId) =>
  requestJson(`/patients/${patientId}`, { method: "DELETE" });

export const predictComfort = (payload) =>
  requestJson("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
