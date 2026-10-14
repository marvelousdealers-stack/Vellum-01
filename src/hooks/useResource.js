import { useCallback, useEffect, useSyncExternalStore } from "react";
import { getSnapshot, load, register, subscribe, unregister } from "@/api/cache";

/**
 * The one way components read server data.
 *
 *   const { data, isLoading, error, refetch } = useResource(key, { fetch });
 *
 *   key             array identifying the data, e.g. ["tests"]; writes
 *                   refresh it with invalidate(["tests"]) (see api/client.js)
 *   fetch           () => Promise<value>, already adapted by api/wire.js
 *   enabled         false to skip (e.g. waiting on an id)
 *   refetchInterval ms; keep the data fresh while the screen is open
 *
 * `isLoading` is true only until the first result arrives; later refetches
 * keep showing the previous data. Pages handle loading and error once with
 * <PageLoading /> and <PageError />.
 */
export const useResource = (key, { fetch, enabled = true, refetchInterval }) => {
  const keyString = JSON.stringify(key);
  const entry = useSyncExternalStore(subscribe, () => getSnapshot(key));

  useEffect(() => {
    if (!enabled) return undefined;
    register(key, fetch);
    load(key, fetch).catch(() => {});
    return () => unregister(key);
    // `fetch` is recreated each render; the key is its identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyString, enabled]);

  const refetch = useCallback(
    () => load(key, fetch, { force: true }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keyString],
  );

  useEffect(() => {
    if (!enabled || !refetchInterval) return undefined;
    const t = setInterval(() => refetch().catch(() => {}), refetchInterval);
    return () => clearInterval(t);
  }, [enabled, refetchInterval, refetch]);

  return {
    data: entry.data,
    isLoading: enabled && (entry.status === "idle" || entry.status === "loading"),
    error: entry.status === "error" ? entry.error : null,
    refetch,
  };
};
