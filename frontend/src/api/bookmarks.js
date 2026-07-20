import { apiClient } from "./client";

export function listBookmarks(token) {
  return apiClient.get("/bookmarks", { token });
}

export function addBookmark(internshipId, token) {
  return apiClient.post("/bookmarks", { internshipId }, { token });
}

export function removeBookmark(internshipId, token) {
  return apiClient.delete(`/bookmarks/${internshipId}`, { token });
}
