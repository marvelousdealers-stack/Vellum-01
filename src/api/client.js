// Central place every backend call goes through.
//
// The app only ever talks HTTP. While there is no backend, src/mocks installs
// a fake server in front of `fetch` (see src/mocks/README.md); set
// VITE_USE_MOCK=false to talk to the real one. No api/*.js module or
// component knows or cares which it is.
//
// What a backend has to match is written down in API-CONTRACT.md. Two
// conventions are handled here and in api/wire.js so the rest of the app can
// stay simple:
//   · ids may arrive as `_id` (MongoDB) → normalised to `id`
//   · dates travel as ISO-8601 strings → converted to ms timestamps
import { invalidate } from "./cache";
import { fromWire, toWire } from "./wire";

/** True while the built-in fake server is answering requests (bootstrap + login screen only). */
export const USE_MOCK = import.meta.env?.VITE_USE_MOCK !== "false";

export const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "authToken";

/**
 * Every failed request throws this. `status` is the HTTP status (0 for a
 * network failure), `code` is the backend's machine-readable reason when it
 * sends one (e.g. "NOT_RELEASED"), `message` is safe to show a user.
 */
export class ApiError extends Error {
  constructor(message, { status = 0, code = null, body = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

export const getAuthToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const setAuthToken = (token) => {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — the session just won't persist */
  }
};

// Auth code registers one handler (e.g. "clear session, go to /login") and
// every 401 from any endpoint ends up there.
let unauthorizedHandler = null;
export const onUnauthorized = (fn) => {
  unauthorizedHandler = fn;
};

const toQuery = (params) => {
  const q = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
};

export const request = async (path, { method = "GET", body, headers, params } = {}) => {
  const token = getAuthToken();
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}${toQuery(params)}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body instanceof FormData || body === undefined
          ? {}
          : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body:
        body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Can't reach the server — check your connection and try again.", {
      status: 0,
      code: "NETWORK",
    });
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body (e.g. 204) — fine.
  }

  if (!res.ok) {
    if (res.status === 401) unauthorizedHandler?.();
    throw new ApiError(data?.message || res.statusText || "Request failed", {
      status: res.status,
      code: data?.code ?? null,
      body: data,
    });
  }
  return data;
};

/**
 * request() plus the two conventions every module needs: the body is
 * converted to wire format and the response back to UI format (api/wire.js),
 * and after a successful write the listed cache keys are refreshed.
 *
 *   call("/tests/1/publish", { method: "POST", body, invalidates: [["tests"]] })
 *
 * Reads inside hooks use it without `invalidates`.
 */
export const call = async (path, { method = "GET", body, params, invalidates = [] } = {}) => {
  const res = await request(path, {
    method,
    params,
    body: body === undefined ? undefined : toWire(body),
  });
  invalidates.forEach((key) => invalidate(key));
  return res == null ? res : fromWire(res);
};
