import api from "@/lib/axios";

export async function getUniversities(params: { search?: string; verified?: "true" | "false" } = {}) {
  const response = await api.get("/admin/universities", { params });
  return response.data;
}

export async function setUniversityVerified(universityId: string, verified: boolean) {
  const response = await api.patch(`/admin/universities/${universityId}/verified`, { verified });
  return response.data;
}
