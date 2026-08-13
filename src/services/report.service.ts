import api from "@/lib/axios";

export async function getReports(status?: "open" | "resolved" | "dismissed") {
  const response = await api.get("/admin/reports", { params: status ? { status } : undefined });
  return response.data;
}

export async function setReportStatus(reportId: string, status: "open" | "resolved" | "dismissed") {
  const response = await api.patch(`/admin/reports/${reportId}/status`, { status });
  return response.data;
}
