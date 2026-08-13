import api from "@/lib/axios";

export async function getSystemHealth() {
  const response = await api.get("/admin/system-health");
  return response.data;
}
