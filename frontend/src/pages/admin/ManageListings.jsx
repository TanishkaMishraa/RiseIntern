import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listInternships, deleteInternship } from "../../api/internships";
import { useToast } from "../../hooks/useToast";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import DeadlineCountdown from "../../components/DeadlineCountdown";

export default function ManageListings() {
  const { token } = useAuth();
  const toast = useToast();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listInternships({}, token)
      .then(setListings)
      .finally(() => setIsLoading(false));
  }, [token]);

  async function handleRemove(id) {
    try {
      await deleteInternship(id, token);
      setListings((current) => current.filter((l) => l.id !== id));
      toast.success("Listing removed");
    } catch (err) {
      toast.error("Could not remove listing");
    }
  }

  if (isLoading) return <Skeleton height="300px" />;
  if (listings.length === 0) return <EmptyState icon="📋" title="No listings found" />;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Manage Listings</h2>
      <div className="internship-cards">
        {listings.map((listing) => (
          <div key={listing.id} className="i-card">
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <DeadlineCountdown deadline={listing.deadline} />
            <button className="i-btn" onClick={() => handleRemove(listing.id)}>Remove</button>
          </div>
        ))}
      </div>
    </section>
  );
}
