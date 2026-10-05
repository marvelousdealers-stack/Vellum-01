import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import RouteError from "@/pages/RouteError";
import { Layout } from "@/layout/Layout";
import { PageFallback } from "@/layout/PageFallback";
import { RequireAuth, RedirectToRoleHome } from "./guards";

// ═══════════════════════════════════════════════════════════════
// ROUTES
//
// Every page is code-split with React.lazy. The initial bundle only
// holds the layout + login; each page streams in on first visit.
// Pages live in src/pages and default-export a single component.
// `handle.title` feeds the TopBar heading and the document title.
// ═══════════════════════════════════════════════════════════════
const page = (loader) => lazy(loader);

// Admin
const AdminDashboard = page(() => import("@/pages/AdminDashboard"));
const AdminUsers = page(() => import("@/pages/AdminUsers"));
const AdminClasses = page(() => import("@/pages/AdminClasses"));

// Teacher
const TeacherDashboard = page(() => import("@/pages/TeacherDashboard"));
const TeacherMaterials = page(() => import("@/pages/TeacherMaterials"));
const TeacherClusters = page(() => import("@/pages/TeacherClusters"));
const TeacherQuestionBank = page(() => import("@/pages/TeacherQuestionBank"));
const TeacherDrafts = page(() => import("@/pages/TeacherDrafts"));
const TeacherNewTest = page(() => import("@/pages/TeacherNewTest"));
const TeacherLiveControl = page(() => import("@/pages/TeacherLiveControl"));
const TeacherGradeReview = page(() => import("@/pages/TeacherGradeReview"));
const TeacherAnalytics = page(() => import("@/pages/TeacherAnalytics"));
const TeacherCourses = page(() => import("@/pages/TeacherCourses"));
const TeacherDiscussion = page(() => import("@/pages/TeacherDiscussion"));

// Student
const StudentDashboard = page(() => import("@/pages/StudentDashboard"));
const StudentHistory = page(() => import("@/pages/StudentHistory"));
const StudentCourses = page(() => import("@/pages/StudentCourses"));
const StudentDiscussion = page(() => import("@/pages/StudentDiscussion"));
const StudentProgress = page(() => import("@/pages/StudentProgress"));
const TakeTest = page(() => import("@/pages/TakeTest"));

const route = (path, Page, title) => ({
  path,
  element: <Page />,
  handle: { title },
});

export const router = createBrowserRouter([
  { path: "/login", element: <Login />, errorElement: <RouteError />, handle: { title: "Sign in" } },

  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: <RedirectToRoleHome /> },

      {
        path: "admin",
        children: [
          { index: true, element: <AdminDashboard />, handle: { title: "Admin overview" } },
          route("users", AdminUsers, "Accounts"),
          {
            path: "classes",
            children: [
              { index: true, element: <AdminClasses />, handle: { title: "Classes" } },
              route("detail", AdminClasses, "Class detail"),
            ],
          },
        ],
      },

      {
        path: "teacher",
        children: [
          { index: true, element: <TeacherDashboard />, handle: { title: "Overview" } },
          route("materials", TeacherMaterials, "Materials"),
          route("clusters", TeacherClusters, "Clusters"),
          route("bank", TeacherQuestionBank, "Question bank"),
          route("drafts", TeacherDrafts, "Drafts"),
          route("drafts/new", TeacherNewTest, "New test"),
          route("live", TeacherLiveControl, "Live test"),
          route("review", TeacherGradeReview, "Grade review"),
          route("analytics", TeacherAnalytics, "Analytics"),
          route("lms", TeacherCourses, "Courses"),
          route("chat", TeacherDiscussion, "Discussion"),
        ],
      },

      {
        path: "student",
        children: [
          { index: true, element: <StudentDashboard />, handle: { title: "Overview" } },
          route("history", StudentHistory, "Test history"),
          route("lms", StudentCourses, "Courses"),
          route("chat", StudentDiscussion, "Discussion"),
          route("analytics", StudentProgress, "Progress"),
        ],
      },
    ],
  },

  // Fullscreen route (no layout chrome)
  {
    path: "/take",
    element: (
      <RequireAuth>
        <Suspense fallback={<PageFallback />}>
          <TakeTest />
        </Suspense>
      </RequireAuth>
    ),
    errorElement: <RouteError />,
    handle: { title: "Take test" },
  },

  // Unknown paths: a real 404 (signed-out users are sent to /login by RequireAuth)
  { path: "*", element: <RequireAuth><NotFound /></RequireAuth>, handle: { title: "Not found" } },
]);
