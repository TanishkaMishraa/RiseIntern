import { useState } from "react";
import FilterBar from "../components/FilterBar";
import InternshipCard from "../components/InternshipCard";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { useInternships } from "../hooks/useInternships";

export default function BrowseInternships() {
  const [filters, setFilters] = useState({});
  const { internships, isLoading, error } = useInternships(filters);

  return (
    <section className="internships" id="internships">
      <h2>🔥 Explore Internship Opportunities</h2>
      <FilterBar onChange={setFilters} />

      {isLoading && (
        <div className="internship-cards">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="180px" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <EmptyState icon="⚠️" title="Couldn't load internships" description={error.message} />
      )}

      {!isLoading && !error && internships.length === 0 && (
        <EmptyState icon="🔍" title="No internships match your filters" />
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
