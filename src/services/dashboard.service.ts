import api from "@/lib/axios";

export async function getDashboardStats() {
  const response = await api.get("/admin/dashboard/stats");
  return response.data;
}

export async function getRecentUsers(limit = 8) {
  const response = await api.get("/admin/dashboard/recent-users", { params: { limit } });
  return response.data;
}
