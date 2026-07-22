import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminApi } from "../../api/admin";
import { useToast } from "../../hooks/useToast";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import DeadlineCountdown from "../../components/DeadlineCountdown";

export default function ManageListings() {
  const { token } = useAuth();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function reload() {
    setIsLoading(true);
    adminApi
      .internships(page, token)
      .then(setData)
      .finally(() => setIsLoading(false));
  }

  useEffect(reload, [token, page]);

  async function handleTakedown(listing) {
    if (!window.confirm(`Take down "${listing.title}"? It will be hidden from public browse.`)) return;
    try {
      await adminApi.takedownInternship(listing.id, token);
      toast.success("Listing taken down");
      reload();
    } catch (err) {
      toast.error("Could not take down listing");
    }
  }

  if (isLoading || !data) return <Skeleton height="300px" />;
  if (data.items.length === 0) return <EmptyState icon="📋" title="No listings found" />;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Manage Listings</h2>
      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Title</th>
            <th align="left">Recruiter</th>
            <th align="left">Status</th>
            <th align="left">Deadline</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((listing) => (
            <tr key={listing.id}>
              <td>{listing.title}</td>
              <td>{listing.recruiterName}</td>
              <td>
                {listing.is_removed ? "Removed" : listing.is_closed ? "Closed" : "Open"}
              </td>
              <td><DeadlineCountdown deadline={listing.deadline} /></td>
              <td>
                {!listing.is_removed && (
                  <button onClick={() => handleTakedown(listing)}>Take Down</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </section>
  );
}
