import { TOPICS } from "@/data/analytics";
import { createId } from "@/lib/id";
import { normalizeQuestion } from "@/lib/questions";

// ═══════════════════════════════════════════════════════════════
// MOCK GENERATION ENGINE (fake backend only — see src/mocks/README.md)
//
// Stands in for the LLM call behind POST /api/tests/generate (§7.6 of
// the guide). Nothing outside src/api imports this file — components ask
// api/tests.js for a test and never build questions themselves, so
// replacing this with a real backend call touches one module.
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

const TF_TEMPLATES = [
  {
    text: "True or false: an object at rest stays at rest unless a net external force acts on it.",
    options: ["True", "False"],
    correctIndex: 0,
  },
  {
    text: "True or false: in an isothermal process for an ideal gas, the internal energy changes.",
    options: ["True", "False"],
    correctIndex: 1,
  },
  {
    text: "True or false: mass and weight are the same physical quantity.",
    options: ["True", "False"],
    correctIndex: 1,
  },
  {
    text: "True or false: ignoring air resistance, all objects fall with the same acceleration near Earth's surface.",
    options: ["True", "False"],
    correctIndex: 0,
  },
];

const pickTemplate = (type, index) => {
  const pools = {
    mcq: MCQ_TEMPLATES,
    truefalse: TF_TEMPLATES,
    short: SHORT_TEMPLATES,
    long: LONG_TEMPLATES,
    numerical: NUM_TEMPLATES,
  };
  const pool = pools[type] || SHORT_TEMPLATES;
  return pool[((index % pool.length) + pool.length) % pool.length];
};

// Teacher guidance takes priority over automatic signals (§7.6): when focus
// topics are given, questions are tagged from those; otherwise they cycle
// through every known topic.
const topicNames = (focusTopics) =>
  focusTopics?.length ? focusTopics : TOPICS.map((t) => t.name);

/**
 * One question set from a mix, e.g. [{ type: "mcq", count: 4, marks: 2 }].
 * `seed` shifts which template each question pulls, so regenerating or
 * generating per-student variants doesn't read identically every time.
 */
export const buildQuestions = (mix, { seed = 0, topics } = {}) => {
  const names = topicNames(topics);
  const out = [];
  let templateSeed = seed;
  let topicSeed = seed;
  mix.forEach((row) => {
    for (let i = 0; i < row.count; i++) {
      const tpl = pickTemplate(row.type, templateSeed++);
      out.push(
        normalizeQuestion({
          id: createId(),
          type: row.type,
          marks: row.marks,
          text: tpl.text,
          options: tpl.options,
          correctIndex: tpl.correctIndex,
          expectedAnswer: tpl.expectedAnswer,
          rubric: tpl.rubric,
          topic: names[topicSeed++ % names.length],
        }),
      );
    }
  });
  return out;
};

/**
 * Personalized mode (§7.6): one question set per student, each also
 * leaning on that student's recorded weak topic. Mirrors a Student Test
 * Variant document (Section 6).
 */
export const buildVariants = (mix, students, { seed = 0, topics } = {}) =>
  students.map((student, idx) => {
    const questions = buildQuestions(mix, { seed: seed + idx * 7, topics });
    if (student.weak && questions.length) {
      const target =
        questions.find((q) => q.topic !== student.weak) || questions[0];
      target.topic = student.weak;
    }
    return {
      studentName: student.name,
      weakTopic: student.weak || null,
      questions,
    };
  });
