import { apiClient } from "./client";

export function applyToInternship(internshipId, payload, token) {
  return apiClient.post(`/internships/${internshipId}/applications`, payload, { token });
}

export function listMyApplications(token) {
  return apiClient.get("/applications/me", { token });
}

export function listApplicantsForInternship(internshipId, token) {
  return apiClient.get(`/internships/${internshipId}/applications`, { token });
}

export function updateApplicationStatus(applicationId, status, token) {
  return apiClient.patch(`/applications/${applicationId}`, { status }, { token });
}

export const applicationApi = {
  forInternship: (internshipId, token) => listApplicantsForInternship(internshipId, token),
  updateStatus: (applicationId, status, token) => updateApplicationStatus(applicationId, status, token),
};
