import { createContext, useContext, useMemo, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const value = useMemo(() => {
    const unreadCount = notifications.filter((n) => !n.read).length;

    const markRead = (id) =>
      setNotifications((current) =>
        current.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

    const markAllRead = () =>
      setNotifications((current) => current.map((n) => ({ ...n, read: true })));

    return { notifications, setNotifications, unreadCount, markRead, markAllRead };
  }, [notifications]);

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotificationContext must be used within a NotificationProvider");
  return ctx;
}
