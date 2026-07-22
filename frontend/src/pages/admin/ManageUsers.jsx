import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminApi } from "../../api/admin";
import { useToast } from "../../hooks/useToast";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";

export default function ManageUsers() {
  const { token, user: currentUser } = useAuth();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function reload() {
    setIsLoading(true);
    adminApi
      .users(page, token)
      .then(setData)
      .finally(() => setIsLoading(false));
  }

  useEffect(reload, [token, page]);

  async function handleToggleActive(target) {
    const verb = target.is_active ? "deactivate" : "reactivate";
    if (target.is_active && !window.confirm(`Deactivate ${target.name}? They won't be able to log in.`)) {
      return;
    }
    try {
      if (target.is_active) {
        await adminApi.deactivateUser(target.id, token);
        toast.success(`${target.name} deactivated`);
      } else {
        await adminApi.reactivateUser(target.id, token);
        toast.success(`${target.name} reactivated`);
      }
      reload();
    } catch (err) {
      toast.error(`Could not ${verb} user`);
    }
  }

  if (isLoading || !data) return <Skeleton height="300px" />;
  if (data.items.length === 0) return <EmptyState icon="👥" title="No users found" />;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>Manage Users</h2>
      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Email</th>
            <th align="left">Role</th>
            <th align="left">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td style={{ textTransform: "capitalize" }}>{u.role}</td>
              <td>{u.is_active ? "Active" : "Deactivated"}</td>
              <td>
                {u.id !== currentUser?.id && (
                  <button onClick={() => handleToggleActive(u)}>
                    {u.is_active ? "Deactivate" : "Reactivate"}
                  </button>
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
