import { apiClient } from "./client";

export const adminApi = {
  users: (page, token) => apiClient.get(`/admin/users?page=${page}&pageSize=10`, { token }),
  internships: (page, token) => apiClient.get(`/admin/internships?page=${page}&pageSize=10`, { token }),
  deactivateUser: (id, token) => apiClient.post(`/admin/users/${id}/deactivate`, {}, { token }),
  reactivateUser: (id, token) => apiClient.post(`/admin/users/${id}/reactivate`, {}, { token }),
  takedownInternship: (id, token) => apiClient.delete(`/admin/internships/${id}`, { token }),
};
