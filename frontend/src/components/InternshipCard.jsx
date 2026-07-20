import BookmarkButton from "./BookmarkButton";
import DeadlineCountdown from "./DeadlineCountdown";

export default function InternshipCard({ internship, onViewDetails }) {
  const { id, title, domain, description, deadline, bookmarked } = internship;

  return (
    <div className="i-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3>{title}</h3>
        <BookmarkButton internshipId={id} initiallyBookmarked={bookmarked} />
      </div>
      {domain && <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>{domain}</p>}
      <p>{description}</p>
      <DeadlineCountdown deadline={deadline} />
      <button className="i-btn" onClick={() => onViewDetails?.(internship)}>
        View Details
      </button>
    </div>
  );
}
