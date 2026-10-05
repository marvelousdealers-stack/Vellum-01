import { resolvePath } from "@/routes/paths";

function buildRoleItems(role, navigate) {
  const nav = (viewId, label, hint) => ({
    id: `nav-${viewId}`,
    section: "Navigate",
    label,
    hint,
    action: () => navigate(resolvePath(role, viewId)),
  });

  if (role === "teacher") {
    return [
      nav("home", "Overview", "Home"),
      nav("materials", "Materials", "Upload"),
      nav("bank", "Question bank", "Browse"),
      nav("drafts", "Drafts", "Manage"),
      nav("review", "Grade review", "Pending"),
      nav("live", "Live test", "Monitor"),
      nav("analytics", "Analytics", "Class"),
      nav("lms", "Courses", "LMS"),
      nav("chat", "Discussion", "Chat"),
    ];
  }
  if (role === "student") {
    return [
      nav("home", "Overview", "Home"),
      nav("take", "Take test", "Active"),
      nav("history", "History", "Past tests"),
      nav("lms", "Courses", "LMS"),
      nav("chat", "Discussion", "Chat"),
      nav("analytics", "Progress", "Analytics"),
    ];
  }
  return [
    nav("admin", "Overview", "Home"),
    nav("users", "Accounts", "Users"),
    nav("classes", "Classes", "Rosters"),
  ];
}

// ═══════════════════════════════════════════════════════════════
// COMMAND PALETTE ITEM BUILDER
//
// Builds the ⌘K menu from the role's known routes. Recent views are
// prepended as a "Recent" section — the same view appearing twice
// (once as recent, once as navigate) is suppressed by id dedupe.
//
// `navigate` is passed in rather than imported so this file has no
// circular import back to router.jsx.
// ═══════════════════════════════════════════════════════════════
export function buildPaletteItems({ role, recentViews, navigate }) {
  const base = buildRoleItems(role, navigate);

  if (!recentViews.length) return base;

  const seen = new Set();
  const recents = [];

  for (const viewKey of recentViews) {
    // Match by id, or by the path segment the recent-view key contains
    // (recent views are stored as "teacher/review", palette ids are
    // "nav-review" — this bridges the two).
    const viewId = viewKey.split("/").pop();
    const match = base.find(
      (it) => it.id === `nav-${viewId}` || it.id === `nav-${viewKey}`
    );
    if (!match || seen.has(match.id)) continue;
    seen.add(match.id);
    recents.push({
      ...match,
      id: `recent-${match.id}`,
      section: "Recent",
    });
  }

  return [...recents, ...base];
}
