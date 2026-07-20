import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listInternships, deleteInternship } from "../../api/internships";
import { useToast } from "../../hooks/useToast";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import DeadlineCountdown from "../../components/DeadlineCountdown";

export default function MyListings() {
  const { token, user } = useAuth();
  const toast = useToast();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listInternships({ recruiterId: user?.id }, token)
      .then(setListings)
      .finally(() => setIsLoading(false));
  }, [token, user?.id]);

  async function handleDelete(id) {
    try {
      await deleteInternship(id, token);
      setListings((current) => current.filter((l) => l.id !== id));
      toast.success("Listing removed");
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
          <h3>{listing.title}</h3>
          <p>{listing.description}</p>
          <DeadlineCountdown deadline={listing.deadline} />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="i-btn" onClick={() => handleDelete(listing.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
