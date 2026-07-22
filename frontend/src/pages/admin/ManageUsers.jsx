import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminApi } from "../../api/admin";
import { useToast } from "../../hooks/useToast";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import { useI18n } from "../../context/I18nContext";

export default function ManageUsers() {
  const { token, user: currentUser } = useAuth();
  const toast = useToast();
  const { t } = useI18n();
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
    if (target.is_active && !window.confirm(t("admin.users.confirmDeactivate", { name: target.name }))) {
      return;
    }
    try {
      if (target.is_active) {
        await adminApi.deactivateUser(target.id, token);
        toast.success(t("admin.users.deactivatedToast", { name: target.name }));
      } else {
        await adminApi.reactivateUser(target.id, token);
        toast.success(t("admin.users.reactivatedToast", { name: target.name }));
      }
      reload();
    } catch (err) {
      toast.error(target.is_active ? t("admin.users.deactivateErrorToast") : t("admin.users.reactivateErrorToast"));
    }
  }

  if (isLoading || !data) return <Skeleton height="300px" />;
  if (data.items.length === 0) return <EmptyState icon="👥" title={t("admin.users.emptyTitle")} />;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>{t("admin.users.title")}</h2>
      <div className="table-responsive">
        <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">{t("admin.users.colName")}</th>
              <th align="left">{t("admin.users.colEmail")}</th>
              <th align="left">{t("admin.users.colRole")}</th>
              <th align="left">{t("admin.users.colStatus")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                <td>{u.is_active ? t("admin.users.statusActive") : t("admin.users.statusDeactivated")}</td>
                <td>
                  {u.id !== currentUser?.id && (
                    <button onClick={() => handleToggleActive(u)}>
                      {u.is_active ? t("admin.users.deactivateButton") : t("admin.users.reactivateButton")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </section>
  );
}
