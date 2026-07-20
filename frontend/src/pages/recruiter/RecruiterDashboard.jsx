import { Link } from "react-router-dom";

export default function RecruiterDashboard() {
  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Recruiter Dashboard</h2>
      <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
        <Link to="/recruiter/post" className="card">
          <h3>➕ Post Internship</h3>
        </Link>
        <Link to="/recruiter/listings" className="card">
          <h3>📋 My Listings</h3>
        </Link>
        <Link to="/recruiter/applicants" className="card">
          <h3>🧑‍🤝‍🧑 Applicants</h3>
        </Link>
        <Link to="/recruiter/analytics" className="card">
          <h3>📊 Analytics</h3>
        </Link>
      </div>
    </section>
  );
}
