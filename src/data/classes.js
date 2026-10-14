// ═══════════════════════════════════════════════════════════════
// CLASS STATS
// Per-class aggregates for the teacher dashboard. Keyed by the
// class's `code`. Still demo numbers until the analytics phase.
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// CLASS DISCUSSION — seeded threads
// ═══════════════════════════════════════════════════════════════
export const CLASS_THREADS = [
  {
    id: 1,
    title: "Lens sign convention — when is v negative?",
    body: "In the lens equation 1/f = 1/v − 1/u, I keep getting confused about when the image distance is negative. Can someone explain with a concrete example?",
    author: "Tomás Reyes",
    role: "student",
    tag: "Question",
    time: "2 hours ago",
    lastActivity: 100,
    pinned: false,
    resolved: false,
    replies: [
      {
        id: 11,
        author: "Maya Okafor",
        role: "student",
        body: "I always check: if the image forms on the same side as the object, it's virtual, so v is negative. Otherwise positive.",
        time: "1 hour ago",
      },
      {
        id: 12,
        author: "Dr. R. Chen",
        role: "teacher",
        body: "Maya's rule is correct for a single thin lens. The cleanest way is to draw the ray diagram first — the geometry tells you which side the image is on before you ever write an equation.",
        time: "45 min ago",
      },
    ],
  },
  {
    id: 2,
    title: "Extra practice problems for Wave Optics",
    body: "I've uploaded a 4-page set of extra problems focused on sign conventions and image formation. The answers are on the last page. Try them before Thursday's test.",
    author: "Dr. R. Chen",
    role: "teacher",
    tag: "Resource",
    time: "yesterday",
    lastActivity: 95,
    pinned: true,
    resolved: false,
    replies: [
      {
        id: 21,
        author: "Priya Nair",
        role: "student",
        body: "Thanks — these are perfect. Q7 was tricky but I got it after looking at the diagram again.",
        time: "22 hours ago",
      },
    ],
  },
  {
    id: 3,
    title: "Study group for the mid-term?",
    body: "Would anyone want to meet in the library on Saturday morning to review Newton's Laws together? Thinking 10 AM, 90 minutes.",
    author: "Sofia Lindqvist",
    role: "student",
    tag: "Discussion",
    time: "3 days ago",
    lastActivity: 90,
    pinned: false,
    resolved: false,
    replies: [
      { id: 31, author: "Jayden Park",  role: "student", body: "Count me in.",                                        time: "3 days ago" },
      { id: 32, author: "Amelia Chen",  role: "student", body: "Same. I'll bring the past papers.",                    time: "2 days ago" },
      { id: 33, author: "Dmitri Volkov", role: "student", body: "Can we push to 11? I have something until 10:30.",    time: "2 days ago" },
    ],
  },
  {
    id: 4,
    title: "Reminder: test on Thursday covers Units 3 and 4",
    body: "Reminder that Thursday's test covers thermodynamics and waves. Format: 10 MCQs, 5 short answers, 2 long answers. Bring your calculators.",
    author: "Dr. R. Chen",
    role: "teacher",
    tag: "Announcement",
    time: "4 days ago",
    lastActivity: 80,
    pinned: true,
    resolved: false,
    replies: [],
  },
  {
    id: 5,
    title: "Understanding adiabatic vs isothermal — cleared up",
    body: "I was confused about the difference but after doing the two problems from Section 5.3 it clicked. In adiabatic processes Q = 0; in isothermal processes ΔU = 0.",
    author: "Layla Hassan",
    role: "student",
    tag: "Discussion",
    time: "5 days ago",
    lastActivity: 70,
    pinned: false,
    resolved: true,
    replies: [
      {
        id: 51,
        author: "Dr. R. Chen",
        role: "teacher",
        body: "Exactly right, Layla. Marking this resolved.",
        time: "5 days ago",
      },
    ],
  },
];
