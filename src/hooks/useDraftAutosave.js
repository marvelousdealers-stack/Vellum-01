import { useCallback, useEffect, useRef, useState } from "react";
import { invalidate } from "@/api/cache";
import { saveTest } from "@/api/tests";

const PAUSE_MS = 700; // wait for typing to pause before saving
const RETRY_MS = 5000;

/**
 * Autosave for the draft editor. The editor keeps the latest edits in local
 * state (so typing is never slowed or overwritten by the network) and this
 * sends them to the server a moment after the teacher pauses.
 *
 *   const { edits, change, flush, state } = useDraftAutosave(testId);
 *   change({ questionSet })      // record an edit and schedule a save
 *   await flush()                // send everything now (before publish/preview)
 *   state                        // "saved" | "saving" | "error"
 *
 * Saves are sent one at a time and in order. A failure keeps the edits and
 * retries; leaving the page sends whatever is still waiting.
 */
export const useDraftAutosave = (testId) => {
  const [edits, setEdits] = useState({});
  const [state, setState] = useState("saved");
  const pending = useRef({});
  const timer = useRef(null);
  const chain = useRef(Promise.resolve());

  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    await chain.current.catch(() => {}); // let an in-flight save finish first
    const patch = pending.current;
    if (Object.keys(patch).length === 0) {
      setState("saved");
      return;
    }
    pending.current = {};
    chain.current = saveTest(testId, patch, { refresh: false });
    try {
      await chain.current;
      if (Object.keys(pending.current).length === 0) {
        setState("saved");
        invalidate(["tests"]); // lists and counts pick up the saved draft
      }
    } catch (err) {
      pending.current = { ...patch, ...pending.current }; // newer edits win
      setState("error");
      throw err;
    }
  }, [testId]);

  const schedule = useCallback(
    (ms) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        flush().catch(() => schedule(RETRY_MS));
      }, ms);
    },
    [flush],
  );

  const change = useCallback(
    (patch) => {
      setEdits((e) => ({ ...e, ...patch }));
      pending.current = { ...pending.current, ...patch };
      setState("saving");
      schedule(PAUSE_MS);
    },
    [schedule],
  );

  // Leaving the page: send what is still waiting.
  useEffect(
    () => () => {
      flush().catch(() => {});
    },
    [flush],
  );

  return { edits, change, flush, state };
};
