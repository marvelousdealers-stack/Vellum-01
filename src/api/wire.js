// ═══════════════════════════════════════════════════════════════
// WIRE ADAPTERS
//
// The UI works with plain objects: `id`, and times as millisecond
// timestamps. A typical Express + MongoDB backend sends `_id` and ISO-8601
// date strings. These functions are the only place that difference is
// handled, applied to every response in a module's real-mode branch
// (and `toWire` on request bodies), so components never see it.
// ═══════════════════════════════════════════════════════════════

// Fields that hold a point in time, anywhere in a payload.
const TIME_KEYS = new Set([
  "createdAt",
  "updatedAt",
  "publishedAt",
  "stoppedAt",
  "startedAt",
  "deadline",
  "submittedAt",
  "availableFrom",
  "availableUntil",
  "at",
  "reviewedAt",
  "closesAt",
]);

// Plain `{}` objects only — FormData, Date, Blob etc. pass through untouched.
const isPlainObject = (v) => {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};

const toMs = (v) => {
  if (v == null || typeof v === "number") return v ?? null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : t;
};

/** Server → UI: `_id` → `id`, ISO strings → ms, recursively. */
export const fromWire = (value, key) => {
  if (Array.isArray(value)) return value.map((v) => fromWire(v));
  if (isPlainObject(value)) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === "__v") continue;
      out[k === "_id" ? "id" : k] = fromWire(v, k);
    }
    return out;
  }
  return TIME_KEYS.has(key) && typeof value === "string" ? toMs(value) : value;
};

/** UI → server: ms → ISO strings, recursively. */
export const toWire = (value, key) => {
  if (Array.isArray(value)) return value.map((v) => toWire(v));
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toWire(v, k)]));
  }
  return TIME_KEYS.has(key) && typeof value === "number" ? new Date(value).toISOString() : value;
};
