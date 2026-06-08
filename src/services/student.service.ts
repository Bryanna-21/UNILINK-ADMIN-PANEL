import api from "@/lib/axios";

export async function getStudents(
  page = 1,
  search = ""
) {
  const response =
    await api.get(
      "/admin/students",
      {
        params: {
          page,
          search,
        },
      }
    );

  return response.data;
}

export async function suspendStudent(
  studentId: string
) {
  const response =
    await api.patch(
      `/admin/students/${studentId}/suspend`
    );

  return response.data;
}

export async function deleteStudent(
  studentId: string
) {
  const response =
    await api.delete(
      `/admin/students/${studentId}`
    );

  return response.data;
}
