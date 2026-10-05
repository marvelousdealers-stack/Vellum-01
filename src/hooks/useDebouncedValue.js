import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// useDebouncedValue
// Delays a rapidly-changing value. Used by search inputs.
// ═══════════════════════════════════════════════════════════════
export const useDebouncedValue = (value, delay = 200) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};
