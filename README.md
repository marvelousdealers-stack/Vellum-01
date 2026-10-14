<div align="center">

<img src="public/logo-mark.svg" alt="Vellum logo" width="72" height="72" />

# Vellum

**AI-assisted assessment platform for teachers, students and administrators.**
Build tests from course material, grade against a rubric, and show every student where they stand.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-8-CA4245?logo=reactrouter&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-ready-000000)
![Status](https://img.shields.io/badge/status-frontend%20prototype-orange)

</div>

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Project structure](#project-structure)
- [Routes and roles](#routes-and-roles)
- [Design system](#design-system)
- [Using pre-made components (shadcn/ui)](#using-pre-made-components-shadcnui)
- [Code conventions](#code-conventions)
- [Connecting a backend](#connecting-a-backend)
- [Deployment](#deployment)
- [Known limitations and roadmap](#known-limitations-and-roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

Vellum is the React front end of an AI-powered testing and grading platform. It currently runs entirely on
**mock data** (see [Connecting a backend](#connecting-a-backend)), so every screen can be explored without a server.

Three roles share one app shell:

| Role | What they do |
|---|---|
| **Admin** | Manage accounts and classes, add or remove students, see system health. |
| **Teacher** | Upload course material, review extracted topics, build and publish tests, run live sessions, review AI-graded answers, track class analytics, run courses and discussions. |
| **Student** | Take tests, review past attempts, follow courses, join discussions, track progress. |

## Features

**Teacher**
- Dashboard with class average, weak topics, students at risk, pending reviews, topic-accuracy chart, live activity feed
- Materials upload with extracted-text and topic review; topic clusters
- Question bank, test drafts (whole-class or per-student variants), new-test rules builder with question-mix control
- Live test control (stop test overlay, per-student state)
- Grade review queue with AI confidence levels and rubric verdicts
- Analytics: class trend, per-topic accuracy, student profiles
- Courses (lessons, video embeds, files) and class discussion threads

**Student**
- Take-test screen with question navigator, flags and autosave indicator
- Test history, courses, discussion, progress

**Admin**
- Accounts and class management with roster editing and confirmation dialogs

**Platform**
- Light theme by default, optional dark theme
- Command palette (`Ctrl/⌘ + K`, opened from the top-bar search), class switcher, responsive layout with mobile navigation
- Route-level code splitting, error pages, 404 page, skip-to-content link and focus management
- Toasts, confirm dialogs, skeletons and empty states

## Screenshots

> Add real screenshots here once the app is running locally, e.g. `docs/screenshots/teacher-dashboard-light.png`.

<!--
![Teacher dashboard](docs/screenshots/teacher-dashboard-light.png)
![Take test](docs/screenshots/take-test.png)
-->

## Tech stack

| Area | Choice |
|---|---|
| UI library | React 19 |
| Build tool | Vite 8 with `@vitejs/plugin-react` |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` (CSS-first tokens, no `tailwind.config.js`) |
| Routing | React Router 8 (`createBrowserRouter`, lazy routes) |
| Components | shadcn/ui patterns (`class-variance-authority` variants) on Tailwind tokens |
| Charts | Recharts |
| Icons | lucide-react |
| Fonts | Plus Jakarta Sans (UI) and Fraunces (titles), loaded from Google Fonts in `index.html` |
| Hosting | Netlify (`netlify.toml` with SPA fallback) |

### Packages

**Runtime dependencies**

| Package | Purpose |
|---|---|
| `react`, `react-dom` | UI rendering |
| `react-router` | Routing. Since v7 it includes everything `react-router-dom` used to provide. |
| `recharts` | Charts and the topic-accuracy dot plot |
| `lucide-react` | Icon set |
| `class-variance-authority` | Typed variants for `Button`, `Badge` and other `components/ui` primitives |
| `clsx`, `tailwind-merge` | Combined in `cn()` to merge conditional class names safely |
| `react-to-print` | Print / export of tests |

**Development dependencies**

| Package | Purpose |
|---|---|
| `vite`, `@vitejs/plugin-react` | Dev server and bundler |
| `tailwindcss`, `@tailwindcss/vite` | Styling engine (Vite plugin) |
| `tw-animate-css` | Animation utilities used by components added with the shadcn CLI |
| `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` | Linting |
| `@types/react`, `@types/react-dom` | Editor type hints in a JavaScript project |

## Getting started

### Prerequisites

- **Node.js 22 LTS** (the version pinned in `netlify.toml`) and npm 10+

### Install and run

```bash
git clone <your-repository-url>
cd vellum
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

On the sign-in screen pick a role (Admin, Teacher or Student). **Any credentials work** while the app runs on mock data.

### Troubleshooting

| Symptom | Fix |
|---|---|
| `Failed to resolve import "class-variance-authority"` (or any other package) | Run `npm install`. If you copied only `src/` into an older project, also copy `package.json` and `package-lock.json`. |
| Styles missing or unstyled | Make sure `vite.config.js` includes `tailwindcss()` from `@tailwindcss/vite`, and that `src/main.jsx` imports `./styles/index.css`. |
| `@/…` imports fail | Keep both the alias in `vite.config.js` and the `paths` entry in `jsconfig.json`. |
| Old favicon still showing | Hard-refresh; the icons are cache-busted with `?v=2` in `index.html`. |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the project |

## Configuration

Copy `.env.example` to `.env` to override defaults.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Base URL of the backend API |
| `VITE_USE_MOCK` | `true` | `true`: the fake backend in `src/mocks` answers requests in the browser. `false`: use the real backend |

## Project structure

```text
src/
├── main.jsx               Entry point
├── App.jsx                Providers + RouterProvider
├── routes/                Router config (lazy pages), auth guards, role → home path map
├── layout/                App chrome: Layout, Sidebar, TopBar, MobileTopBar, CommandPalette, nav config
├── pages/                 One default-exported file per route (thin: wiring + composition)
├── components/
│   ├── ui/                shadcn-style primitives: button, badge, input, label, separator
│   ├── common/            Shared components (barrel in index.js) + charts/, lms/, discussion/
│   └── <page-name>/       Components used by exactly one page (teacher-drafts/, admin-classes/, …)
├── context/               AppContext (role, drafts, courses, modal flags), ToastContext
├── hooks/                 useTheme, usePersistentState, useCountUp, …
├── data/                  Mock data by domain (users, classes, analytics, tests, materials, lms)
├── api/                   Backend client and endpoint modules
├── lib/                   cn(), createId(), formatters
└── styles/index.css       Design tokens and global styles
public/                    Favicon set, web manifest, logo mark
```

**Placement rules**

- Import with the `@/` alias (`@/components/common`); same-folder siblings use `./`.
- Used by **one** page → `components/<page-name>/`. Used by **two or more** → `components/common/`.
- Pages never import other pages. Components never import from `pages/`.
- Naming: `PascalCase.jsx` for components and pages, `useThing.js` for hooks, `camelCase.js` for utilities and data, kebab-case folders.
- New page = file in `pages/` + lazy route in `routes/index.jsx` (+ `routes/paths.js` and `layout/navConfig.js` if it appears in the sidebar).

## Routes and roles

| Role | Routes |
|---|---|
| Public | `/login` |
| Admin | `/admin`, `/admin/users`, `/admin/classes` |
| Teacher | `/teacher`, `/teacher/materials`, `/teacher/clusters`, `/teacher/bank`, `/teacher/drafts`, `/teacher/drafts/new`, `/teacher/drafts/:testId`, `/teacher/live`, `/teacher/review`, `/teacher/analytics`, `/teacher/lms`, `/teacher/chat` |
| Student | `/student`, `/student/tests`, `/student/history`, `/student/lms`, `/student/chat`, `/student/analytics` |
| Full-screen | `/take/:testId` (test-taking), `/teacher/preview/:testId` (student-view preview) — no app chrome |

Unknown URLs render a 404 page; render or lazy-load failures render a recoverable error page.

## Design system

Direction: **parchment written on in ink.** A navy rail, a warm paper canvas, pastel KPI cards and one gold accent.
All tokens live in `src/styles/index.css`; components never hardcode colors.

| Token | Light value | Use |
|---|---|---|
| `bg` / `surface` | paper `#F7F6F2` / white | Page / cards |
| `ink`, `ink-2`, `ink-3` | navy-violet (15.9 / 8.5 / 5.5 : 1 on cards) | Text. `ink-4` is decorative only |
| `primary` | indigo `#414FD2` | Actions, links, focus |
| `gold` | `#EBBD57` | Brand dot, active-nav marker, focus ring on the rail |
| `tint-*` | pastel fills | `MetricCard` and `<Bento variant="tinted">` |
| `sidebar-*` | navy rail (both themes) | `layout/Sidebar.jsx` |

- **Typography:** Plus Jakarta Sans for UI with tabular numerals, Fraunces for page titles and the wordmark. Minimum text size is 12px; no all-caps eyebrow labels.
- **Themes:** light is the default and ignores the OS setting; dark is opt-in from the sidebar. `data-theme` and the `.dark`/`.light` class are applied before first paint from `index.html`. Switching cross-fades with the View Transitions API (instant for reduced-motion users or unsupported browsers).
- **Surfaces:** `Bento` variants are `default`, `featured`, `quiet` and `tinted`. Every `Bento` accepts `span` for grid placement. Modals, toasts and the command palette use solid surfaces with elevation (no blur).
- **Accessibility:** WCAG 2.2 AA contrast for text tokens, visible focus rings, status never conveyed by color alone, reduced-motion respected.
- **Brand:** `BrandMark` and `Wordmark` in `components/common/BrandMark.jsx` share geometry with `public/favicon.svg`. Icon set: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `site.webmanifest`.

### Dark theme principles

Dark is designed separately, not inverted from light.

| Principle | How Vellum applies it |
|---|---|
| Never pure black; tonal near-black | Page `#0A0D1B` with a violet-navy tint, matching the brand hue |
| Elevation = lighter surface, not shadow | Scale `sunken → bg → surface → raised → floating`; popovers, menus, tooltips and modals use `floating` |
| Off-white text | `ink` is never `#fff`: 15.8:1 on cards, 5.2:1 or better for the dimmest text on the top layer |
| Desaturated accents | Primary and status colors have about 10–15% less chroma than a naive dark pass; all hold 5.3:1 or better as text on cards |
| Recessed inputs | Fields use `sunken` in dark, with a solid border that meets 3:1 (WCAG 1.4.11) in both themes |
| Chart contrast | Gridlines are white at 7%; series colors are 3:1 or better against the card; tooltips sit on `floating` |
| Status never color-only | Badges and chips always carry a text label (and icon where space allows) |
| Native UI follows the theme | `color-scheme` is set per theme (scrollbars, date pickers, form controls) |

Verify any new component in both themes. Use translucent overlays (`dark:bg-white/[0.04]`) for controls that can sit on any surface.

### Responsive and Android notes

- Breakpoints: `narrow` 520px, `tablet` 860px (plus Tailwind defaults). The sidebar is a sticky rail from `tablet` up and an off-canvas drawer below it.
- Touch: `pointer-coarse:` bumps buttons to 44–48px and form text to 16px (no zoom-on-focus); controls use `touch-action: manipulation`.
- Dialogs become bottom sheets below `narrow` (stacked full-width actions, `dvh` heights, safe-area padding).
- `index.html` sets `interactive-widget=resizes-content`, so the Android keyboard shrinks the layout instead of covering dialogs.
- Tables: phones drop secondary columns and show that detail under the name; wide tables otherwise scroll inside their card.
- Test on a real Android device or Chrome DevTools "Pixel 7" at 412px, in both themes, before merging UI changes.

## Using pre-made components (shadcn/ui)

`components.json` is configured for the shadcn CLI (JavaScript, Tailwind v4, `@/` aliases). The shadcn token names
(`background`, `card`, `primary-foreground`, `muted-foreground`, `border`, `ring`, …) are aliased to the Vellum
tokens in `src/styles/index.css`, so anything the CLI installs inherits both themes.

```bash
npx shadcn@latest add dialog select dropdown-menu tooltip tabs popover
npx shadcn@latest add @shadcn/dashboard-01      # a full dashboard block to borrow from
```

- Answer **No** to overwrite prompts for `button`, `badge` and `input` (already adapted to Vellum).
- If the CLI appends its own `:root { --background … }` block to `index.css`, delete it; the aliases already cover those names.
- Prefer `<Button variant="outline | ghost | destructive" size="sm | icon">` over hand-written button classes.

## Code conventions

- Semantic tokens only (`bg-surface`, `text-ink-2`, `border-rule`); no raw hex or `oklch()` in components.
- Complete class names only. Never build classes with template strings (`bg-${tone}`); use a lookup map.
- Repeated class lists become a component or a `cva` variant.
- Component-level responsiveness uses container queries; page layout uses breakpoints.
- Pages compose `.bento` grids with `span`; avoid fixed heights.
- Every route tree has an `errorElement`; focus moves to `<main>` after navigation.

## Data layer and the fake backend

The frontend only ever talks HTTP, and **no server logic lives in it**. Test
status, who may see what, deadlines, grading and result release are all the
backend's job; the UI shows what it is told.

- **Reads** use `hooks/useResource.js` → `{ data, isLoading, error, refetch }`,
  backed by `api/cache.js` (de-duplicated, refetched after writes, optional
  polling). Pages show `PageLoading` / `PageError`.
- **Writes** are small functions in `api/*.js`, one per endpoint. `call()` in
  `api/client.js` adds the bearer token, converts `_id`→`id` and ISO dates↔ms
  (`api/wire.js`), maps failures to `ApiError { status, code, message }` and
  refreshes the affected cache keys. A `401` signs the user out.
- **The contract** a backend must fulfil is `API-CONTRACT.md`.
- **The fake backend** (`src/mocks/`) answers `/api/*` in the browser so the app
  runs today: real requests, bearer tokens, status codes, `_id` + ISO payloads,
  latency, role scoping, answer keys withheld until release. Nothing imports it
  except `main.jsx`. When the real server exists: set `VITE_USE_MOCK=false`,
  set `VITE_API_BASE_URL`, and delete `src/mocks`. Reset its data with
  `__resetVellum()` in the console. See `src/mocks/README.md`.

### What each role can do today

- **Sign in** (`/login`): `POST /auth/login`; the demo adds role cards that the
  real server ignores (the account decides).
- **Teacher:** New test → autosaved draft review (or per-student variants) →
  Publish (open now or schedule, release timing, AI grading on/off, allow
  going back) → Drafts list (Start now / Stop) → **Live test**
  (`/teacher/live?test=<id>`, roster polled every 20 s, Extend, Stop) →
  **Grade review** (`/teacher/review`): approve, override with feedback, or
  bulk-approve high-confidence AI marks; manual queue for AI-off tests.
- **Student:** **Tests** (`/student/tests`) → intro → test (answers kept on the
  page and backed up to the server; tab switches reported; countdown from the
  server's deadline; auto-submit at 0:00; a teacher Stop reaches it via a 20 s
  poll) → submitted → **History** (`/student/history`,
  `/student/history/:attemptId`) once the server releases the result.

## Connecting a backend

1. Build the endpoints in `API-CONTRACT.md` (auth, tests, attempts, grading).
2. Set `VITE_API_BASE_URL` to the server and `VITE_USE_MOCK=false`.
3. Delete `src/mocks/` (and its dynamic import in `src/main.jsx`).

No component or `api/*.js` module changes: they already send real requests.
Server-side rules the UI relies on (status, release, deadlines, grading, role
scoping, withholding answer keys) are listed in the contract.

## Deployment

The repository ships with a Netlify config: build command `npm run build`, publish directory `dist`, Node 22, and a
catch-all redirect to `/index.html` so deep links survive a refresh. For any other static host, add the equivalent
SPA fallback rule.

## Known limitations and roadmap

- [ ] Backend not connected (mock data only); no real authentication
- [ ] Student test history is a placeholder table
- [ ] `StudentProgress` renders the same view as the student dashboard
- [ ] Some screens (draft review, variants review, test preview) are not reachable from a route yet
- [ ] Large page components (grade review, class discussion, question bank) should be split further
- [ ] Re-compose the admin, student and take-test layouts with the new `Bento` grid
- [ ] Align screens with the project plan document (phase 3)
- [ ] Add automated tests (unit and end-to-end)

## Contributing

1. Create a branch: `git checkout -b feat/short-description`
2. Follow the [project structure](#project-structure) and [code conventions](#code-conventions)
3. Run `npm run lint` and `npm run build` before opening a pull request
4. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `refactor:`)

## License

No license file has been added yet. Add a `LICENSE` file before publishing the repository publicly.
