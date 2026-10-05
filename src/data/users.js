export const STUDENTS = [
  { name: "Maya Okafor",     overall: 91, weak: "Wave Optics",      strong: "Newton's Laws", flags: 0 },
  { name: "Sofia Lindqvist", overall: 88, weak: "Thermodynamics",   strong: "Kinematics",    flags: 0 },
  { name: "Priya Nair",      overall: 85, weak: "Thermodynamics",   strong: "Newton's Laws", flags: 0 },
  { name: "Jayden Park",     overall: 81, weak: "Electromagnetism", strong: "Newton's Laws", flags: 0 },
  { name: "Adrian Bell",     overall: 78, weak: "Electromagnetism", strong: "Kinematics",    flags: 2 },
  { name: "Tomás Reyes",     overall: 72, weak: "Wave Optics",      strong: "Gravitation",   flags: 1 },
];

export const USERS = [
  { name: "Dr. R. Chen",  email: "r.chen@westfield.edu",   role: "Teacher", cls: "11A, 11B", status: "Active" },
  { name: "Mrs. L. Park", email: "l.park@westfield.edu",   role: "Teacher", cls: "11A, 10A", status: "Active" },
  { name: "Mr. D. Osei",  email: "d.osei@westfield.edu",   role: "Teacher", cls: "11B",      status: "Active" },
  { name: "Maya Okafor",  email: "m.okafor@westfield.edu", role: "Student", cls: "11A",      status: "Active" },
  { name: "Adrian Bell",  email: "a.bell@westfield.edu",   role: "Student", cls: "11A",      status: "Active" },
  { name: "Tomás Reyes",  email: "t.reyes@westfield.edu",  role: "Student", cls: "11B",      status: "Inactive" },
];

// ═══════════════════════════════════════════════════════════════
// STUDENT PROFILES
// ═══════════════════════════════════════════════════════════════
export const STUDENT_PROFILES = {
  default: { attempts: 6, strongScore: 92, weakScore: 58, gap: 6, trailing: false, bias: { overall: 0 } },
  "Maya Okafor":     { attempts: 6, strongScore: 95, weakScore: 38, gap: 3,  trailing: true,  bias: { overall: 2, "Wave Optics": -8, "Newton's Laws of Motion": 3 } },
  "Sofia Lindqvist": { attempts: 6, strongScore: 91, weakScore: 62, gap: 4,  trailing: false, bias: { overall: 4, "Thermodynamics": -12, "Kinematics": 4 } },
  "Priya Nair":      { attempts: 6, strongScore: 88, weakScore: 66, gap: 1,  trailing: false, bias: { overall: 1, "Thermodynamics": -8 } },
  "Jayden Park":     { attempts: 6, strongScore: 88, weakScore: 60, gap: -3, trailing: false, bias: { overall: -3, "Electromagnetism": -6 } },
  "Adrian Bell":     { attempts: 6, strongScore: 82, weakScore: 52, gap: -6, trailing: false, bias: { overall: -6, "Electromagnetism": -8, "Newton's Laws of Motion": 2 } },
  "Tomás Reyes":     { attempts: 6, strongScore: 78, weakScore: 42, gap: -12, trailing: false, bias: { overall: -12, "Wave Optics": -10, "Gravitation": 4 } },
};
