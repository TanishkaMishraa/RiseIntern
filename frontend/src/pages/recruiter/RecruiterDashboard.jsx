import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { recruiterInternshipApi } from "../../api/internships";
import Skeleton from "../../components/Skeleton";
import { useI18n } from "../../context/I18nContext";

export default function RecruiterDashboard() {
  const { token } = useAuth();
  const { t } = useI18n();
  const [listings, setListings] = useState(null);

  useEffect(() => {
    recruiterInternshipApi.mine(token).then(setListings);
  }, [token]);

  if (listings === null) return <Skeleton height="200px" />;

  const openCount = listings.filter((l) => !l.is_closed).length;
  const closedCount = listings.length - openCount;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>{t("recruiter.dashboard.title")}</h2>
      <div style={{ display: "flex", gap: 20, margin: "20px 0", flexWrap: "wrap" }}>
        <div className="card">
          <h3>{listings.length}</h3>
          <p>{t("recruiter.dashboard.totalListingsLabel")}</p>
        </div>
        <div className="card">
          <h3>{openCount}</h3>
          <p>{t("recruiter.dashboard.openLabel")}</p>
        </div>
        <div className="card">
          <h3>{closedCount}</h3>
          <p>{t("recruiter.dashboard.closedLabel")}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Link to="/recruiter/post" className="card">
          <h3>{t("recruiter.dashboard.postCard")}</h3>
        </Link>
        <Link to="/recruiter/listings" className="card">
          <h3>{t("recruiter.dashboard.myListingsCard")}</h3>
        </Link>
        <Link to="/recruiter/analytics" className="card">
          <h3>{t("recruiter.dashboard.analyticsCard")}</h3>
        </Link>
      </div>
    </section>
  );
}
