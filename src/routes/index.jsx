import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import RouteError from "@/pages/RouteError";
import { Layout } from "@/layout/Layout";
import { PageFallback } from "@/layout/PageFallback";
import { RequireAuth, RequireRole, RedirectToRoleHome } from "./guards";
import { SubjectGate } from "@/components/common";

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
const AdminClassDetail = page(() => import("@/pages/AdminClassDetail"));

// Teacher
const TeacherDashboard = page(() => import("@/pages/TeacherDashboard"));
const TeacherSubjects = page(() => import("@/pages/TeacherSubjects"));
const TeacherMaterials = page(() => import("@/pages/TeacherMaterials"));
const TeacherClusters = page(() => import("@/pages/TeacherClusters"));
const TeacherQuestionBank = page(() => import("@/pages/TeacherQuestionBank"));
const TeacherDrafts = page(() => import("@/pages/TeacherDrafts"));
const TeacherNewTest = page(() => import("@/pages/TeacherNewTest"));
const TeacherDraftReview = page(() => import("@/pages/TeacherDraftReview"));
const TeacherTestPreview = page(() => import("@/pages/TeacherTestPreview"));
const TeacherLiveControl = page(() => import("@/pages/TeacherLiveControl"));
const TeacherGradeReview = page(() => import("@/pages/TeacherGradeReview"));
const TeacherAnalytics = page(() => import("@/pages/TeacherAnalytics"));
const TeacherStudentProfile = page(() => import("@/pages/TeacherStudentProfile"));
const TeacherCourses = page(() => import("@/pages/TeacherCourses"));
const TeacherDiscussion = page(() => import("@/pages/TeacherDiscussion"));

// Student
const StudentDashboard = page(() => import("@/pages/StudentDashboard"));
const StudentTests = page(() => import("@/pages/StudentTests"));
const StudentAttemptReview = page(() => import("@/pages/StudentAttemptReview"));
const StudentHistory = page(() => import("@/pages/StudentHistory"));
const StudentCourses = page(() => import("@/pages/StudentCourses"));
const StudentDiscussion = page(() => import("@/pages/StudentDiscussion"));
const StudentProgress = page(() => import("@/pages/StudentProgress"));
const TakeTest = page(() => import("@/pages/TakeTest"));

// `gated` pages act on the active subject, so they wait for it (or say there is none).
const route = (path, Page, title, { gated = false } = {}) => ({
  path,
  element: gated ? (
    <SubjectGate>
      <Page />
    </SubjectGate>
  ) : (
    <Page />
  ),
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
        element: <RequireRole role="admin" />,
        children: [
          { index: true, element: <AdminDashboard />, handle: { title: "Admin overview" } },
          route("users", AdminUsers, "Accounts"),
          {
            path: "classes",
            children: [
              { index: true, element: <AdminClasses />, handle: { title: "Classes" } },
              route(":classId", AdminClassDetail, "Class"),
            ],
          },
        ],
      },

      {
        path: "teacher",
        element: <RequireRole role="teacher" />,
        children: [
          { index: true, element: <TeacherDashboard />, handle: { title: "Overview" } },
          route("materials", TeacherMaterials, "Materials", { gated: true }),
          route("clusters", TeacherClusters, "Clusters"),
          route("bank", TeacherQuestionBank, "Question bank"),
          route("drafts", TeacherDrafts, "Drafts"),
          route("drafts/new", TeacherNewTest, "New test", { gated: true }),
          route("subjects", TeacherSubjects, "Subjects"),
          route("drafts/:testId", TeacherDraftReview, "Review test"),
          route("live", TeacherLiveControl, "Live test"),
          route("review", TeacherGradeReview, "Grade review"),
          route("analytics", TeacherAnalytics, "Analytics"),
          route("analytics/:studentId", TeacherStudentProfile, "Student"),
          route("lms", TeacherCourses, "Courses"),
          route("chat", TeacherDiscussion, "Discussion"),
        ],
      },

      {
        path: "student",
        element: <RequireRole role="student" />,
        children: [
          { index: true, element: <StudentDashboard />, handle: { title: "Overview" } },
          route("tests", StudentTests, "Tests"),
          route("history", StudentHistory, "Test history"),
          route("history/:attemptId", StudentAttemptReview, "Review attempt"),
          route("lms", StudentCourses, "Courses"),
          route("chat", StudentDiscussion, "Discussion"),
          route("analytics", StudentProgress, "Progress"),
        ],
      },
    ],
  },

  // Fullscreen route (no layout chrome)
  // Old bookmark: /take had no test id, so send it to the list.
  { path: "/take", element: <Navigate to="/student/tests" replace /> },
  {
    path: "/take/:testId",
    element: (
      <RequireRole role="student">
        <Suspense fallback={<PageFallback />}>
          <TakeTest />
        </Suspense>
      </RequireRole>
    ),
    errorElement: <RouteError />,
    handle: { title: "Take test" },
  },

  // Fullscreen student-view preview of a stored test (no layout chrome)
  {
    path: "/teacher/preview/:testId",
    element: (
      <RequireRole role="teacher">
        <Suspense fallback={<PageFallback />}>
          <TeacherTestPreview />
        </Suspense>
      </RequireRole>
    ),
    errorElement: <RouteError />,
    handle: { title: "Preview" },
  },

  // Unknown paths: a real 404 (signed-out users are sent to /login by RequireAuth)
  { path: "*", element: <RequireAuth><NotFound /></RequireAuth>, handle: { title: "Not found" } },
]);
