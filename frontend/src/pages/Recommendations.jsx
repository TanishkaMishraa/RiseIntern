import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRecommendations } from "../api/internships";
import InternshipCard from "../components/InternshipCard";
import MatchBreakdown from "../components/MatchBreakdown";
import EmptyState from "../components/EmptyState";
import ProfileCompleteness from "../components/ProfileCompleteness";
import { SkeletonCard } from "../components/Skeleton";

export default function Recommendations() {
  const { token, user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getRecommendations(token)
      .then(setRecommendations)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) {
    return (
      <section className="internships">
        <h2>Your Recommendations</h2>
        <div className="internship-cards">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <EmptyState icon="Alert" title="Couldn't load recommendations" description={error.message} />;
  }

  if (recommendations.length === 0) {
    return (
      <section className="internships">
        <div style={{ maxWidth: 560, margin: "0 auto 24px" }}>
          <ProfileCompleteness user={user} />
        </div>
        <EmptyState
          icon="Target"
          title="No recommendations yet"
          description="Add skills to your profile to get stronger matches."
          action={{ label: "Update profile", to: "/profile" }}
        />
      </section>
    );
  }

  return (
    <section className="internships">
      <h2>Your Recommendations</h2>
      <div style={{ maxWidth: 560, margin: "0 auto 24px" }}>
        <ProfileCompleteness user={user} />
      </div>
      <div className="internship-cards">
        {recommendations.map((rec) => (
          <div className="recommendation-card" key={rec.internship.id}>
            <InternshipCard internship={rec.internship} />
            <MatchBreakdown
              matchScore={rec.matchScore}
              reasons={rec.reasons}
              matchedSkills={rec.matchedSkills ?? rec.matched_skills ?? []}
            />
          </div>
        ))}
      </div>
    </section>
  );
}