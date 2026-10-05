import { MOCK_MODE, mockDelay, request } from "./client";
import { TOPICS } from "@/data/analytics";
import { STUDENTS } from "@/data/users";
import { createId } from "@/lib/id";

// Matches §7.7 of the guide: while a test is active, the student's
// browser checks in periodically to see if the teacher has stopped the
// test early. 20s is the interval the guide itself suggests — frequent
// enough to feel responsive, infrequent enough not to hammer a free-tier
// backend.
export const LIVE_STATUS_INTERVAL_MS = 20_000;

/**
 * Real endpoint: GET /api/tests/:id/live-status
 * Real response: { stopped: boolean, closesAt?: string }
 *
 * Mock behavior: never reports stopped. There's no real "stop this test"
 * action to test against yet (that lives on the teacher's side, in
 * StopTestOverlay's trigger), so this just keeps the polling loop honest
 * about what a real integration will look like, without it accidentally
 * halting a demo attempt after a fixed delay the way the old hardcoded
 * 20-second setTimeout did.
 */
export const getLiveStatus = async (testId) => {
  if (MOCK_MODE) {
    await mockDelay(150);
    return { stopped: false };
  }
  return request(`/tests/${testId}/live-status`);
};

/**
 * Real endpoint: POST /api/tests/:id/stop-now
 */
export const stopTestNow = async (testId) => {
  if (MOCK_MODE) {
    await mockDelay(150);
    return { stopped: true };
  }
  return request(`/tests/${testId}/stop-now`, { method: "POST" });
};

/**
 * Proposed endpoint: POST /api/tests/:id/extend  body: { minutes }
 * NOT in the guide's Section 8 table — the guide covers stopping a live
 * test but not extending one, so the backend needs to add this route.
 * Real response: { closesAt: string } (the new close time).
 */
export const extendTest = async (testId, minutes) => {
  if (MOCK_MODE) {
    await mockDelay(150);
    return { extendedBy: minutes };
  }
  return request(`/tests/${testId}/extend`, { method: "POST", body: { minutes } });
};

// ═══════════════════════════════════════════════════════════════
// MOCK GENERATION ENGINE
//
// Everything below simulates what a real POST /api/tests/generate would
// return (§7.6 of the guide — question generation via an LLM call).
// It deliberately lives here, behind generateTest(), rather than inside
// any component: components should only ever ask the API layer for
// questions, never synthesize them locally. That's what makes swapping
// this block out for a real backend call a one-function change instead
// of a hunt through the UI for every place that built its own mock
// questions.
// ═══════════════════════════════════════════════════════════════
const MCQ_TEMPLATES = [
  {
    text: "A 5 kg block rests on a frictionless horizontal surface. A horizontal force of 20 N is applied. What is the block's acceleration?",
    options: ["2 m/s²", "4 m/s²", "10 m/s²", "25 m/s²"],
    correctIndex: 1,
  },
  {
    text: "In an isothermal expansion of an ideal gas, which quantity remains constant throughout the process?",
    options: ["Internal energy", "Pressure", "Volume", "Heat transferred"],
    correctIndex: 0,
  },
  {
    text: "Which of the following best describes inertia?",
    options: [
      "The force needed to move an object",
      "An object's resistance to change in motion",
      "The speed of an object in free fall",
      "The energy stored in a moving object",
    ],
    correctIndex: 1,
  },
  {
    text: "A ball is thrown straight up. At its highest point, what is its acceleration?",
    options: [
      "0 m/s²",
      "9.8 m/s² downward",
      "9.8 m/s² upward",
      "Impossible to determine",
    ],
    correctIndex: 1,
  },
];

const SHORT_TEMPLATES = [
  {
    text: "State Newton's Second Law of Motion and explain, in your own words, how it relates to the concept of inertia.",
    expectedAnswer:
      "The net force on an object equals its mass times its acceleration (F = ma). Inertia is the resistance of an object to any change in its motion; it is proportional to mass, so a larger mass requires a larger net force for the same acceleration.",
    rubric: [
      { label: "Correctly states the law", points: 2 },
      { label: "Connects to inertia", points: 1 },
      { label: "Uses correct terminology", points: 1 },
    ],
  },
  {
    text: "Explain why a person standing in a moving bus falls forward when the bus stops suddenly.",
    expectedAnswer:
      "When the bus stops, the person's body continues moving forward due to inertia — the body was in motion with the bus, and no forward force acted on it to change that motion.",
    rubric: [
      { label: "References inertia", points: 2 },
      { label: "Correct direction explained", points: 1 },
    ],
  },
];

const LONG_TEMPLATES = [
  {
    text: "Compare and contrast isothermal and adiabatic processes for an ideal gas. Your answer should discuss temperature, heat exchange, internal energy, and the first law of thermodynamics, and give one real-world example of each.",
    expectedAnswer:
      "In an isothermal process, temperature is held constant, so the internal energy of an ideal gas does not change (ΔU = 0); all heat added is converted to work (Q = W). In an adiabatic process, no heat is exchanged with the surroundings (Q = 0), so any work done changes the internal energy (ΔU = −W). Real-world examples: isothermal — a phase change at constant temperature; adiabatic — rapid compression in a diesel engine.",
    rubric: [
      { label: "Defines isothermal correctly", points: 3 },
      { label: "Defines adiabatic correctly", points: 3 },
      { label: "Applies first law correctly", points: 2 },
      { label: "Gives valid real-world examples", points: 2 },
    ],
  },
];

