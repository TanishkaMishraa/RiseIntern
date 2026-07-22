import { APPLICATION_STATUSES } from "../../utils/constants";
import { useI18n } from "../../context/I18nContext";

export default function ApplicantCard({ applicant, onDragStart, onMove }) {
  const { t } = useI18n();
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
      {/* Keyboard/screen-reader alternative to drag-and-drop status changes. */}
      <label
        style={{ display: "block", marginTop: 8, fontSize: "0.75rem" }}
      >
        <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
          {t("kanban.changeStatusLabel", { name: applicant.student.name })}
        </span>
        <select
          aria-label={t("kanban.changeStatusLabel", { name: applicant.student.name })}
          value={applicant.status}
          onChange={(e) => onMove?.(applicant, e.target.value)}
          style={{ width: "100%", padding: "4px 6px", borderRadius: 6, border: "1px solid #ccc" }}
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {t(`status.${status}`)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
