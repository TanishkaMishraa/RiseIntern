import { apiClient } from "./client";

export function uploadResume(file, token) {
  const formData = new FormData();
  formData.append("resume", file);

  return fetch(`${import.meta.env.VITE_API_BASE_URL ?? "/api"}/resumes`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error("Resume upload failed");
    return res.json();
  });
}

export function getMyResume(token) {
  return apiClient.get("/resumes/me", { token });
}

export function deleteResume(token) {
  return apiClient.delete("/resumes/me", { token });
}
