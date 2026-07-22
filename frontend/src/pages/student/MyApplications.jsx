import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listMyApplications } from "../../api/applications";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import { APPLICATION_STATUSES } from "../../utils/constants";
import { useI18n } from "../../context/I18nContext";

export default function MyApplications() {
  const { token } = useAuth();
  const { t } = useI18n();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listMyApplications(token)
      .then(setApplications)
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) return <Skeleton height="300px" />;

  if (applications.length === 0) {
    return (
      <EmptyState
        icon="📄"
        title={t("student.myApplications.emptyTitle")}
        description={t("student.myApplications.emptyDescription")}
      />
    );
  }

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>{t("student.myApplications.title")}</h2>
      <div style={{ display: "flex", gap: 16, marginTop: 20, overflowX: "auto" }}>
        {APPLICATION_STATUSES.map((status) => {
          const inColumn = applications.filter((app) => app.status === status);
          return (
            <div
              key={status}
              style={{ background: "#f4f7fb", borderRadius: 12, padding: 12, minWidth: 220, flex: 1 }}
            >
              <h4 style={{ marginBottom: 10 }}>
                {t(`status.${status}`)} ({inColumn.length})
              </h4>
              {inColumn.map((app) => (
                <div
                  key={app.id}
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <strong>{app.internshipTitle}</strong>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
