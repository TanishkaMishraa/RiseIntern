import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotificationContext } from "../context/NotificationContext";
import { listNotifications } from "../api/notifications";

export function useNotifications() {
  const { token, isAuthenticated } = useAuth();
  const { notifications, setNotifications, unreadCount, markRead, markAllRead } =
    useNotificationContext();

  useEffect(() => {
    if (!isAuthenticated) return;
    listNotifications(token).then(setNotifications).catch(() => {});
  }, [isAuthenticated, token, setNotifications]);

  return { notifications, unreadCount, markRead, markAllRead };
}
