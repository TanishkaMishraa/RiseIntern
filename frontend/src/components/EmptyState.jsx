export default function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>{icon}</div>
      <h3>{title}</h3>
      {description && <p style={{ marginTop: 8, opacity: 0.8 }}>{description}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}
