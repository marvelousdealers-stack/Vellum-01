// Client-side temporary IDs — used for optimistic UI (e.g. a lesson or
// draft added to local state before the backend has assigned a real one).
//
// Once a create request actually round-trips through the API, replace
// this temp id with the id the server returns — don't keep the client
// one around as if it were permanent.
//
// crypto.randomUUID() is well-supported in all current browsers and in
// Node 19+; the fallback below only matters for very old environments.
export const createId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
