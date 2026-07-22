import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminApi } from "../../api/admin";
import { useToast } from "../../hooks/useToast";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import DeadlineCountdown from "../../components/DeadlineCountdown";
import { useI18n } from "../../context/I18nContext";

export default function ManageListings() {
  const { token } = useAuth();
  const toast = useToast();
  const { t } = useI18n();
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
    if (!window.confirm(t("admin.listings.confirmTakedown", { title: listing.title }))) return;
    try {
      await adminApi.takedownInternship(listing.id, token);
      toast.success(t("admin.listings.takedownSuccessToast"));
      reload();
    } catch (err) {
      toast.error(t("admin.listings.takedownErrorToast"));
    }
  }

  if (isLoading || !data) return <Skeleton height="300px" />;
  if (data.items.length === 0) return <EmptyState icon="📋" title={t("admin.listings.emptyTitle")} />;

  return (
    <section style={{ padding: "40px 50px" }}>
      <h2>{t("admin.listings.title")}</h2>
      <div className="table-responsive">
        <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">{t("admin.listings.colTitle")}</th>
              <th align="left">{t("admin.listings.colRecruiter")}</th>
              <th align="left">{t("admin.listings.colStatus")}</th>
              <th align="left">{t("admin.listings.colDeadline")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((listing) => (
              <tr key={listing.id}>
                <td>{listing.title}</td>
                <td>{listing.recruiterName}</td>
                <td>
                  {listing.is_removed
                    ? t("admin.listings.statusRemoved")
                    : listing.is_closed
                    ? t("admin.listings.statusClosed")
                    : t("admin.listings.statusOpen")}
                </td>
                <td><DeadlineCountdown deadline={listing.deadline} /></td>
                <td>
                  {!listing.is_removed && (
                    <button onClick={() => handleTakedown(listing)}>{t("admin.listings.takeDownButton")}</button>
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
