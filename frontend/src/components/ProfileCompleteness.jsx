const FIELDS = [
  { key: "skills", label: "skills", filled: (user) => (user?.skills?.length ?? 0) > 0 },
  { key: "education", label: "education", filled: (user) => Boolean(user?.education) },
  { key: "location", label: "location", filled: (user) => Boolean(user?.location) },
];

export default function ProfileCompleteness({ user }) {
  const missing = FIELDS.filter((field) => !field.filled(user));
  const percent = Math.round(((FIELDS.length - missing.length) / FIELDS.length) * 100);

  return (
    <div>
      <div style={{ background: "#eee", borderRadius: 20, height: 10, overflow: "hidden" }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "var(--color-accent, #c9a818)",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <p style={{ fontSize: "0.85rem", marginTop: 6 }}>
        Profile {percent}% complete
        {missing.length > 0 &&
          ` — add your ${missing.map((f) => f.label).join(", ")} to unlock better matches`}
      </p>
    </div>
  );
}
