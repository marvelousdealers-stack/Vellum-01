// ═══════════════════════════════════════════════════════════════
// VIEW PATHS
//
// Legacy feature pages still call setView("materials") etc. via
// props. This table maps those view IDs to real URLs, per role.
// The adapter in router.jsx uses resolvePath() to translate.
//
// Delete this file once all feature pages use useNavigate() and
// Link directly.
// ═══════════════════════════════════════════════════════════════
export const VIEW_PATHS = {
  admin: {
    admin:    "/admin",
    users:    "/admin/users",
    classes:  "/admin/classes",
  },
  teacher: {
    home:      "/teacher",
    materials: "/teacher/materials",
    clusters:  "/teacher/clusters",
    bank:      "/teacher/bank",
    drafts:    "/teacher/drafts",
    draft:     "/teacher/drafts/new",
    live:      "/teacher/live",
    review:    "/teacher/review",
    analytics: "/teacher/analytics",
    lms:       "/teacher/lms",
    chat:      "/teacher/chat",
  },
  student: {
    home:      "/student",
    take:      "/take",
    history:   "/student/history",
    lms:       "/student/lms",
    chat:      "/student/chat",
    analytics: "/student/analytics",
  },
};

export const ROLE_HOME = {
  admin:   "/admin",
  teacher: "/teacher",
  student: "/student",
};

export const resolvePath = (role, viewId) =>
  VIEW_PATHS[role]?.[viewId] ?? ROLE_HOME[role] ?? "/";
