import { apiClient } from "./client";

export function sendChatMessage(message, history, token) {
  return apiClient.post("/chat", { message, history }, { token });
}
