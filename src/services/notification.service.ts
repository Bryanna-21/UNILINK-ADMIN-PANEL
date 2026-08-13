import api from "@/lib/axios";

export async function getNotifications(unreadOnly = false) {
  const response = await api.get("/admin/notifications", {
    params: unreadOnly ? { unread: "true" } : undefined,
  });
  return response.data;
}

export async function markNotificationRead(id: string) {
  const response = await api.patch(`/admin/notifications/${id}/read`);
  return response.data;
}
