import { DndContext } from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import { KANBAN_COLUMNS } from "../../utils/constants";

export default function KanbanBoard({ applicants, onStatusChange }) {
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id;
    if (KANBAN_COLUMNS.includes(newStatus)) {
      onStatusChange?.(active.id, newStatus);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
        {KANBAN_COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applicants={applicants.filter((a) => a.status === status)}
          />
        ))}
      </div>
    </DndContext>
  );
}
