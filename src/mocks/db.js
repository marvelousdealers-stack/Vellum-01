import { STUDENTS } from "@/data/users";
import { createId } from "@/lib/id";
import { isChoice } from "@/lib/questions";
import { buildQuestions, buildVariants } from "./generator";
import { buildGrades } from "./grader";
import { questionsFor, settingsOf } from "./engine";

// ═══════════════════════════════════════════════════════════════
// FAKE DATABASE (dev only)
//
// Stands in for MongoDB behind the fake server. Persisted to localStorage so
// the demo survives a refresh. Nothing in the app imports this: only
// src/mocks/handlers.js reads and writes it.
// ═══════════════════════════════════════════════════════════════
const STORAGE_KEY = "vellum.mockdb.v4";
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// ── users ──
// Persisted in the db (admins create and remove accounts). Students carry
// their class as `cls` (code) + `classId`; teachers' classes live on
// `class.teacherIds`.
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[^a-z ]/g, "").replace(/ +/g, ".");
// 11A keeps exactly the six demo students (their tests and attempts are
// seeded by name); the other classes get a few extra so their rosters aren't empty.
const EXTRA_STUDENTS = [
  ["cls-11b", "11B", "Hana Yamada", "11B-02", "h.yamada"],
  ["cls-11b", "11B", "Kofi Mensah", "11B-05", "k.mensah"],
  ["cls-11b", "11B", "Lucia Romano", "11B-08", "l.romano"],
  ["cls-11b", "11B", "Noah Bergström", "11B-12", "n.bergstrom"],
  ["cls-11b", "11B", "Ravi Sharma", "11B-16", "r.sharma"],
  ["cls-11b", "11B", "Zara Ahmed", "11B-21", "z.ahmed"],
  ["cls-10a", "10A", "Aiden Kelly", "10A-03", "a.kelly"],
  ["cls-10a", "10A", "Beatriz Silva", "10A-07", "b.silva"],
  ["cls-10a", "10A", "Chen Wu", "10A-09", "c.wu"],
  ["cls-10a", "10A", "Elena Petrova", "10A-14", "e.petrova"],
  ["cls-10a", "10A", "Farid Khalil", "10A-18", "f.khalil"],
];
const seedUsers = () => [
  { id: "u-teacher", name: "Dr. R. Chen", email: "r.chen@westfield.edu", role: "teacher", active: true },
  { id: "u-park", name: "Mrs. L. Park", email: "l.park@westfield.edu", role: "teacher", active: true },
  { id: "u-osei", name: "Mr. D. Osei", email: "d.osei@westfield.edu", role: "teacher", active: true },
  { id: "u-admin", name: "S. Whitfield", email: "s.whitfield@westfield.edu", role: "admin", active: true },
  ...STUDENTS.map((s) => ({
    id: `u-${slug(s.name)}`,
    name: s.name,
    email: `${slug(s.name)}@westfield.edu`,
    role: "student",
    cls: "11A",
    classId: "cls-11a",
    roll: s.roll,
    active: true,
  })),
  ...EXTRA_STUDENTS.map(([classId, cls, name, roll, mail]) => ({
    id: `u-${slug(name)}`,
    name,
    email: `${mail}@westfield.edu`,
    role: "student",
    cls,
    classId,
    roll,
    active: true,
  })),
];
/** The signed-in-able accounts. Always read through this, never cache the array. */
export const users = () => db().users;

// ── classes & subjects ──
// Teachers see the classes whose `teacherIds` include them; students see
// only their own class.
export const CLASSES_SEED = [
  { id: "cls-11a", code: "11A", name: "Grade 11 — Section A", teacherIds: ["u-teacher", "u-park"] },
  { id: "cls-11b", code: "11B", name: "Grade 11 — Section B", teacherIds: ["u-teacher", "u-osei"] },
  { id: "cls-10a", code: "10A", name: "Grade 10 — Section A", teacherIds: ["u-park"] },
];
const SUBJECT_NAMES = {
  "cls-11a": ["Physics", "Chemistry", "Mathematics"],
  "cls-11b": ["Physics", "Chemistry"],
  "cls-10a": ["Physics", "Chemistry", "Mathematics", "Biology"],
};
export const subjectsSeed = (now) =>
  Object.entries(SUBJECT_NAMES).flatMap(([classId, names]) =>
    names.map((name) => ({
      id: `sub-${name.slice(0, 4).toLowerCase()}-${classId.slice(4)}`,
      classId,
      name,
      outline: "",
      createdAt: now,
      updatedAt: now,
    })),
  );

// ── seed ──
const baseTest = (now, over) => ({
  subject: "Physics",
  subjectId: "sub-phys-11a",
  classId: "cls-11a",
  cls: "11A",
  schedule: null,
  publishedAt: null,
  stoppedAt: null,
  regeneratedAt: null,
  settings: {},
  createdAt: now,
  updatedAt: now,
  ...over,
});

const makeConfig = (mix, extra = {}) => ({
  mix,
  targetMarks: mix.reduce((s, r) => s + r.count * r.marks, 0),
  duration: 30,
  mode: "class",
  difficulty: "balanced",
  focusTopics: [],
  instruction: "",
  ...extra,
});

const seedTest = (now, { title, mix, mode = "class", seed, ...over }) => {
  const config = makeConfig(mix, { mode, duration: over.duration ?? 30 });
  return baseTest(now, {
    id: createId(),
    title,
    mode,
    config,
    questionSet: mode === "class" ? buildQuestions(mix, { seed }) : null,
    variants: mode === "personal" ? buildVariants(mix, STUDENTS, { seed }) : null,
    ...over,
  });
};

