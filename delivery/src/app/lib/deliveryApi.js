const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const parseApiResponse = async (response) => {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const getDeliveryToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("deliveryToken") || localStorage.getItem("token") || "";
};

export const deliveryApi = async (path, options = {}) => {
  const token = getDeliveryToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const formatRupee = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;
