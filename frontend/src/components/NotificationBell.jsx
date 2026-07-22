import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import { formatRelativeTime } from "../utils/date";
import EmptyState from "./EmptyState";

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleClick(notification) {
    if (!notification.read) markRead(notification.id);
    setOpen(false);
    if (notification.link) navigate(notification.link);
  }

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((prev) => !prev)} aria-label="Notifications">
        🔔{unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            background: "#fff",
            color: "#333",
            borderRadius: 10,
            boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
            minWidth: 300,
            maxHeight: 360,
            overflowY: "auto",
            padding: 10,
            zIndex: 2000,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <strong>Notifications</strong>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ fontSize: "0.8rem" }}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <EmptyState icon="🔔" title="No notifications yet" />
          ) : (
            <ul style={{ display: "grid", gap: 4 }}>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{
                    listStyle: "none",
                    padding: "8px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    background: n.read ? "transparent" : "#eef7ff",
                    fontWeight: n.read ? 400 : 700,
                  }}
                >
                  <div>{n.message}</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.7, fontWeight: 400 }}>
                    {formatRelativeTime(n.created_at)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