// Students answer at different quality, which gives the review queue a
// spread of AI marks and confidence levels.
const QUALITY = {
  "Maya Okafor": "strong",
  "Sofia Lindqvist": "strong",
  "Priya Nair": "partial",
  "Jayden Park": "partial",
  "Adrian Bell": "vague",
  "Tomás Reyes": "blank",
};
const FLAG_COUNTS = { "Adrian Bell": 2, "Tomás Reyes": 1 };

const writtenAnswer = (q, quality) => {
  const model = q.expectedAnswer || "";
  const words = model.split(" ");
  if (quality === "strong") return model;
  if (quality === "partial") return words.slice(0, Math.ceil(words.length / 2)).join(" ");
  if (quality === "vague") return "I think you use force and mass here.";
  return "";
};

const seedAttempt = (test, student, index) => {
  const quality = QUALITY[student] ?? "partial";
  const questions = questionsFor(test, null);
  const submittedAt = test.stoppedAt - (9 + index) * MINUTE;
  const attempt = {
    id: createId(),
    testId: test.id,
    student,
    variantIndex: null,
    questions,
    startedAt: submittedAt - (20 - index) * MINUTE,
    deadline: test.stoppedAt - 5 * MINUTE,
    status: "submitted",
    submittedAt,
    submitReason: "manual",
    flags: Array.from({ length: FLAG_COUNTS[student] ?? 0 }, (_, i) => ({
      type: "tab-switch",
      at: submittedAt - (4 + i * 3) * MINUTE,
    })),
    answers: {},
  };
  questions.forEach((q) => {
    attempt.answers[q.id] = isChoice(q)
      ? quality === "vague" || quality === "blank"
        ? (q.correctIndex + 1) % q.options.length
        : q.correctIndex
      : writtenAnswer(q, quality);
  });
  attempt.grades = buildGrades(questions, attempt.answers, {
    aiGrading: settingsOf(test).aiGrading,
  });
  return attempt;
};

const seed = () => {
  const now = Date.now();
  const tests = [
    seedTest(now, {
      title: "Wave Optics — Quiz 2",
      seed: 4,
      mix: [
        { type: "mcq", count: 5, marks: 2 },
        { type: "short", count: 3, marks: 4 },
        { type: "numerical", count: 2, marks: 4 },
      ],
      status: "published",
      publishedAt: now - 10 * MINUTE,
      createdAt: now - 2 * DAY,
      updatedAt: now - 10 * MINUTE,
    }),
    seedTest(now, {
      title: "Newton's Laws — Unit Test",
      seed: 0,
      mix: [
        { type: "mcq", count: 6, marks: 2 },
        { type: "short", count: 2, marks: 4 },
        { type: "numerical", count: 4, marks: 5 },
      ],
      status: "draft",
      createdAt: now - 3 * HOUR,
      updatedAt: now - 2 * MINUTE,
    }),
    seedTest(now, {
      title: "Thermodynamics — Mid-term",
      seed: 2,
      mode: "personal",
      duration: 60,
      mix: [
        { type: "mcq", count: 6, marks: 2 },
        { type: "short", count: 5, marks: 4 },
        { type: "long", count: 2, marks: 6 },
        { type: "numerical", count: 2, marks: 8 },
      ],
      status: "published",
      schedule: { availableFrom: now + DAY, availableUntil: now + DAY + 3 * HOUR },
      publishedAt: now - DAY,
      createdAt: now - 3 * DAY,
      updatedAt: now - DAY,
    }),
    seedTest(now, {
      title: "Bonding & Structure",
      subject: "Chemistry",
      subjectId: "sub-chem-11a",
      seed: 6,
      mix: [
        { type: "mcq", count: 4, marks: 2 },
        { type: "short", count: 4, marks: 3 },
        { type: "numerical", count: 2, marks: 5 },
      ],
      status: "draft",
      createdAt: now - 4 * DAY,
      updatedAt: now - 3 * DAY,
    }),
    seedTest(now, {
      title: "Kinematics — Quiz",
      seed: 1,
      mix: [
        { type: "mcq", count: 5, marks: 2 },
        { type: "numerical", count: 3, marks: 5 },
      ],
      status: "published",
      publishedAt: now - 8 * DAY,
      stoppedAt: now - 7 * DAY,
      createdAt: now - 9 * DAY,
      updatedAt: now - 7 * DAY,
    }),
  ];
  const finished = tests.find((t) => t.title === "Kinematics — Quiz");
  return {
    version: 4,
    users: seedUsers(),
    classes: CLASSES_SEED.map((c) => ({ ...c })),
    subjects: subjectsSeed(now),
    tests,
    attempts: STUDENTS.map((s, i) => seedAttempt(finished, s.name, i)),
  };
};

// ── persistence ──
const load = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return parsed?.version === 4 && Array.isArray(parsed.tests) ? parsed : null;
  } catch {
    return null;
  }
};

let state = null;
let timer = null;
const persist = () => {
  clearTimeout(timer);
  timer = null;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — memory still works */
  }
};

/** The one handle handlers use. Mutate `db()` freely, then call `save()`. */
export const db = () => (state ??= load() ?? seed());
export const save = () => {
  if (timer == null) timer = setTimeout(persist, 200);
};
export const resetMockData = () => {
  state = seed();
  persist();
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", persist);
  window.__resetVellum = resetMockData;
}
