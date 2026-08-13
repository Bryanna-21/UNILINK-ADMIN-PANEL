import api from "@/lib/axios";

export interface StudentQueryParams {
  page?: number;
  search?: string;
  status?: "active" | "suspended";
  universityId?: string;
}

export async function getStudents(params: StudentQueryParams = {}) {
  const response = await api.get("/admin/students", { params });
  return response.data;
}

export async function getStudentById(studentId: string) {
  const response = await api.get(`/admin/students/${studentId}`);
  return response.data;
}

// Shared with the Users page — status is the same operation on the
// same User document regardless of which table triggered it. There is
// deliberately no hard-delete endpoint: destroying a student account
// would cascade-orphan course enrollments, submissions, and attendance
// records with no way back. Suspend/activate is the reversible,
// supported action (see UNILINK-BACKEND src/controllers/admin.controller.js).
export async function setStudentStatus(studentId: string, status: "active" | "suspended") {
  const response = await api.patch(`/admin/users/${studentId}/status`, { status });
  return response.data;
}
