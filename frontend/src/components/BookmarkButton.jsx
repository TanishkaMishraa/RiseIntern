import { useState } from "react";
import { bookmarkApi } from "../api/bookmarks";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { useI18n } from "../context/I18nContext";

export default function BookmarkButton({ internshipId, initiallyBookmarked = false }) {
  const { token } = useAuth();
  const toast = useToast();
  const { t } = useI18n();
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);

  async function toggle() {
    const next = !bookmarked;
    setBookmarked(next);
    try {
      if (next) {
        await bookmarkApi.add(internshipId, token);
        toast.success(t("bookmark.savedToast"));
      } else {
        await bookmarkApi.remove(internshipId, token);
        toast.success(t("bookmark.removedToast"));
      }
    } catch (err) {
      setBookmarked(!next);
      toast.error(t("bookmark.updateErrorToast"));
    }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? t("bookmark.removeAriaLabel") : t("bookmark.addAriaLabel")}
      title={t("bookmark.title")}
    >
      {bookmarked ? "★" : "☆"}
    </button>
  );
}
