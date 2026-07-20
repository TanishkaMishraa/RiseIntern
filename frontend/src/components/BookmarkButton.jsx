import { useState } from "react";
import { addBookmark, removeBookmark } from "../api/bookmarks";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";

export default function BookmarkButton({ internshipId, initiallyBookmarked = false }) {
  const { token } = useAuth();
  const toast = useToast();
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);

  async function toggle() {
    try {
      if (bookmarked) {
        await removeBookmark(internshipId, token);
      } else {
        await addBookmark(internshipId, token);
      }
      setBookmarked((prev) => !prev);
    } catch (err) {
      toast.error("Could not update bookmark");
    }
  }

  return (
    <button onClick={toggle} aria-pressed={bookmarked} title="Bookmark">
      {bookmarked ? "★" : "☆"}
    </button>
  );
}
