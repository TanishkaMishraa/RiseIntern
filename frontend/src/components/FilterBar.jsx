import { useEffect, useState } from "react";
import { DOMAINS } from "../utils/constants";
import { useDebounce } from "../hooks/useDebounce";

const INITIAL_FILTERS = { q: "", domain: "", minStipend: 0, location: "" };

export default function FilterBar({ onChange }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const nextFilters = Object.fromEntries(
      Object.entries(debouncedFilters).filter(([, value]) => value !== "" && value !== 0)
    );
    onChange?.(nextFilters);
  }, [debouncedFilters, onChange]);

  function update(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="filter-bar">
      <input
        id="searchInput"
        placeholder="Search by category or skill"
        value={filters.q}
        onChange={(e) => update("q", e.target.value)}
      />

      <div className="filter-bar__domains" aria-label="Internship domains">
        {DOMAINS.map((domain) => (
          <button
            type="button"
            key={domain}
            className={filters.domain === domain ? "is-active" : ""}
            onClick={() => update("domain", filters.domain === domain ? "" : domain)}
          >
            {domain}
          </button>
        ))}
      </div>

      <label className="filter-bar__range">
        Min stipend: Rs. {filters.minStipend.toLocaleString("en-IN")}
        <input
          type="range"
          min="0"
          max="50000"
          step="1000"
          value={filters.minStipend}
          onChange={(e) => update("minStipend", Number(e.target.value))}
        />
      </label>

      <input
        placeholder="Location"
        value={filters.location}
        onChange={(e) => update("location", e.target.value)}
      />
    </div>
  );
}