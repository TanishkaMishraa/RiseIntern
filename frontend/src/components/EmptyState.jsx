import { Link } from "react-router-dom";

export default function EmptyState({ icon = "Inbox", title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p style={{ marginTop: 8, opacity: 0.8 }}>{description}</p>}
      {action?.to && (
        <Link className="i-btn empty-state__action" to={action.to}>
          {action.label}
        </Link>
      )}
      {action && !action.to && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}