import { useRef } from "react";
import KanbanColumn from "./KanbanColumn";
import { APPLICATION_STATUSES } from "../../utils/constants";

export default function KanbanBoard({ applicants, onMove }) {
  const draggedApplicant = useRef(null);

  function handleDrop(newStatus) {
    const applicant = draggedApplicant.current;
    if (applicant && applicant.status !== newStatus) {
      onMove(applicant, newStatus);
    }
    draggedApplicant.current = null;
  }

  return (
    <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
      {APPLICATION_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          applicants={applicants.filter((a) => a.status === status)}
          onDragStart={(applicant) => {
            draggedApplicant.current = applicant;
          }}
          onDrop={handleDrop}
          onMove={onMove}
        />
      ))}
    </div>
  );
}
