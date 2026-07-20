import { useState } from "react";

export default function MatchBreakdown({ matchScore, reasons = [] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button onClick={() => setExpanded((prev) => !prev)}>
        {matchScore}% match {expanded ? "▲" : "▼"}
      </button>
      {expanded && (
        <ul style={{ marginTop: 8 }}>
          {reasons.map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
