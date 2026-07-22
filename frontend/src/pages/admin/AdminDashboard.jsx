import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { getAdminAnalytics } from "../../api/analytics";
import Skeleton from "../../components/Skeleton";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminAnalytics(token).then(setStats);
  }, [token]);

  if (!stats) return <Skeleton height="300px" />;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: "flex", gap: 20, marginBottom: 30, flexWrap: "wrap" }}>
        <div className="card"><h3>{stats.totalUsers}</h3><p>Users</p></div>
        <div className="card"><h3>{stats.totalListings}</h3><p>Listings</p></div>
        <div className="card"><h3>{stats.totalApplications}</h3><p>Applications</p></div>
      </div>
      <div style={{ display: "flex", gap: 20, marginBottom: 30, flexWrap: "wrap" }}>
        <Link to="/admin/users" className="card">
          <h3>👥 Manage Users</h3>
        </Link>
        <Link to="/admin/listings" className="card">
          <h3>📋 Manage Listings</h3>
        </Link>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats.signupsOverTime}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
