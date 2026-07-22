import { useState } from "react";
import ApplicantCard from "./ApplicantCard";
import { useI18n } from "../../context/I18nContext";

export default function KanbanColumn({ status, applicants, onDragStart, onDrop, onMove }) {
  const [isOver, setIsOver] = useState(false);
  const { t } = useI18n();

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        onDrop(status);
      }}
      style={{
        background: isOver ? "#e0f7fa" : "#f4f7fb",
        borderRadius: 12,
        padding: 12,
        minWidth: 220,
        flex: 1,
        transition: "background 0.15s",
      }}
    >
      <h4 style={{ marginBottom: 10 }}>
        {t(`status.${status}`)} ({applicants.length})
      </h4>
      {applicants.map((applicant) => (
        <ApplicantCard key={applicant.id} applicant={applicant} onDragStart={onDragStart} onMove={onMove} />
      ))}
    </div>
  );
}
