import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { getRecruiterAnalytics } from "../../api/analytics";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import { useI18n } from "../../context/I18nContext";

const FUNNEL_COLORS = ["#0073e6", "#00a86b", "#c9a818", "#ff5722", "#8a94a3"];

export default function Analytics() {
  const { token } = useAuth();
  const { t } = useI18n();
  const [data, setData] = useState(null);

  useEffect(() => {
    getRecruiterAnalytics(token).then(setData);
  }, [token]);

  if (!data) return <Skeleton height="300px" />;

  const funnelData = data.funnel.map((stage) => ({
    ...stage,
    label: t(`status.${stage.status}`),
  }));

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>{t("recruiter.analytics.title")}</h2>

      <h3 style={{ marginTop: 30, marginBottom: 10 }}>{t("recruiter.analytics.applicationsPerListingTitle")}</h3>
      {data.applicationsPerListing.length === 0 ? (
        <EmptyState
          icon="📊"
          title={t("recruiter.analytics.noListingsTitle")}
          description={t("recruiter.analytics.noListingsDescription")}
        />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.applicationsPerListing}>
            <XAxis dataKey="title" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="applications" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      )}

      <h3 style={{ marginTop: 30, marginBottom: 10 }}>{t("recruiter.analytics.funnelTitle")}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={funnelData}>
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count">
            {funnelData.map((stage) => (
              <Cell key={stage.status} fill={FUNNEL_COLORS[funnelData.indexOf(stage) % FUNNEL_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <h3 style={{ marginTop: 30, marginBottom: 10 }}>{t("recruiter.analytics.popularSkillsTitle")}</h3>
      {data.popularSkills.length === 0 ? (
        <EmptyState icon="🧩" title={t("recruiter.analytics.noSkillDataTitle")} />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.popularSkills} layout="vertical" margin={{ left: 40 }}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="skill" width={120} />
            <Tooltip />
            <Bar dataKey="count" fill="#00a86b" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
