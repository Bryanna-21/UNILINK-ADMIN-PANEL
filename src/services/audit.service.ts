import api from "@/lib/axios";

export async function getAuditLogs(page = 1) {
  const response = await api.get("/admin/audit-logs", { params: { page } });
  return response.data;
}
