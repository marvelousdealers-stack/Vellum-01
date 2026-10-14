import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { ClassSwitcher } from "./ClassSwitcher";
import { SubjectSwitcher } from "./SubjectSwitcher";
import { NAV_BY_ROLE } from "./navConfig";
import { ThemeToggle } from "./ThemeToggle";
import { BrandMark } from "@/components/common";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { usePersistentState } from "@/hooks/usePersistentState";
import { useStudentTests } from "@/hooks/useAttempts";
import { useUsers } from "@/hooks/useAdmin";
import { useGradeQueue } from "@/hooks/useGrading";
import { useTests } from "@/hooks/useTests";
import { cn } from "@/lib/cn";
import { resolvePath } from "@/routes/paths";

export const Sidebar = ({ role, mobileOpen, onCloseMobile }) => {
  const [collapsed, setCollapsed] = usePersistentState(
    "vellum.sidebarCollapsed",
    false,
  );
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const {
    user, classList, activeClassId, setActiveClassId,
    classSubjects, activeSubject, setActiveSubjectId, courses, signOut,
  } = useApp();
  const nav = NAV_BY_ROLE[role] || [];
  // Badge counts that come from real (store-backed) data override the static
  // placeholder in navConfig; everything else keeps its configured count.
  const { data: tests } = useTests();
  const { data: studentTests } = useStudentTests();
  const { data: adminUsers } = useUsers({ enabled: role === "admin" });
  const { data: gradeQueue } = useGradeQueue({ enabled: role === "teacher" });
  const liveCounts =
    role === "admin"
      ? { users: adminUsers?.length, classes: classList.length }
      : role === "teacher"
      ? {
          drafts: tests.filter((t) => t.status === "draft").length || undefined,
          review: gradeQueue.filter((g) => g.status === "pending").length || undefined,
        }
      : role === "student"
        ? { take: studentTests.open.length || undefined, lms: courses.length || undefined }
        : {};
  const countFor = (item) => liveCounts[item.id] ?? item.count;
  const isActive = (viewId) => {
    const path = resolvePath(role, viewId);
    return viewId === "home" || viewId === "admin"
      ? location.pathname === path
      : location.pathname.startsWith(path);
  };
  const go = (viewId) => {
    navigate(resolvePath(role, viewId));
    onCloseMobile?.();
  };
  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
    toast.push("Signed out", "info");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-35 bg-[oklch(0.15_0.06_272_/_0.6)] tablet:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          // Desktop: pinned to the viewport (sticky + full height) so it never scrolls with the page.
          "sticky top-0 flex h-dvh flex-col overflow-hidden border-r border-sidebar-rule bg-sidebar-bg",
          // Mobile: off-canvas drawer. `max-tablet:` variants keep the two modes from fighting
          // (tailwind-merge drops earlier position utilities when later ones conflict).
          "max-tablet:fixed max-tablet:inset-y-0 max-tablet:left-0 max-tablet:z-40 max-tablet:w-[min(84vw,300px)]",
          "max-tablet:transition-transform max-tablet:duration-300 max-tablet:ease-[cubic-bezier(0.16,1,0.3,1)]",
          mobileOpen ? "max-tablet:translate-x-0" : "max-tablet:-translate-x-full",
          collapsed && "tablet:w-16",
        )}
      >

        {/* ── Brand ── */}
        <div
          className={cn(
            "relative flex shrink-0 items-center gap-2.5 px-5 pb-4 pt-6",
            collapsed && "tablet:justify-center tablet:px-0",
          )}
        >
          <button
            onClick={() => go("home")}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md text-left transition-opacity hover:opacity-90"
            title="Home"
          >
            <span className="grid size-7 shrink-0 place-items-center text-sidebar-accent">
              <BrandMark size={28} />
            </span>
            {!collapsed && (
              <span className="truncate font-serif text-[22px] font-semibold leading-none tracking-[-0.02em] text-sidebar-ink">
                Vellum
              </span>
            )}
          </button>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden size-7 shrink-0 place-items-center rounded-md border border-sidebar-rule text-sidebar-ink-3 transition-colors hover:bg-sidebar-hover hover:text-sidebar-ink tablet:grid"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={14} />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="hidden size-7 shrink-0 place-items-center rounded-md text-sidebar-ink-3 transition-colors hover:bg-sidebar-hover hover:text-sidebar-ink tablet:grid"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {role === "teacher" && !collapsed && (
          <ClassSwitcher
            classes={classList}
            activeId={activeClassId}
            onChange={(id) => {
              setActiveClassId(id);
              toast.push(
                `Switched to ${classList.find((c) => c.id === id)?.short || id}`,
                "info",
              );
            }}
          />
        )}
        {role === "teacher" && !collapsed && (
          <SubjectSwitcher
            subjects={classSubjects}
            activeId={activeSubject?.id}
            onChange={setActiveSubjectId}
            manageTo={resolvePath("teacher", "subjects")}
          />
        )}

        <nav
          className={cn(
            // Scrolls on short screens. The bottom padding + mask fade clipped items out
            // instead of cutting them off against the profile row.
            "relative min-h-0 flex-1 overflow-y-auto px-3 pb-6 pt-3",
            "[mask-image:linear-gradient(to_bottom,black_calc(100%-24px),transparent)]",
            collapsed && "tablet:px-2",
          )}
        >
          {nav.map((group, gi) => (
            <div key={gi} className="mb-4">
              {group.label && !collapsed && (
                <div className="px-2 pb-1.5 pt-1 text-[12px] font-semibold text-sidebar-ink-3">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "relative flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13.5px] font-medium transition-colors duration-200",
                      "text-sidebar-ink-2 hover:bg-sidebar-hover hover:text-sidebar-ink",
                      active &&
                        "bg-sidebar-active text-sidebar-ink",
                      collapsed && "tablet:justify-center",
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute -left-3 top-1/2 h-5 w-[3px] origin-center -translate-y-1/2 animate-sidebar-marker rounded-r bg-sidebar-accent"
                      />
                    )}
                    <Icon
                      size={16}
                      className={cn(
                        "shrink-0 transition-colors",
                        active ? "text-sidebar-accent" : "opacity-80",
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {!collapsed && item.live && (
                      <span className="ml-0.5 size-1.5 shrink-0 animate-beacon rounded-full bg-success" />
                    )}
                    {!collapsed && countFor(item) != null && (
                      <span
                        className={cn(
                          "ml-auto shrink-0 rounded-full px-2 py-0.5 text-[12px] font-semibold tabular-nums",
                          item.alert
                            ? "bg-sidebar-accent text-sidebar-bg"
                            : "text-sidebar-ink-3",
                        )}
                      >
                        {countFor(item)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>


        <div
          className={cn(
            "flex shrink-0 items-center gap-2 border-t border-sidebar-rule px-5 py-3.5",
            collapsed && "tablet:justify-center tablet:px-0",
          )}
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-accent text-[12px] font-semibold text-sidebar-bg ">
            {(user?.name ?? "")
              .split(" ")
              .filter((w) => /^[A-Za-zÀ-ÿ]/.test(w))
              .slice(-2)
              .map((w) => w[0])
              .join("")
              .toUpperCase() || "?"}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1 truncate text-[12px] leading-tight">
              <div className="truncate font-medium text-sidebar-ink">
                {user?.name}
              </div>
              <div className="truncate text-[12px] text-sidebar-ink-3">
                {role === "teacher"
                  ? "Teacher · Westfield"
                  : role === "admin"
                    ? "Registrar"
                    : "Student · 11A"}
              </div>
            </div>
          )}
          <ThemeToggle />
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="grid size-8 shrink-0 place-items-center rounded-lg border border-sidebar-rule text-sidebar-ink-3 transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-sidebar-accent"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
