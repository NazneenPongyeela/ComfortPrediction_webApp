// src/lib/apiClient.js
const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/$/, "");
  return "http://localhost:8000";
};

let inMemoryToken = null;

export function setAuthToken(token) {
  inMemoryToken = token;
}

export function getStoredToken() {
  return (
    inMemoryToken ||
    localStorage.getItem("idToken") ||
    sessionStorage.getItem("idToken") ||
    null
  );
}

function buildHeaders(extraHeaders) {
  const token = getStoredToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders || {}),
  };
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: buildHeaders(options.headers),
  });

  if (res.status === 401) {
    localStorage.removeItem("idToken");
    sessionStorage.removeItem("idToken");
    inMemoryToken = null;
  }

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.detail || data?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}
