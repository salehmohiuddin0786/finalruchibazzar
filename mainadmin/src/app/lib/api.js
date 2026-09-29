"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const readToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || sessionStorage.getItem("token") || "";
};

const emitSessionChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("mainadmin-session"));
};

const parseResponse = async (response) => {
  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const publicApiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  return parseResponse(response);
};

export const saveMainAdminSession = (data) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
  emitSessionChange();
};

export const clearMainAdminSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
  emitSessionChange();
};

export const getMainAdminSessionSnapshot = () => {
  if (typeof window === "undefined") return "";

  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  const userText = localStorage.getItem("user") || sessionStorage.getItem("user") || "";
  return `${token}\n${userText}`;
};

export const subscribeToMainAdminSession = (callback) => {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", callback);
  window.addEventListener("mainadmin-session", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("mainadmin-session", callback);
  };
};

export const parseMainAdminSession = (snapshot) => {
  try {
    const [token, userText] = String(snapshot || "").split("\n");
    const user = userText ? JSON.parse(userText) : null;

    if (!token || user?.role !== "admin") return null;
    return { token, user };
  } catch {
    clearMainAdminSession();
    return null;
  }
};

export const getStoredMainAdmin = () => parseMainAdminSession(getMainAdminSessionSnapshot());

export const apiRequest = async (path, options = {}) => {
  const token = readToken();
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseResponse(response);
};

export const getUploadUrl = (path) => {
  if (!path) return "";
  if (/^(https?:\/\/|data:|blob:)/i.test(path)) return path;
  return `${API_BASE_URL.replace(/\/api$/, "")}${path}`;
};
