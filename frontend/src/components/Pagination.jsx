import { useI18n } from "../context/I18nContext";

export default function Pagination({ page, pages, onChange }) {
  const { t } = useI18n();
  if (pages <= 1) return null;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
        {t("pagination.prev")}
      </button>
      <span>
        {t("pagination.pageOf", { page, pages })}
      </span>
      <button disabled={page >= pages} onClick={() => onChange(page + 1)}>
        {t("pagination.next")}
      </button>
    </div>
  );
}
