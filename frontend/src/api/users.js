import { apiClient } from "./client";

export function updateProfile(payload, token) {
  return apiClient.patch("/users/me", payload, { token });
}
