import { useI18n } from "../context/I18nContext";

export default function Skeleton({ width = "100%", height = "1rem", style }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

export function SkeletonCard() {
  const { t } = useI18n();
  return (
    <div className="i-card skeleton-card" aria-label={t("skeleton.loadingInternshipAriaLabel")}>
      <Skeleton width="70%" height="1.4rem" />
      <Skeleton width="36%" height="0.8rem" />
      <Skeleton height="0.9rem" />
      <Skeleton height="0.9rem" />
      <Skeleton width="52%" height="0.9rem" />
      <Skeleton width="120px" height="2.4rem" style={{ borderRadius: 25, marginTop: 10 }} />
    </div>
  );
}
