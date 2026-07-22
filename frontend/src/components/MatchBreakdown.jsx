import { useState } from "react";

export default function MatchBreakdown({ matchScore, reasons = [], matchedSkills = [] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="match-breakdown">
      <button className="match-breakdown__toggle" onClick={() => setExpanded((prev) => !prev)}>
        {matchScore}% match {expanded ? "Hide details" : "Show why"}
      </button>
      {expanded && (
        <div className="match-breakdown__details">
          {matchedSkills.length > 0 && (
            <div className="skill-chip-row">
              {matchedSkills.map((skill) => (
                <span className="skill-chip" key={skill}>{skill}</span>
              ))}
            </div>
          )}
          <ul>
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}