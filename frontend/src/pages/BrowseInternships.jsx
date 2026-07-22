import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import InternshipCard from "../components/InternshipCard";
import ApplyModal from "../components/ApplyModal";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";
import { useInternships } from "../hooks/useInternships";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

export default function BrowseInternships() {
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const { internships, isLoading, error } = useInternships(filters);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [applyTarget, setApplyTarget] = useState(null);

  const canApply = !isAuthenticated || user?.role === "student";

  function handleApplyClick(internship) {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setApplyTarget(internship);
  }

  function handleApplied(internshipId) {
    setAppliedIds((current) => new Set(current).add(internshipId));
  }

  return (
    <section className="internships" id="internships">
      <h2>{t("browse.title")}</h2>
      <p className="browse-subtitle">{t("browse.subtitle")}</p>
      <FilterBar onChange={setFilters} />

      {isLoading && (
        <div className="internship-cards">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <EmptyState icon="⚠️" title={t("browse.loadErrorTitle")} description={error.message} />
      )}

      {!isLoading && !error && internships.length === 0 && (
        <EmptyState
          icon="🔍"
          title={t("browse.noMatchTitle")}
          description={t("browse.noMatchDescription")}
        />
      )}

      {!isLoading && !error && internships.length > 0 && (
        <>
          <p className="browse-results-count">{t("browse.resultsCount", { count: internships.length })}</p>
          <div className="internship-cards">
            {internships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={{ ...internship, applied: appliedIds.has(internship.id) }}
                onApply={canApply ? handleApplyClick : undefined}
              />
            ))}
          </div>
        </>
      )}

      {applyTarget && (
        <ApplyModal
          internship={applyTarget}
          onClose={() => setApplyTarget(null)}
          onApplied={handleApplied}
        />
      )}
    </section>
  );
}
