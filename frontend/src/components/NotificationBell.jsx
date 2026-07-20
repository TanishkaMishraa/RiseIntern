import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

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
            minWidth: 260,
            padding: 10,
            zIndex: 1000,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Notifications</strong>
            <button onClick={markAllRead}>Mark all read</button>
          </div>
          {notifications.length === 0 && <p>No notifications yet.</p>}
          <ul>
            {notifications.map((n) => (
              <li
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{ fontWeight: n.read ? 400 : 700, cursor: "pointer" }}
              >
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
