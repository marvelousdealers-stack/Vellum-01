// ═══════════════════════════════════════════════════════════════
// MATERIALS / CLUSTERS
// ═══════════════════════════════════════════════════════════════

// Extracted text samples for the review modal (7.3)
export const EXTRACTED_TEXT_SAMPLE = [
  {
    id: "e1",
    label: "physics_outline_2024.pdf",
    kind: "PDF",
    route: "DIRECT",
    quality: "high",
    text: "Course Outline — Physics 11\n\nUnit 1 · Mechanics\nNewton's three laws of motion, free body diagrams, application of F = ma. Free fall and projectile motion.\n\nUnit 2 · Energy & Momentum\nWork, kinetic and potential energy. Conservation of energy. Impulse and momentum.\n\nUnit 3 · Thermodynamics\nTemperature and heat. First law of thermodynamics. Isothermal and adiabatic processes.\n\nUnit 4 · Waves & Optics\nWave properties, interference, refraction and Snell's law. Lenses and the lens equation.",
  },
  {
    id: "e2",
    label: "IMG_2043.heic",
    kind: "IMG",
    route: "VISION",
    quality: "med",
    text: "Newton's Second Law — notes from board\n\nF = ma\n- net force (N)\n- mass (kg)\n- acceleration (m/s²)\n\nExamples:\n1. 5 kg block on frictionless surface, applied force 20 N.\n   a = 20 / 5 = 4 m/s²\n2. Incline 30°: component of gravity along slope = mg sin θ\n\nSign conventions matter! [unclear — probably \"positive direction is up the slope\"]",
  },
  {
    id: "e3",
    label: "past_paper_2023.pdf",
    kind: "SCAN",
    route: "VISION",
    quality: "high",
    text: "Physics 11 — Final Examination 2023\n\nSection A · Multiple choice (10 marks)\n1. A 5 kg block rests on a frictionless surface. A horizontal force of 20 N is applied. What is the acceleration?\n2. In an isothermal expansion, which quantity remains constant?\n...\n\nSection B · Written (40 marks)\n6. State Newton's Second Law and explain its relation to inertia.\n7. A car of mass 1200 kg decelerates from 25 m/s to rest in 8 s. Find the average braking force.\n8. Compare isothermal and adiabatic processes for an ideal gas.",
  },
  {
    id: "e4",
    label: "notes_thermo.txt",
    kind: "TXT",
    route: "AS-IS",
    quality: "high",
    text: "Thermodynamics — supplementary notes\n\n- First law: ΔU = Q - W\n- Isothermal: T constant, so ΔU = 0 for ideal gas → Q = W\n- Adiabatic: Q = 0, so ΔU = -W\n- Common mistake: students conflate \"no heat flow\" with \"constant temperature\". These are different conditions.",
  },
];

export const EXTRACTED_TOPICS = [
  { name: "Newton's Laws of Motion", weight: 8, thin: false },
  { name: "Thermodynamics",          weight: 6, thin: false },
  { name: "Kinematics",              weight: 5, thin: false },
  { name: "Wave Optics",             weight: 4, thin: true  },
  { name: "Electromagnetism",        weight: 3, thin: false },
  { name: "Gravitation",             weight: 2, thin: false },
];

export const CLUSTERS = [
  { label: "Acceleration from Newton's Second Law", years: 5, count: 8, sample: "A 5 kg block..." },
  { label: "Free body diagrams for inclined planes", years: 4, count: 6, sample: "Draw the forces on a 3 kg mass on a 30° incline..." },
  { label: "Isothermal vs adiabatic processes",     years: 3, count: 5, sample: "Compare the internal energy change..." },
  { label: "Lens sign conventions",                 years: 4, count: 6, sample: "An object sits 15 cm from a converging lens..." },
  { label: "Conservation of momentum",              years: 3, count: 4, sample: "Two carts collide and stick together..." },
];
