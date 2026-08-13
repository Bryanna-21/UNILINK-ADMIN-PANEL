import api from "@/lib/axios";

export interface UserQueryParams {
  page?: number;
  search?: string;
  role?: "student" | "lecturer" | "admin";
}

export async function getUsers(params: UserQueryParams = {}) {
  const response = await api.get("/admin/users", { params });
  return response.data;
}

export async function setUserStatus(userId: string, status: "active" | "suspended") {
  const response = await api.patch(`/admin/users/${userId}/status`, { status });
  return response.data;
}
