import { apiClient } from "./client";

export function getRecruiterAnalytics(token) {
  return apiClient.get("/analytics/recruiter", { token });
}

export function getAdminAnalytics(token) {
  return apiClient.get("/analytics/admin", { token });
}
