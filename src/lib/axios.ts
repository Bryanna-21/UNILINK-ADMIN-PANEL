import axios from "axios";

const api = axios.create({
  // Falls back to the live backend so a missing env var on a preview deployment cannot send
  // every request to the admin panel's own address.
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "https://unilink-backend-1.onrender.com/api").replace(/\/+$/, ""),
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A dead session (expired, revoked, or a password change) used to leave the panel stuck showing
// errors until the person logged out by hand. These are the backend's own messages for it.
const DEAD_SESSION = ["No token provided", "Invalid token", "Session expired. Please login again."];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    if (typeof window !== "undefined" && status === 401 && DEAD_SESSION.includes(message)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("authUser");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?next=" + encodeURIComponent(window.location.pathname);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
