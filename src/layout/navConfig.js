import {
  Home,
  Users,
  GraduationCap,
  Upload,
  Library,
  FileEdit,
  Radio,
  CheckCircle2,
  BookOpen,
  MessageCircle,
  BarChart3,
} from "lucide-react";
import { GRADE_QUEUE, QUESTION_BANK } from "@/data/tests";

export const NAV_BY_ROLE = {
  admin: [
    { label: null, items: [{ id: "admin", icon: Home, label: "Overview" }] },
    {
      label: "Manage",
      items: [
        { id: "users", icon: Users, label: "Accounts", count: 93 },
        { id: "classes", icon: GraduationCap, label: "Classes", count: 3 },
      ],
    },
  ],
  teacher: [
    { label: null, items: [{ id: "home", icon: Home, label: "Overview" }] },
    {
      label: "Content",
      items: [
        { id: "materials", icon: Upload, label: "Materials", count: 12 },
        {
          id: "bank",
          icon: Library,
          label: "Question bank",
          count: QUESTION_BANK.length,
        },
      ],
    },
    {
      label: "Assess",
      items: [
        { id: "drafts", icon: FileEdit, label: "Drafts", count: 3 },
        { id: "live", icon: Radio, label: "Live test", live: true },
        {
          id: "review",
          icon: CheckCircle2,
          label: "Grade review",
          count: GRADE_QUEUE.filter(
            (g) => g.status === "pending" || g.status === "flagged",
          ).length,
          alert: true,
        },
      ],
    },
    {
      label: "Teach",
      items: [
        { id: "lms", icon: BookOpen, label: "Courses" },
        { id: "chat", icon: MessageCircle, label: "Discussion", count: 5 },
      ],
    },
    {
      label: "Insights",
      items: [{ id: "analytics", icon: BarChart3, label: "Analytics" }],
    },
  ],
  student: [
    {
      label: null,
      items: [
        { id: "home", icon: Home, label: "Overview" },
        { id: "take", icon: FileEdit, label: "Take test", count: 1 },
      ],
    },
    {
      label: "Learn",
      items: [
        { id: "history", icon: FileEdit, label: "History", count: 6 },
        { id: "lms", icon: BookOpen, label: "Courses", count: 3 },
        { id: "chat", icon: MessageCircle, label: "Discussion", count: 5 },
      ],
    },
    {
      label: "Insights",
      items: [{ id: "analytics", icon: BarChart3, label: "Progress" }],
    },
  ],
};