const NUM_TEMPLATES = [
  {
    text: "A car of mass 1200 kg decelerates uniformly from 25 m/s to rest in 8 seconds. Calculate the magnitude of the average braking force.",
    expectedAnswer:
      "a = (0 − 25) / 8 = −3.125 m/s². F = 1200 × 3.125 = 3750 N directed opposite to the motion.",
    rubric: [
      { label: "Correct deceleration", points: 1 },
      { label: "Correct force magnitude", points: 2 },
      { label: "Correct units and direction", points: 2 },
    ],
  },
  {
    text: "A ball is thrown vertically upward with an initial speed of 15 m/s. Calculate the maximum height it reaches. Take g = 10 m/s².",
    expectedAnswer:
      "Using v² = u² − 2gh at the highest point (v = 0): h = u² / 2g = 225 / 20 = 11.25 m.",
    rubric: [
      { label: "Correct kinematic equation", points: 1 },
      { label: "Correct substitution", points: 1 },
      { label: "Correct final answer (11.25 m)", points: 1 },
    ],
  },
];

const pickTemplate = (type, index) => {
  const pools = {
    mcq: MCQ_TEMPLATES,
    truefalse: MCQ_TEMPLATES,
    short: SHORT_TEMPLATES,
    long: LONG_TEMPLATES,
    numerical: NUM_TEMPLATES,
  };
  const pool = pools[type] || SHORT_TEMPLATES;
  return pool[((index % pool.length) + pool.length) % pool.length];
};

const TYPE_LABEL = {
  mcq: "Multiple choice",
  truefalse: "True / false",
  short: "Short answer",
  long: "Long answer",
  numerical: "Numerical",
};

/**
 * Builds one question set from a mix (e.g. [{ type: "mcq", count: 4, marks: 2 }, ...]).
 * `seedOffset` shifts which template each question pulls from its pool —
 * used by buildVariants() so different students' variants don't all read
 * identically, the way a real per-student AI generation call would vary
 * naturally on its own.
 */
export const buildQuestions = (mix, seedOffset = 0) => {
  const out = [];
  let id = 1;
  let seed = seedOffset;
  let topicSeed = seedOffset;
  mix.forEach((row) => {
    for (let i = 0; i < row.count; i++) {
      const tpl = pickTemplate(row.type, seed++);
      out.push({
        id: id++,
        type: row.type,
        typeLabel: TYPE_LABEL[row.type] || "Question",
        marks: row.marks,
        text: tpl.text,
        options: tpl.options ? [...tpl.options] : null,
        correctIndex: tpl.correctIndex ?? null,
        expectedAnswer: tpl.expectedAnswer ?? "",
        rubric: tpl.rubric ? tpl.rubric.map((r) => ({ ...r })) : [],
        // Continuous counter across the whole mix, not just this row —
        // the previous version restarted at TOPICS[0] for every row type,
        // so topic tagging repeated instead of cycling across the test.
        topic: TOPICS[topicSeed++ % TOPICS.length].name,
      });
    }
  });
  return out;
};

/**
 * Personalized mode (§7.6): one question set per student, each also
 * leaning on that student's own recorded weak topic. Real backend
 * response: an array of Student Test Variant documents (Section 6).
 */
export const buildVariants = (mix, students) =>
  students.map((student, idx) => {
    const questions = buildQuestions(mix, idx * 7);
    if (student.weak) {
      const target =
        questions.find((q) => q.topic !== student.weak) || questions[0];
      if (target) target.topic = student.weak;
    }
    return {
      studentName: student.name,
      weakTopic: student.weak || null,
      questions,
    };
  });

/**
 * Real endpoint: POST /api/tests/generate
 * `config` matches DraftRulesScreen's output: mix, targetMarks, duration,
 * mode ("class" | "personal"), difficulty, focusTopics, instruction.
 *
 * Real response: a draft Test document (Section 6), plus — for
 * personalized mode — its Student Test Variant documents. Mocked here as
 * `questionSet` (class mode) or `variants` (personalized mode) so the
 * rest of the app never needs to know which one it's running against
 * until this becomes a real network call.
 */
export const generateTest = async (config) => {
  if (MOCK_MODE) {
    await mockDelay(config.mode === "personal" ? 2200 : 1400);
    const base = { id: "draft-" + createId(), status: "draft", ...config };
    return config.mode === "personal"
      ? { ...base, variants: buildVariants(config.mix, STUDENTS) }
      : { ...base, questionSet: buildQuestions(config.mix) };
  }
  return request("/tests/generate", { method: "POST", body: config });
};

/**
 * Real endpoint: none listed yet in the guide's Section 8 — regeneration
 * is modeled here as calling generate again with the test's own stored
 * config, which is the same thing a "Regenerate" button should do once a
 * real backend exists. Kept as a separate named export so call sites read
 * clearly, even though it's currently just generateTest under another
 * name.
 */
export const regenerateTest = generateTest;
