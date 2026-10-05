const moduleTitle = (firstLesson) => {
  const t = firstLesson.toLowerCase();
  if (t.includes("introduction") || t.includes("force")) return "Foundations";
  if (t.includes("apply") || t.includes("problem")) return "Applications";
  if (t.includes("mistake") || t.includes("common")) return "Common pitfalls";
  if (t.includes("wave") || t.includes("lens")) return "Waves & Optics";
  return "Lessons";
};

// ═══════════════════════════════════════════════════════════════
// MODULE GROUPING (LMS)
// ═══════════════════════════════════════════════════════════════
export const groupLessonsIntoModules = (lessons) => {
  const modules = [];
  const CHUNK = 3;
  for (let i = 0; i < lessons.length; i += CHUNK) {
    modules.push({
      id: `m-${i / CHUNK}`,
      title: `Module ${Math.floor(i / CHUNK) + 1} · ${moduleTitle(lessons[i]?.title || "")}`,
      lessons: lessons.slice(i, i + CHUNK),
    });
  }
  return modules;
};
