import { useState } from "react";
import { bookmarkApi } from "../api/bookmarks";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";

export default function BookmarkButton({ internshipId, initiallyBookmarked = false }) {
  const { token } = useAuth();
  const toast = useToast();
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);

  async function toggle() {
    const next = !bookmarked;
    setBookmarked(next);
    try {
      if (next) {
        await bookmarkApi.add(internshipId, token);
        toast.success("Saved");
      } else {
        await bookmarkApi.remove(internshipId, token);
        toast.success("Removed from saved");
      }
    } catch (err) {
      setBookmarked(!next);
      toast.error("Could not update bookmark");
    }
  }

  return (
    <button onClick={toggle} aria-pressed={bookmarked} title="Bookmark">
      {bookmarked ? "★" : "☆"}
    </button>
  );
}
