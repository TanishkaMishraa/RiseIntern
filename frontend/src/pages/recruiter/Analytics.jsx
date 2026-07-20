import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { getRecruiterAnalytics } from "../../api/analytics";
import Skeleton from "../../components/Skeleton";

export default function Analytics() {
  const { token } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    getRecruiterAnalytics(token).then(setData);
  }, [token]);

  if (!data) return <Skeleton height="300px" />;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.applicationsPerListing}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="applications" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
