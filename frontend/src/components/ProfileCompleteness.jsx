export default function ProfileCompleteness({ percent }) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div>
      <div style={{ background: "#eee", borderRadius: 20, height: 10, overflow: "hidden" }}>
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            background: "var(--color-accent, #c9a818)",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <p style={{ fontSize: "0.85rem", marginTop: 6 }}>
        Profile {clamped}% complete
        {clamped < 100 && " — add more details to improve your matches"}
      </p>
    </div>
  );
}
