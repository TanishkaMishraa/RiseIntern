import { useState } from "react";
import { DOMAINS } from "../utils/constants";
import { useDebounce } from "../hooks/useDebounce";

export default function FilterBar({ onChange }) {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [stipend, setStipend] = useState(0);
  const [location, setLocation] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  function emit(next) {
    onChange?.({ search: debouncedSearch, domain, minStipend: stipend, location, ...next });
  }

  return (
    <div className="filter-bar" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <input
        id="searchInput"
        placeholder="🔍 Search by category or skill..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          emit({ search: e.target.value });
        }}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {DOMAINS.map((d) => (
          <button
            key={d}
            onClick={() => {
              const next = domain === d ? "" : d;
              setDomain(next);
              emit({ domain: next });
            }}
            style={{ fontWeight: domain === d ? 700 : 400 }}
          >
            {d}
          </button>
        ))}
      </div>

      <label>
        Min stipend: ₹{stipend}
        <input
          type="range"
          min="0"
          max="50000"
          step="1000"
          value={stipend}
          onChange={(e) => {
            const v = Number(e.target.value);
            setStipend(v);
            emit({ minStipend: v });
          }}
        />
      </label>

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          emit({ location: e.target.value });
        }}
      />
    </div>
  );
}
