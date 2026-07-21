export default function ApplicantCard({ applicant, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", String(applicant.id));
        onDragStart?.(applicant);
      }}
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "grab",
      }}
    >
      <strong>{applicant.student.name}</strong>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
        {applicant.student.skills.map((skill) => (
          <span
            key={skill}
            style={{
              fontSize: "0.7rem",
              background: "#e0f7fa",
              color: "#007bff",
              padding: "2px 8px",
              borderRadius: 20,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
      {applicant.cover_note && (
        <p style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: 8 }}>{applicant.cover_note}</p>
      )}
    </div>
  );
}
