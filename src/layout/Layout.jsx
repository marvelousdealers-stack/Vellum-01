import { Suspense, useEffect, useRef } from "react";
import { useMatches, useLocation, useNavigate, Outlet, ScrollRestoration } from "react-router";
import { CommandPalette } from "./CommandPalette";
import { MobileTopBar } from "./MobileTopBar";
import { PageFallback } from "./PageFallback";
import { buildPaletteItems } from "./paletteItems";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ConfirmDialog } from "@/components/common";
import { useApp } from "@/context/AppContext";
import { useRecentViews } from "@/hooks/useRecentViews";

// ═══════════════════════════════════════════════════════════════
// APP SHELL
//
// Three-zone layout, rendered for every authenticated route:
//
//   ┌──────────┬────────────────────────────────────────┐
//   │          │  MobileTopBar   (mobile only, sticky)  │
//   │          ├────────────────────────────────────────┤
//   │ Sidebar  │  TopBar         (desktop, sticky)      │
//   │          ├────────────────────────────────────────┤
//   │          │                                        │
//   │          │  <Outlet />   current route renders    │
//   │          │                                        │
//   └──────────┴────────────────────────────────────────┘
//
// Global overlays (CommandPalette, ConfirmDialog) mount here so they
// sit above every page and can read app-wide state.
//
// The recent-views tracker records the last 5 top-level paths the user
// visited, so the ⌘K palette can offer a "Recent" section.
// ═══════════════════════════════════════════════════════════════
export const Layout = () => {
  const {
    role,
    mobileNavOpen,
    setMobileNavOpen,
    cmdOpen,
    setCmdOpen,
    confirmState,
    setConfirmState,
  } = useApp();

  const matches = useMatches();
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [recentViews, pushRecentView] = useRecentViews("vellum.recentViews", 5);

  // ── Document title from the deepest route's handle.title ──
  useEffect(() => {
    const title = [...matches].reverse().find((m) => m.handle?.title)?.handle?.title;
    document.title = title ? `${title} · Vellum` : "Vellum";
  }, [matches]);

  // ── A11y: after client-side navigation, move focus to <main> so screen-reader
  //    and keyboard users start at the new page (not the old nav link). Skipped
  //    on first load. ──
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  // ── Track recent views (top two path segments) ──
  useEffect(() => {
    if (!location.pathname || !role) return;
    const key = location.pathname.split("/").filter(Boolean).slice(0, 2).join("/");
    if (key) pushRecentView(key);
  }, [location.pathname, role, pushRecentView]);

  return (
    <div className="grid min-h-dvh grid-cols-1 tablet:grid-cols-[240px_1fr]">
      <a
        href="#main"
        className="sr-only z-100 rounded-[var(--radius-control)] bg-primary px-4 py-2 text-[13px] font-semibold text-on-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Sidebar
        role={role}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        onSearch={() => setCmdOpen(true)}
      />

      <main id="main" ref={mainRef} tabIndex={-1} className="min-h-dvh min-w-0 overflow-x-clip outline-none">
        <MobileTopBar
          onMenuToggle={() => setMobileNavOpen(true)}
          onSearch={() => setCmdOpen(true)}
        />

        <TopBar onSearch={() => setCmdOpen(true)} />

        <div key={location.pathname} className="animate-page-in">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <ScrollRestoration />

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        items={buildPaletteItems({ role, recentViews, navigate })}
        onSelect={(item) => item.action?.()}
      />

      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel || "Delete"}
        onConfirm={() => confirmState?.onConfirm?.()}
        onClose={() => setConfirmState(null)}
      />
    </div>
  );
};
