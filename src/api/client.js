// Central place every backend call goes through.
//
// While there's no backend yet, MOCK_MODE stays true and every api/*.js
// module returns local mock data instead of calling fetch. Nothing outside
// this file needs to know that — components call e.g. `api.classes.list()`
// either way. When the real backend is ready, flip MOCK_MODE (or wire it to
// an env var) and fill in the fetch calls below; component code doesn't
// change.
//
// Keeping every network call behind one wrapper — rather than scattering
// fetch() calls through components — is what makes it realistic to add
// auth headers, retry, or error handling in one place later. This mirrors
// the guide's own advice for the AI-calling code on the backend: isolate
// anything that talks to an outside system so swapping it out later means
// changing one small area, not the whole app.
export const MOCK_MODE = true;

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "/api";

// Simulates realistic network latency for mock responses, so loading
// states get exercised during frontend-only development instead of
// resolving instantly every time.
export const mockDelay = (ms = 400 + Math.random() * 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// Attach the login token (once real auth exists) and normalize error
// handling. Not used yet while MOCK_MODE is true, but every api/*.js
// module is already written to call this, so turning MOCK_MODE off is a
// one-line change plus whatever real endpoints replace the mocks.
export const request = async (path, { method = "GET", body, headers } = {}) => {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body (e.g. 204) — fine.
  }

  if (!res.ok) {
    throw new ApiError(data?.message || res.statusText, res.status, data);
  }
  return data;
};
