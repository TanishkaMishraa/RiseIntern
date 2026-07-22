import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { bookmarkApi } from "../../api/bookmarks";
import InternshipCard from "../../components/InternshipCard";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import { useI18n } from "../../context/I18nContext";

export default function SavedInternships() {
  const { token } = useAuth();
  const { t } = useI18n();
  const [saved, setSaved] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookmarkApi.list(token)
      .then(setSaved)
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

  if (saved.length === 0) {
    return (
      <EmptyState
        icon="★"
        title={t("student.savedInternships.emptyTitle")}
        description={t("student.savedInternships.emptyDescription")}
      />
    );
  }

  return (
    <div className="internship-cards">
      {saved.map((internship) => (
        <InternshipCard key={internship.id} internship={{ ...internship, bookmarked: true }} />
      ))}
    </div>
  );
}
