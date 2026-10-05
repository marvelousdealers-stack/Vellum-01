export const LMS_COURSES = [
  {
    id: 1,
    title: "Physics — Newtonian Mechanics",
    subject: "Physics",
    students: 32,
    lessons: 8,
    items: [
      { id: "l1", kind: "text",  title: "Introduction to force and motion",       duration: "8 min",  done: 32 },
      { id: "l2", kind: "video", title: "Newton's three laws, worked examples",   duration: "14 min", done: 28 },
      { id: "l3", kind: "file",  title: "Free body diagram reference sheet",      duration: "PDF",    done: 22 },
      { id: "l4", kind: "text",  title: "Applying F = ma to real problems",       duration: "12 min", done: 19 },
      { id: "l5", kind: "video", title: "Common mistakes with sign conventions",  duration: "9 min",  done: 14 },
    ],
  },
  {
    id: 2,
    title: "Physics — Waves & Optics",
    subject: "Physics",
    students: 32,
    lessons: 6,
    items: [
      { id: "w1", kind: "text",  title: "Wave properties and terminology",  duration: "10 min", done: 32 },
      { id: "w2", kind: "video", title: "Refraction and Snell's law",       duration: "16 min", done: 25 },
      { id: "w3", kind: "file",  title: "Lens equation practice problems",  duration: "PDF",    done: 18 },
    ],
  },
  {
    id: 3,
    title: "Chemistry — Bonding & Structure",
    subject: "Chemistry",
    students: 28,
    lessons: 5,
    items: [
      { id: "c1", kind: "text", title: "Ionic vs covalent bonds", duration: "11 min", done: 26 },
    ],
  },
];

export const MY_LESSONS = [
  {
    id: "l1",
    kind: "text",
    title: "Introduction to force and motion",
    duration: "8 min",
    done: true,
    body: "Force is any interaction that changes an object's motion. Newton's first law states that an object at rest stays at rest unless acted on by a net external force.",
  },
  {
    id: "l2",
    kind: "video",
    title: "Newton's three laws, worked examples",
    duration: "14 min",
    done: true,
    body: "Video walkthrough of the three laws with classroom demonstrations.",
  },
  {
    id: "l3",
    kind: "file",
    title: "Free body diagram reference sheet",
    duration: "PDF",
    done: true,
    body: "A printable one-page reference for drawing force diagrams correctly.",
  },
  {
    id: "l4",
    kind: "text",
    title: "Applying F = ma to real problems",
    duration: "12 min",
    done: false,
    body: "Once you can draw a free body diagram, the algebra is straightforward. Identify all forces, sum them by axis, and solve for the unknown.",
  },
  {
    id: "l5",
    kind: "video",
    title: "Common mistakes with sign conventions",
    duration: "9 min",
    done: false,
    body: "The five most common errors students make when assigning signs to forces and accelerations.",
  },
];

// ═══════════════════════════════════════════════════════════════
// LMS LESSONS — keyed by course id
// ═══════════════════════════════════════════════════════════════
export const LMS_LESSONS = {
  1: [
    {
      id: "l1",
      kind: "text",
      title: "Introduction to force and motion",
      duration: "8 min",
      done: true,
      body: "Force is any interaction that changes an object's motion. Newton's first law states that an object at rest stays at rest unless acted on by a net external force. Practically, this means that without a net force, velocity does not change — an object stays still if still, and keeps drifting at the same speed in the same direction if moving.",
    },
    {
      id: "l2",
      kind: "video",
      title: "Newton's three laws, worked examples",
      duration: "14 min",
      done: true,
      url: "https://www.youtube.com/watch?v=kKKM8Y-u7ds",
      body: "A visual walkthrough of the three laws using classroom demonstrations.",
    },
    {
      id: "l3",
      kind: "file",
      title: "Free body diagram reference sheet.pdf",
      duration: "2 pages",
      done: true,
      url: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
      body: "A one-page reference you can keep on your desk when solving problems.",
    },
    {
      id: "l4",
      kind: "text",
      title: "Applying F = ma to real problems",
      duration: "12 min",
      done: false,
      body: "Once you can draw a free body diagram, the algebra is straightforward. Identify all forces, resolve them by axis, sum them, and solve for the unknown. Remember that Σ F = ma applies component by component.",
    },
    {
      id: "l5",
      kind: "video",
      title: "Common mistakes with sign conventions",
      duration: "9 min",
      done: false,
      url: "https://www.youtube.com/watch?v=Z7XeTUvK6BU",
      body: "The five most common errors students make when assigning signs to forces and accelerations.",
    },
  ],
  2: [
    {
      id: "w1",
      kind: "text",
      title: "Wave properties and terminology",
      duration: "10 min",
      done: true,
      body: "Wavelength, frequency, amplitude, and speed are the four properties every wave has. The relationship v = f λ ties them together.",
    },
    {
      id: "w2",
      kind: "video",
      title: "Refraction and Snell's law",
      duration: "16 min",
      done: false,
      url: "https://www.youtube.com/watch?v=kJ4i5v6j1XU",
      body: "How light bends when it crosses between media, and how to use Snell's law to calculate the angles.",
    },
  ],
  3: [
    {
      id: "c1",
      kind: "text",
      title: "Ionic vs covalent bonds",
      duration: "11 min",
      done: false,
      body: "Ionic bonds form between metals and non-metals through electron transfer. Covalent bonds form between non-metals through electron sharing.",
    },
  ],
};
