import { useState } from "react";
import { useI18n } from "../context/I18nContext";

export default function MatchBreakdown({ matchScore, reasons = [], matchedSkills = [] }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useI18n();

  return (
    <div className="match-breakdown">
      <button className="match-breakdown__toggle" onClick={() => setExpanded((prev) => !prev)}>
        {t("match.scoreLabel", { score: matchScore })} {expanded ? t("match.hideDetails") : t("match.showWhy")}
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
