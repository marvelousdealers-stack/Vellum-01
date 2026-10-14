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
  Layers,
} from "lucide-react";

export const NAV_BY_ROLE = {
  admin: [
    { label: null, items: [{ id: "admin", icon: Home, label: "Overview" }] },
    {
      label: "Manage",
      items: [
        { id: "users", icon: Users, label: "Accounts" },
        { id: "classes", icon: GraduationCap, label: "Classes" },
      ],
    },
  ],
  teacher: [
    { label: null, items: [{ id: "home", icon: Home, label: "Overview" }] },
    {
      label: "Content",
      items: [
        { id: "subjects", icon: Layers, label: "Subjects" },
        { id: "materials", icon: Upload, label: "Materials" },
        { id: "bank", icon: Library, label: "Question bank" },
      ],
    },
    {
      label: "Assess",
      items: [
        { id: "drafts", icon: FileEdit, label: "Drafts" },
        { id: "live", icon: Radio, label: "Live test", live: true },
        { id: "review", icon: CheckCircle2, label: "Grade review", alert: true },
      ],
    },
    {
      label: "Teach",
      items: [
        { id: "lms", icon: BookOpen, label: "Courses" },
        { id: "chat", icon: MessageCircle, label: "Discussion" },
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
        { id: "take", icon: FileEdit, label: "Tests" },
      ],
    },
    {
      label: "Learn",
      items: [
        { id: "history", icon: FileEdit, label: "History" },
        { id: "lms", icon: BookOpen, label: "Courses" },
        { id: "chat", icon: MessageCircle, label: "Discussion" },
      ],
    },
    {
      label: "Insights",
      items: [{ id: "analytics", icon: BarChart3, label: "Progress" }],
    },
  ],
};
