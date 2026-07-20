import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function ApplicantCard({ applicant }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: applicant.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    background: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <strong>{applicant.name}</strong>
      <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>{applicant.internshipTitle}</p>
    </div>
  );
}
