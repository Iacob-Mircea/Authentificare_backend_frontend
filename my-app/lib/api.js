const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function isAuthenticated() {
  return !!getAccessToken();
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = await response.json();
  const newToken = data.acces_token || data["access token"];
  if (newToken) {
    localStorage.setItem("accessToken", newToken);
  }
  return newToken;
}

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && getRefreshToken()) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
      });
    }
  }

  return response;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (response.ok) {
    setTokens(data["access token"], data["refresh token"]);
  }
  return { response, data };
}

export async function registerUser(credentials) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function fetchCalendarEvents(start, end, type = "all") {
  const params = new URLSearchParams({ start, end, type });
  const response = await apiFetch(`/calendar/events?${params}`);
  if (!response.ok) throw new Error("Failed to load events");
  return response.json();
}

export async function fetchCategories() {
  const response = await apiFetch("/calendar/categories");
  if (!response.ok) return [];
  return response.json();
}

export async function createSimpleEvent(payload) {
  const response = await apiFetch("/calendar/simple-events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create event");
  return response.json();
}

export async function updateSimpleEvent(id, payload) {
  const response = await apiFetch(`/calendar/simple-events/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to update event");
  return response.json();
}

export async function deleteSimpleEvent(id) {
  const response = await apiFetch(`/calendar/simple-events/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete event");
  return response.json();
}

export async function patchCalendarEvent(eventType, id, start, end) {
  const response = await apiFetch(`/calendar/events/${eventType}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ start, end }),
  });
  if (!response.ok) throw new Error("Failed to update event time");
  return response.json();
}

export async function createTask(payload) {
  const response = await apiFetch("/task/task/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}

export async function updateTask(id, payload) {
  const response = await apiFetch(`/task/task/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

export async function deleteTask(id) {
  const response = await apiFetch(`/task/task/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete task");
  return response.json();
}

export async function fetchManagements() {
  const response = await apiFetch("/task/management");
  if (!response.ok) return [];
  return response.json();
}

export async function createManagement(payload) {
  const response = await apiFetch("/task/management", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create management");
  return response.json();
}
