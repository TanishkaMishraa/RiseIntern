import BookmarkButton from "./BookmarkButton";
import DeadlineCountdown from "./DeadlineCountdown";
import { useI18n } from "../context/I18nContext";

export default function InternshipCard({ internship, onViewDetails }) {
  const { t } = useI18n();
  const { id, title, domain, description, deadline, bookmarked, location, stipend } = internship;

  return (
    <div className="i-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <h3>{title}</h3>
        <BookmarkButton internshipId={id} initiallyBookmarked={bookmarked} />
      </div>
      {domain && <p className="i-card__meta">{domain}</p>}
      <p>{description}</p>
      <div className="i-card__details">
        {location && <span>{location}</span>}
        {Number(stipend) > 0 && (
          <span>{t("internshipCard.stipend", { amount: Number(stipend).toLocaleString("en-IN") })}</span>
        )}
      </div>
      <DeadlineCountdown deadline={deadline} />
      {onViewDetails && (
        <button className="i-btn" onClick={() => onViewDetails(internship)}>
          {t("internshipCard.viewDetails")}
        </button>
      )}
    </div>
  );
}
