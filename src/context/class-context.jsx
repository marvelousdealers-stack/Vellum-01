import { createContext, useContext } from "react";

export const ClassContext = createContext({
  activeClass: null,
  setActiveClass: () => {},
  classes: [],
});

export const useActiveClass = () => useContext(ClassContext);

// Per-class stats for the teacher dashboard. In production these come
// from the API per class; here they're static so the switcher has
// something visible to change.
export const CLASS_STATS = {
  "11A": {
    students: 32,
    avg: 84,
    topics: 6,
    tests: 6,
    belowTarget: 2,
    pendingReviews: 8,
  },
  "11B": {
    students: 30,
    avg: 79,
    topics: 6,
    tests: 4,
    belowTarget: 3,
    pendingReviews: 12,
  },
  "10A": {
    students: 28,
    avg: 81,
    topics: 5,
    tests: 5,
    belowTarget: 1,
    pendingReviews: 4,
  },
};

// Map the full class name from CLASSES to a short code the stats use.
export const classShort = (name) => {
  if (!name) return "11A";
  if (name.includes("11") && name.includes("A")) return "11A";
  if (name.includes("11") && name.includes("B")) return "11B";
  if (name.includes("10") && name.includes("A")) return "10A";
  return "11A";
};