import { apiClient } from "./client";

export function listInternships(params = {}, token) {
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/internships${query ? `?${query}` : ""}`, { token });
}

export function getInternship(id, token) {
  return apiClient.get(`/internships/${id}`, { token });
}

export function createInternship(payload, token) {
  return apiClient.post("/internships", payload, { token });
}

export function updateInternship(id, payload, token) {
  return apiClient.put(`/internships/${id}`, payload, { token });
}

export function deleteInternship(id, token) {
  return apiClient.delete(`/internships/${id}`, { token });
}

export function getRecommendations(token) {
  return apiClient.get("/internships/recommendations", { token });
}

export const recruiterInternshipApi = {
  mine: (token) => apiClient.get("/internships/mine", { token }),
  create: (payload, token) => apiClient.post("/internships", payload, { token }),
  update: (id, payload, token) => apiClient.put(`/internships/${id}`, payload, { token }),
  remove: (id, token) => apiClient.delete(`/internships/${id}`, { token }),
};
