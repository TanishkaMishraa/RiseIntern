import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { useToastContext } from "./ToastContext";
import {
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notifications";

const NotificationContext = createContext(null);
const POLL_INTERVAL_MS = 30000;

export function NotificationProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const { showToast } = useToastContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const previousUnreadCount = useRef(0);

  const refreshList = useCallback(() => {
    if (!isAuthenticated) return;
    listNotifications(token).then(setNotifications).catch(() => {});
  }, [isAuthenticated, token]);

  const refreshUnreadCount = useCallback(() => {
    if (!isAuthenticated) return;
    getUnreadCount(token)
      .then(({ count }) => {
        if (count > previousUnreadCount.current) {
          showToast("You have a new notification", "info");
          refreshList();
        }
        previousUnreadCount.current = count;
        setUnreadCount(count);
      })
      .catch(() => {});
  }, [isAuthenticated, token, showToast, refreshList]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      previousUnreadCount.current = 0;
      return;
    }

    refreshList();
    refreshUnreadCount();

    const interval = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const markRead = useCallback(
    async (id) => {
      setNotifications((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((current) => Math.max(0, current - 1));
      try {
        await markNotificationRead(id, token);
      } catch (err) {
        refreshList();
        refreshUnreadCount();
      }
    },
    [token, refreshList, refreshUnreadCount]
  );

  const markAllRead = useCallback(async () => {
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead(token);
    } catch (err) {
      refreshList();
      refreshUnreadCount();
    }
  }, [token, refreshList, refreshUnreadCount]);

  const value = useMemo(
    () => ({ notifications, unreadCount, refreshList, markRead, markAllRead }),
    [notifications, unreadCount, refreshList, markRead, markAllRead]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotificationContext must be used within a NotificationProvider");
  return ctx;
}
