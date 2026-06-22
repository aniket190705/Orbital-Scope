const rawApiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const API_BASE_URL = rawApiBaseUrl.endsWith("/api")
  ? rawApiBaseUrl.slice(0, -4)
  : rawApiBaseUrl;
const AUTH_TOKEN_STORAGE_KEY = "orbital_scope_token";

export function getStoredAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setStoredAuthToken(token) {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
}

export async function apiFetch(path, options = {}) {
  const storedToken = getStoredAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error ?? `Request failed with status ${response.status}`);
  }

  return payload;
}

export { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY };
