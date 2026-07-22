import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { recruiterInternshipApi } from "../../api/internships";
import { useToast } from "../../hooks/useToast";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import DeadlineCountdown from "../../components/DeadlineCountdown";
import { useI18n } from "../../context/I18nContext";

export default function MyListings() {
  const { token } = useAuth();
  const toast = useToast();
  const { t } = useI18n();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function reload() {
    setIsLoading(true);
    recruiterInternshipApi
      .mine(token)
      .then(setListings)
      .finally(() => setIsLoading(false));
  }

  useEffect(reload, [token]);

  async function handleToggleClosed(listing) {
    try {
      await recruiterInternshipApi.update(listing.id, { is_closed: !listing.is_closed }, token);
      toast.success(listing.is_closed ? t("recruiter.myListings.reopenedToast") : t("recruiter.myListings.closedToast"));
      reload();
    } catch (err) {
      toast.error(t("recruiter.myListings.updateErrorToast"));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t("recruiter.myListings.confirmDelete"))) return;
    try {
      await recruiterInternshipApi.remove(id, token);
      toast.success(t("recruiter.myListings.removedToast"));
      reload();
    } catch (err) {
      toast.error(t("recruiter.myListings.removeErrorToast"));
    }
  }

  if (isLoading) return <Skeleton height="300px" />;

  if (listings.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title={t("recruiter.myListings.emptyTitle")}
        description={t("recruiter.myListings.emptyDescription")}
      />
    );
  }

  return (
    <div className="internship-cards" style={{ padding: "20px 50px" }}>
      {listings.map((listing) => (
        <div key={listing.id} className="i-card">
          <h3>
            {listing.title} {listing.is_closed && <span className="badge">{t("recruiter.myListings.closedBadge")}</span>}
          </h3>
          <p>{listing.description}</p>
          <DeadlineCountdown deadline={listing.deadline} />
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <Link className="i-btn" to={`/recruiter/listings/${listing.id}/applicants`}>
              {t("recruiter.myListings.applicantsLink")}
            </Link>
            <button className="i-btn" onClick={() => handleToggleClosed(listing)}>
              {listing.is_closed ? t("recruiter.myListings.reopenButton") : t("recruiter.myListings.closeButton")}
            </button>
            <button className="i-btn" onClick={() => handleDelete(listing.id)}>
              {t("recruiter.myListings.deleteButton")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
