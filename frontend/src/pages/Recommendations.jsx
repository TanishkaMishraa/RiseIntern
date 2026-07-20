import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRecommendations } from "../api/internships";
import InternshipCard from "../components/InternshipCard";
import MatchBreakdown from "../components/MatchBreakdown";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

export default function Recommendations() {
  const { token } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRecommendations(token)
      .then(setRecommendations)
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) {
    return (
      <div className="internship-cards">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height="180px" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return <EmptyState icon="🎯" title="No recommendations yet" description="Complete your profile to get matched." />;
  }

  return (
    <div className="internship-cards">
      {recommendations.map((rec) => (
        <div key={rec.internship.id}>
          <InternshipCard internship={rec.internship} />
          <MatchBreakdown matchScore={rec.matchScore} reasons={rec.reasons} />
        </div>
      ))}
    </div>
  );
}
