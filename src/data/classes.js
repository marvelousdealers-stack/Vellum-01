// ═══════════════════════════════════════════════════════════════
// ADMIN DATA
// ═══════════════════════════════════════════════════════════════
export const CLASSES = [
  { id: "cls-11a", code: "11A", name: "Grade 11 — Section A", teachers: ["R. Chen", "L. Park"], students: 32, subjects: 3 },
  { id: "cls-11b", code: "11B", name: "Grade 11 — Section B", teachers: ["D. Osei"],           students: 30, subjects: 2 },
  { id: "cls-10a", code: "10A", name: "Grade 10 — Section A", teachers: ["L. Park"],           students: 28, subjects: 4 },
];

// ═══════════════════════════════════════════════════════════════
// CLASS STATS
// Per-class aggregates for the teacher dashboard. Keyed by the
// class's `code` (see CLASSES above), so a real API response can
// swap in without changing consumers.
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
// CLASS ROSTERS — used by admin ClassDetail
// ═══════════════════════════════════════════════════════════════
export const CLASS_ROSTERS = {
  "Grade 11 — Section A": {
    teachers: [
      { name: "Dr. R. Chen",  email: "r.chen@westfield.edu", subjects: ["Physics", "Maths"],    classes: 2 },
      { name: "Mrs. L. Park", email: "l.park@westfield.edu", subjects: ["Chemistry"],           classes: 2 },
    ],
    students: [
      { name: "Amelia Chen",     roll: "11A-01", email: "a.chen@westfield.edu",      avg: 91, status: "Active"   },
      { name: "Adrian Bell",     roll: "11A-04", email: "a.bell@westfield.edu",      avg: 78, status: "Active"   },
      { name: "Dmitri Volkov",   roll: "11A-11", email: "d.volkov@westfield.edu",    avg: 74, status: "Active"   },
      { name: "Jayden Park",     roll: "11A-15", email: "j.park@westfield.edu",      avg: 81, status: "Active"   },
      { name: "Layla Hassan",    roll: "11A-17", email: "l.hassan@westfield.edu",    avg: 88, status: "Active"   },
      { name: "Maya Okafor",     roll: "11A-19", email: "m.okafor@westfield.edu",    avg: 91, status: "Active"   },
      { name: "Marcus Webb",     roll: "11A-20", email: "m.webb@westfield.edu",      avg: 69, status: "Active"   },
      { name: "Priya Nair",      roll: "11A-22", email: "p.nair@westfield.edu",      avg: 85, status: "Active"   },
      { name: "Sofia Lindqvist", roll: "11A-25", email: "s.lindqvist@westfield.edu", avg: 88, status: "Active"   },
      { name: "Tomás Reyes",     roll: "11A-28", email: "t.reyes@westfield.edu",     avg: 72, status: "Inactive" },
    ],
  },
  "Grade 11 — Section B": {
    teachers: [
      { name: "Mr. D. Osei", email: "d.osei@westfield.edu", subjects: ["Biology"], classes: 1 },
    ],
    students: [
      { name: "Hana Yamada",    roll: "11B-02", email: "h.yamada@westfield.edu",     avg: 84, status: "Active" },
      { name: "Kofi Mensah",    roll: "11B-05", email: "k.mensah@westfield.edu",     avg: 79, status: "Active" },
      { name: "Lucia Romano",   roll: "11B-08", email: "l.romano@westfield.edu",     avg: 82, status: "Active" },
      { name: "Noah Bergström", roll: "11B-12", email: "n.bergstrom@westfield.edu", avg: 76, status: "Active" },
      { name: "Ravi Sharma",    roll: "11B-16", email: "r.sharma@westfield.edu",     avg: 87, status: "Active" },
      { name: "Zara Ahmed",     roll: "11B-21", email: "z.ahmed@westfield.edu",      avg: 90, status: "Active" },
    ],
  },
  "Grade 10 — Section A": {
    teachers: [
      { name: "Mrs. L. Park", email: "l.park@westfield.edu", subjects: ["Chemistry"], classes: 2 },
    ],
    students: [
      { name: "Aiden Kelly",   roll: "10A-03", email: "a.kelly@westfield.edu",   avg: 73, status: "Active" },
      { name: "Beatriz Silva", roll: "10A-07", email: "b.silva@westfield.edu",   avg: 85, status: "Active" },
      { name: "Chen Wu",       roll: "10A-09", email: "c.wu@westfield.edu",      avg: 92, status: "Active" },
      { name: "Elena Petrova", roll: "10A-14", email: "e.petrova@westfield.edu", avg: 80, status: "Active" },
      { name: "Farid Khalil",  roll: "10A-18", email: "f.khalil@westfield.edu",  avg: 77, status: "Active" },
    ],
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
