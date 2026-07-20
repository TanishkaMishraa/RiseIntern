import { apiClient } from "./client";

export function login(credentials) {
  return apiClient.post("/auth/login", credentials);
}

export function register(payload) {
  return apiClient.post("/auth/register", payload);
}

export function logout(token) {
  return apiClient.post("/auth/logout", {}, { token });
}

export function getCurrentUser(token) {
  return apiClient.get("/auth/me", { token });
}
