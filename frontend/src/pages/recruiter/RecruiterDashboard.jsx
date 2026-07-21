import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { recruiterInternshipApi } from "../../api/internships";
import Skeleton from "../../components/Skeleton";

export default function RecruiterDashboard() {
  const { token } = useAuth();
  const [listings, setListings] = useState(null);

  useEffect(() => {
    recruiterInternshipApi.mine(token).then(setListings);
  }, [token]);

  if (listings === null) return <Skeleton height="200px" />;

  const openCount = listings.filter((l) => !l.is_closed).length;
  const closedCount = listings.length - openCount;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Recruiter Dashboard</h2>
      <div style={{ display: "flex", gap: 20, margin: "20px 0", flexWrap: "wrap" }}>
        <div className="card">
          <h3>{listings.length}</h3>
          <p>Total listings</p>
        </div>
        <div className="card">
          <h3>{openCount}</h3>
          <p>Open</p>
        </div>
        <div className="card">
          <h3>{closedCount}</h3>
          <p>Closed</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Link to="/recruiter/post" className="card">
          <h3>➕ Post Internship</h3>
        </Link>
        <Link to="/recruiter/listings" className="card">
          <h3>📋 My Listings</h3>
        </Link>
        <Link to="/recruiter/analytics" className="card">
          <h3>📊 Analytics</h3>
        </Link>
      </div>
    </section>
  );
}
