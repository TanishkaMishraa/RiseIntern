import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { recruiterInternshipApi } from "../../api/internships";
import { useToast } from "../../hooks/useToast";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import DeadlineCountdown from "../../components/DeadlineCountdown";

export default function MyListings() {
  const { token } = useAuth();
  const toast = useToast();
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
      toast.success(listing.is_closed ? "Listing reopened" : "Listing closed");
      reload();
    } catch (err) {
      toast.error("Could not update listing");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    try {
      await recruiterInternshipApi.remove(id, token);
      toast.success("Listing removed");
      reload();
    } catch (err) {
      toast.error("Could not remove listing");
    }
  }

  if (isLoading) return <Skeleton height="300px" />;

  if (listings.length === 0) {
    return <EmptyState icon="📋" title="No listings yet" description="Post your first internship to see it here." />;
  }

  return (
    <div className="internship-cards" style={{ padding: "20px 50px" }}>
      {listings.map((listing) => (
        <div key={listing.id} className="i-card">
          <h3>
            {listing.title} {listing.is_closed && <span className="badge">Closed</span>}
          </h3>
          <p>{listing.description}</p>
          <DeadlineCountdown deadline={listing.deadline} />
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <Link className="i-btn" to={`/recruiter/listings/${listing.id}/applicants`}>
              Applicants
            </Link>
            <button className="i-btn" onClick={() => handleToggleClosed(listing)}>
              {listing.is_closed ? "Reopen" : "Close"}
            </button>
            <button className="i-btn" onClick={() => handleDelete(listing.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
