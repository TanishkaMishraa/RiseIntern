import { apiClient } from "./client";

export function listNotifications(token) {
  return apiClient.get("/notifications", { token });
}

export function markNotificationRead(id, token) {
  return apiClient.patch(`/notifications/${id}`, { read: true }, { token });
}

export function markAllNotificationsRead(token) {
  return apiClient.post("/notifications/read-all", {}, { token });
}
