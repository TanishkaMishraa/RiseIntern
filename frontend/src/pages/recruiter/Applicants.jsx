import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { applicationApi } from "../../api/applications";
import { getInternship } from "../../api/internships";
import KanbanBoard from "../../components/kanban/KanbanBoard";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import { useToast } from "../../hooks/useToast";

export default function Applicants() {
  const { id } = useParams();
  const { token } = useAuth();
  const toast = useToast();
  const [internship, setInternship] = useState(null);
  const [applicants, setApplicants] = useState(null);

  useEffect(() => {
    getInternship(id, token).then(setInternship);
    applicationApi.forInternship(id, token).then(setApplicants);
  }, [id, token]);

  async function handleMove(applicant, newStatus) {
    const previous = applicants;
    setApplicants((current) =>
      current.map((a) => (a.id === applicant.id ? { ...a, status: newStatus } : a))
    );
    try {
      await applicationApi.updateStatus(applicant.id, newStatus, token);
    } catch (err) {
      setApplicants(previous);
      toast.error("Could not update applicant status");
    }
  }

  if (applicants === null) return <Skeleton height="400px" />;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Applicants{internship ? ` — ${internship.title}` : ""}</h2>

      {applicants.length === 0 ? (
        <EmptyState icon="🧑‍🤝‍🧑" title="No applicants yet" description="Applicants will appear here once students apply." />
      ) : (
        <div style={{ marginTop: 20 }}>
          <KanbanBoard applicants={applicants} onMove={handleMove} />
        </div>
      )}
    </section>
  );
}
