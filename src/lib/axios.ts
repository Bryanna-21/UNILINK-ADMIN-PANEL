import axios from "axios";

const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim();

if (!configuredApiUrl) {
  console.warn(
    "NEXT_PUBLIC_API_URL is not configured. Set it to the UniLink backend API URL, including /api."
  );
}

const baseURL = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, "")
  : "/api";

const api = axios.create({
  baseURL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      window.localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
