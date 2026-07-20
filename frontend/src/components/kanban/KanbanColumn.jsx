import { useDroppable } from "@dnd-kit/core";
import ApplicantCard from "./ApplicantCard";

export default function KanbanColumn({ status, applicants }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? "#e0f7fa" : "#f4f7fb",
        borderRadius: 12,
        padding: 12,
        minWidth: 220,
        flex: 1,
      }}
    >
      <h4 style={{ textTransform: "capitalize", marginBottom: 10 }}>
        {status} ({applicants.length})
      </h4>
      {applicants.map((applicant) => (
        <ApplicantCard key={applicant.id} applicant={applicant} />
      ))}
    </div>
  );
}
