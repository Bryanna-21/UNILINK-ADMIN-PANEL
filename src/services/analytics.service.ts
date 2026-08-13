import api from "@/lib/axios";

export async function getUserGrowth(granularity: "day" | "week" | "month" = "day", days = 30) {
  const response = await api.get("/admin/analytics/user-growth", { params: { granularity, days } });
  return response.data;
}

export async function getUniversityGrowth(granularity: "day" | "week" | "month" = "month") {
  const response = await api.get("/admin/analytics/university-growth", { params: { granularity } });
  return response.data;
}
