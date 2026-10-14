// Per-test options chosen in the publish dialog (guide §6 "Test": anti-cheat
// settings, result-release policy). The server stores and enforces them (and
// sends them complete); these are the dialog's starting values and a safety net
// for screens reading a test that has none.
export const DEFAULT_SETTINGS = {
  release: "after_close", // "immediately" | "after_close"  (§7.10)
  aiGrading: true, // false → every written answer goes to the manual queue (§7.9)
  allowBack: true, // false → one question at a time, no going back (§7.8)
};

export const RELEASE_LABELS = {
  immediately: "Right after each student submits",
  after_close: "Once the test has closed",
};

export const getSettings = (test) => ({ ...DEFAULT_SETTINGS, ...(test?.settings ?? {}) });
