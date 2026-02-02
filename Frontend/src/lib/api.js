const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim();
  }
  return "http://localhost:8000";
};

const getAuthToken = () =>
  localStorage.getItem("idToken") || sessionStorage.getItem("idToken");

const buildHeaders = (extraHeaders = {}) => {
  const token = getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
};

const requestJson = async (path, options = {}) => {
  const apiBaseUrl = resolveApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: buildHeaders(options.headers),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json();
};

export const fetchPatients = () =>
  requestJson("/patients", { method: "GET" });

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
  requestJson(`/patients/${patientId}`, {
    method: "DELETE",
  });
