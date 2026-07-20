import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listApplicantsForInternship, updateApplicationStatus } from "../../api/applications";
import { listInternships } from "../../api/internships";
import KanbanBoard from "../../components/kanban/KanbanBoard";
import { useToast } from "../../hooks/useToast";

export default function Applicants() {
  const { token, user } = useAuth();
  const toast = useToast();
  const [internshipId, setInternshipId] = useState(null);
  const [internships, setInternships] = useState([]);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    listInternships({ recruiterId: user?.id }, token).then((data) => {
      setInternships(data);
      if (data.length > 0) setInternshipId(data[0].id);
    });
  }, [token, user?.id]);

  useEffect(() => {
    if (!internshipId) return;
    listApplicantsForInternship(internshipId, token).then(setApplicants);
  }, [internshipId, token]);

  async function handleStatusChange(applicantId, newStatus) {
    setApplicants((current) =>
      current.map((a) => (a.id === applicantId ? { ...a, status: newStatus } : a))
    );
    try {
      await updateApplicationStatus(applicantId, newStatus, token);
    } catch (err) {
      toast.error("Could not update applicant status");
    }
  }

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Applicants</h2>
      <select value={internshipId ?? ""} onChange={(e) => setInternshipId(e.target.value)}>
        {internships.map((i) => (
          <option key={i.id} value={i.id}>{i.title}</option>
        ))}
      </select>
      <div style={{ marginTop: 20 }}>
        <KanbanBoard applicants={applicants} onStatusChange={handleStatusChange} />
      </div>
    </section>
  );
}
