import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import { getRelativeTimeInfo } from "../utils/date";
import { useI18n } from "../context/I18nContext";
import EmptyState from "./EmptyState";

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  function formatRelativeTime(isoDate) {
    const info = getRelativeTimeInfo(isoDate);
    if (info.type === "today") return t("time.today");
    if (info.type === "future") {
      return info.days === 1 ? t("time.inOneDay") : t("time.inDays", { days: info.days });
    }
    return info.days === 1 ? t("time.oneDayAgo") : t("time.daysAgo", { days: info.days });
  }

  function handleClick(notification) {
    if (!notification.read) markRead(notification.id);
    setOpen(false);
    if (notification.link) navigate(notification.link);
  }

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((prev) => !prev)} aria-label={t("notifications.ariaLabel")}>
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
            <strong>{t("notifications.title")}</strong>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ fontSize: "0.8rem" }}>
                {t("notifications.markAllRead")}
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <EmptyState icon="🔔" title={t("notifications.emptyTitle")} />
          ) : (
            <ul style={{ display: "grid", gap: 4 }}>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(n)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClick(n);
                    }
                  }}
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
