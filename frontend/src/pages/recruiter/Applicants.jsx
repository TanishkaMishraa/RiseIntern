import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { applicationApi } from "../../api/applications";
import { getInternship } from "../../api/internships";
import KanbanBoard from "../../components/kanban/KanbanBoard";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import { useToast } from "../../hooks/useToast";
import { useI18n } from "../../context/I18nContext";

export default function Applicants() {
  const { id } = useParams();
  const { token } = useAuth();
  const toast = useToast();
  const { t } = useI18n();
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
      toast.error(t("recruiter.applicants.updateErrorToast"));
    }
  }

  if (applicants === null) return <Skeleton height="400px" />;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>{t("recruiter.applicants.title")}{internship ? ` — ${internship.title}` : ""}</h2>

      {applicants.length === 0 ? (
        <EmptyState
          icon="🧑‍🤝‍🧑"
          title={t("recruiter.applicants.emptyTitle")}
          description={t("recruiter.applicants.emptyDescription")}
        />
      ) : (
        <div style={{ marginTop: 20 }}>
          <KanbanBoard applicants={applicants} onMove={handleMove} />
        </div>
      )}
    </section>
  );
}
