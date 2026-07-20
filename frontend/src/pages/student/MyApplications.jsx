import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listMyApplications } from "../../api/applications";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import { KANBAN_COLUMNS } from "../../utils/constants";

export default function MyApplications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listMyApplications(token)
      .then(setApplications)
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) return <Skeleton height="300px" />;

  if (applications.length === 0) {
    return <EmptyState icon="📄" title="No applications yet" description="Apply to internships to track their status here." />;
  }

  return (
    <div style={{ padding: "20px 50px" }}>
      {applications.map((app) => (
        <div key={app.id} style={{ marginBottom: 20 }}>
          <h3>{app.internshipTitle}</h3>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {KANBAN_COLUMNS.map((status) => (
              <span
                key={status}
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: "0.8rem",
                  fontWeight: app.status === status ? 700 : 400,
                  background: app.status === status ? "#e0f7fa" : "transparent",
                  textTransform: "capitalize",
                }}
              >
                {status}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
