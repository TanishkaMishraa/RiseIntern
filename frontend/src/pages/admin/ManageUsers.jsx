import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../api/client";
import { useToast } from "../../hooks/useToast";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";

export default function ManageUsers() {
  const { token } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/users", { token })
      .then(setUsers)
      .finally(() => setIsLoading(false));
  }, [token]);

  async function handleRemove(id) {
    try {
      await apiClient.delete(`/admin/users/${id}`, { token });
      setUsers((current) => current.filter((u) => u.id !== id));
      toast.success("User removed");
    } catch (err) {
      toast.error("Could not remove user");
    }
  }

  if (isLoading) return <Skeleton height="300px" />;
  if (users.length === 0) return <EmptyState icon="👥" title="No users found" />;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Manage Users</h2>
      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Email</th>
            <th align="left">Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td style={{ textTransform: "capitalize" }}>{u.role}</td>
              <td><button onClick={() => handleRemove(u.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
