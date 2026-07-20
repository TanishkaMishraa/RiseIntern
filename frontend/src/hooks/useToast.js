import { useToastContext } from "../context/ToastContext";

export function useToast() {
  const { showToast } = useToastContext();

  return {
    success: (message) => showToast(message, "success"),
    error: (message) => showToast(message, "error"),
    info: (message) => showToast(message, "info"),
  };
}
