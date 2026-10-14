// ═══════════════════════════════════════════════════════════════
// QUERY CACHE (real-mode reads)
//
// A deliberately small stand-in for a data-fetching library: one entry per
// key holding { status, data, error }, de-duplicated in-flight requests,
// and invalidate(prefix) to refetch after a write. hooks/useResource.js
// wraps it for components. If the team later adopts TanStack Query, only
// useResource.js changes — every hook above it keeps the same return shape.
//
// Keys are arrays, e.g. ["tests"] or ["attempt", id]. invalidate(["tests"])
// refreshes every key that starts with "tests".
// ═══════════════════════════════════════════════════════════════
const entries = new Map(); // keyString -> { key, status, data, error, promise, stale }
const listeners = new Set();
const keyOf = (key) => JSON.stringify(key);
const emit = () => listeners.forEach((l) => l());

const IDLE = Object.freeze({ status: "idle", data: undefined, error: null, stale: false });

export const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Stable snapshot for useSyncExternalStore (same object until it changes). */
export const getSnapshot = (key) => entries.get(keyOf(key)) ?? IDLE;

/**
 * Fetch `key` unless it is already loaded, loading, or failed and not asked
 * to retry. Returns the shared promise.
 */
export const load = (key, fetcher, { force = false } = {}) => {
  const k = keyOf(key);
  const cur = entries.get(k);
  if (cur?.promise) return cur.promise;
  if (cur && !force && !cur.stale && cur.status !== "idle") {
    return Promise.resolve(cur.data);
  }

  const promise = fetcher().then(
    (data) => {
      entries.set(k, { key, status: "success", data, error: null, promise: null, stale: false });
      emit();
      return data;
    },
    (error) => {
      entries.set(k, {
        key,
        status: "error",
        data: cur?.data,
        error,
        promise: null,
        stale: false,
      });
      emit();
      throw error;
    },
  );
  // Keep showing old data while refetching; "loading" only when there is none.
  entries.set(k, {
    key,
    status: cur?.data !== undefined ? "success" : "loading",
    data: cur?.data,
    error: null,
    promise,
    stale: false,
    refreshing: cur?.data !== undefined,
  });
  emit();
  promise.catch(() => {}); // the entry carries the error; don't leak an unhandled rejection
  return promise;
};

const startsWith = (key, prefix) => prefix.every((p, i) => key[i] === p);

/**
 * Mark every entry under `prefix` stale. Entries that someone is currently
 * showing refetch right away (they registered a fetcher via `register`).
 */
const fetchers = new Map(); // keyString -> fetcher (last one registered by a mounted hook)
export const register = (key, fetcher) => {
  fetchers.set(keyOf(key), fetcher);
};
export const unregister = (key) => {
  fetchers.delete(keyOf(key));
};

export const invalidate = (prefix) => {
  for (const [k, e] of entries) {
    if (!startsWith(e.key, prefix)) continue;
    entries.set(k, { ...e, stale: true });
    const f = fetchers.get(k);
    if (f) load(e.key, f, { force: true }).catch(() => {});
  }
  emit();
};

/** Test helper. */
export const clearCache = () => {
  entries.clear();
  fetchers.clear();
  emit();
};
