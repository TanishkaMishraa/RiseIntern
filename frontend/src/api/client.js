const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function request(path, { method = "GET", body, headers, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.detail ?? message;
    } catch {
      // Body wasn't JSON — fall back to statusText.
    }
    const error = new Error(message || `Request failed with status ${res.status}`);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
