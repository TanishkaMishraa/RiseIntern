import { useState } from "react";
import FilterBar from "../components/FilterBar";
import InternshipCard from "../components/InternshipCard";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";
import { useInternships } from "../hooks/useInternships";
import { useI18n } from "../context/I18nContext";

export default function BrowseInternships() {
  const { t } = useI18n();
  const [filters, setFilters] = useState({});
  const { internships, isLoading, error } = useInternships(filters);

  return (
    <section className="internships" id="internships">
      <h2>{t("browse.title")}</h2>
      <FilterBar onChange={setFilters} />

      {isLoading && (
        <div className="internship-cards">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <EmptyState icon="Alert" title={t("browse.loadErrorTitle")} description={error.message} />
      )}

      {!isLoading && !error && internships.length === 0 && (
        <EmptyState
          icon="Search"
          title={t("browse.noMatchTitle")}
          description={t("browse.noMatchDescription")}
        />
      )}

      {!isLoading && !error && internships.length > 0 && (
        <div className="internship-cards">
          {internships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      )}
    </section>
  );
}
