// ═══════════════════════════════════════════════════════════════
// ANALYTICS DATA
// ═══════════════════════════════════════════════════════════════
export const TREND = [
  { t: "T1", class: 72, maya: 68, spread: 14 },
  { t: "T2", class: 76, maya: 74, spread: 12 },
  { t: "T3", class: 79, maya: 71, spread: 15 },
  { t: "T4", class: 81, maya: 80, spread: 11 },
  { t: "T5", class: 83, maya: 83, spread: 10 },
  { t: "T6", class: 84, maya: 86, spread: 9 },
];

export const TOPICS = [
  { name: "Newton's Laws of Motion", accuracy: 92, affected: 2,  trend: [88, 90, 91, 89, 93, 92] },
  { name: "Kinematics",              accuracy: 88, affected: 4,  trend: [80, 82, 85, 86, 87, 88] },
  { name: "Gravitation",             accuracy: 81, affected: 6,  trend: [72, 75, 78, 79, 80, 81] },
  { name: "Thermodynamics",          accuracy: 74, affected: 8,  trend: [68, 70, 72, 73, 74, 74] },
  { name: "Electromagnetism",        accuracy: 58, affected: 14, trend: [62, 60, 59, 57, 58, 58] },
  { name: "Wave Optics",             accuracy: 46, affected: 18, trend: [50, 48, 47, 45, 46, 46] },
];

// ═══════════════════════════════════════════════════════════════
// HISTORY / LIVE / LMS
// ═══════════════════════════════════════════════════════════════
export const PAST_ATTEMPTS = [
  { id: 1, test: "Newton's Laws — Unit Test", date: "14 Nov 2026", score: 88, total: 100, status: "released", flagged: 0 },
  { id: 2, test: "Thermodynamics — Quiz 3",   date: "07 Nov 2026", score: 76, total: 100, status: "released", flagged: 0 },
  { id: 3, test: "Kinematics — Unit Test",    date: "28 Oct 2026", score: 82, total: 100, status: "released", flagged: 1 },
  { id: 4, test: "Wave Optics — Quiz 2",      date: "19 Oct 2026", score: 54, total: 100, status: "released", flagged: 0 },
  { id: 5, test: "Electromagnetism — Quiz 1", date: "08 Oct 2026", score: 61, total: 100, status: "released", flagged: 0 },
  { id: 6, test: "Foundations — Diagnostic",  date: "01 Oct 2026", score: 68, total: 100, status: "released", flagged: 0 },
];

export const ATTEMPT_DETAIL = [
  {
    id: 1,
    type: "MCQ",
    topic: "Newton's Laws",
    marks: 2,
    earned: 2,
    text: "A 5 kg block rests on a frictionless surface. A force of 20 N is applied. What is the acceleration?",
    answer: "4 m/s²",
    correct: "4 m/s²",
    remark: "",
  },
  {
    id: 2,
    type: "Short answer",
    topic: "Newton's Laws",
    marks: 4,
    earned: 3.5,
    text: "State Newton's Second Law and explain how it relates to inertia.",
    answer: "F = ma. Inertia is resistance to change in motion, proportional to mass.",
    remark: "Strong. Next time use 'net external force'.",
  },
  {
    id: 3,
    type: "MCQ",
    topic: "Thermodynamics",
    marks: 2,
    earned: 2,
    text: "In isothermal expansion of an ideal gas, which quantity remains constant?",
    answer: "Internal energy",
    correct: "Internal energy",
    remark: "",
  },
  {
    id: 4,
    type: "Numerical",
    topic: "Kinematics",
    marks: 3,
    earned: 2,
    text: "A 1200 kg car decelerates from 25 m/s to rest in 8 s. Find the average braking force.",
    answer: "3750 N",
    correct: "3750 N",
    remark: "Correct answer, but the sign convention wasn't shown.",
  },
];
