# Class Portal

A React + Vite single-page app for teachers and students: class overview
dashboards, an LMS (lessons/courses), AI-assisted test drafting & grading,
a question bank, and per-class discussion threads.

> This repo was reorganized from a flat `src/` folder into the structure
> below. Behavior was kept identical — only file locations, names, and a
> few dead-code removals changed. See **"What changed"** below before you
> `npm install`.

## Stack

- **React 18** + **Vite** (bundler/dev server)
- **Recharts** for charts (trend lines, scatter plots, sparklines)
- **react-to-print** for printable views
- No CSS framework — styling is plain CSS authored as JS template
  literals (see `src/styles/`) and injected into a `<style>` tag at
  runtime.

## Getting started

```bash
npm install
npm run dev       # start dev server
npm run build      # production build to dist/
npm run lint       # eslint
```

## Project structure

```
public/
  favicon.svg          placeholder — see "What changed"
src/
  main.jsx             app entry point
  App.jsx               root component: view routing, layout, top-level state
  index.css             global stylesheet (currently empty)
  assets/                static images (hero.png, react.svg, vite.svg)
  styles/                 raw CSS strings injected at runtime by App.jsx
    base.js                 design tokens, resets, core layout styles
    responsive.js            responsive/overflow fixes
    polish.js                 targeted visual refinements
    theme-loveable.js          "Vellum Noir" dark theme overrides
  context/
    class-context.jsx    ClassContext (active class) + class stats data
  hooks/
    use-persistent-state.js  localStorage-backed state + small utility hooks
    use-animated-number.jsx   count-up number animation
  shared/
    shared.jsx            mock/demo data + small shared UI bits (charts,
                            icons, form inputs). Mixed concerns — see
                            "Known issues" if you want to split it further.
  components/
    ui-kit.jsx             generic UI: dialogs, skeletons, empty states,
                             command palette, keyboard hints, brand mark
    toast.jsx                toast notification provider/hook
    class-switcher.jsx       class-switching dropdown
    mobile-top-bar.jsx       mobile header bar
  features/
    overview.jsx            teacher home dashboard
    grading.jsx               student profiles, grading queue, question bank,
                                account/class creation modals, test preview
    class-management.jsx      class detail, settings, add-student, question mix
    draft-tests.jsx            AI test draft creation/review flow
    widgets.jsx                 live activity feed, scope estimate, grading
                                  detail panel, LMS module helpers
    lms.jsx                    student/teacher LMS (courses, lessons, video)
    chat.jsx                    class discussion threads
```

Every file above keeps its original component/hook names and exports —
only the file paths changed, so diffs against the old code stay readable
per-symbol.

## What changed

The uploaded archive contained only `src/`; the root config files
(`package.json`, `vite.config.js`, `index.html`, `eslint.config.js`,
`.gitignore`, `netlify.toml`) and `public/` weren't included, so they were
**reconstructed from scratch** based on the imports actually used in the
code (`react`, `react-dom`, `react-to-print`, `recharts`, `vite`). If you
have your original `package-lock.json` or exact dependency versions,
restore those instead of trusting the versions pinned here.

Also reconstructed: `public/favicon.svg` is a placeholder — your original
`public/` folder (with the real favicon and `icons.svg`) wasn't part of
this upload, so drop your real assets back in before shipping.

### Files renamed for clarity

| Old name | New location |
|---|---|
| `styles.js` / `polish.js` / `responsive.js` / `theme-loveable.js` | `src/styles/` |
| `persist.js` | `src/hooks/use-persistent-state.js` |
| `animated-number.jsx` | `src/hooks/use-animated-number.jsx` |
| `class-context.jsx` | `src/context/class-context.jsx` |
| `class-switcher.jsx`, `toast.jsx`, `mobile.jsx` | `src/components/` |
| `ui-kit.jsx` + `ui-kit2.jsx` | merged into `src/components/ui-kit.jsx` |
| `shared.jsx` | `src/shared/shared.jsx` |
| `features.jsx` → `features4.jsx` | renamed to `grading.jsx`, `class-management.jsx`, `draft-tests.jsx`, `widgets.jsx` in `src/features/` (by what each actually contains) |
| `overview.jsx`, `lms.jsx`, `chat.jsx` | `src/features/` |

### Dead code removed

- **`App.css`** — never imported anywhere (only `index.css` is imported
  in `main.jsx`). Its contents were leftover Vite starter-template CSS
  (`#next-steps`, `.framework`/`.vite` logo animation, etc.) with no
  matching elements in the actual app. Safe to delete; excluded from
  this repo.
- **`QUESTION_TYPES`** (was in `shared.jsx`) — exported but never
  imported anywhere. Removed.
- **`useIsMounted`** (was in `persist.js`) — exported but never used.
  Removed, along with the now-unused `useRef` import.
- Merged a duplicate `import { ... } from "./ui-kit"` / `"./ui-kit2"`
  pair in `App.jsx` into a single import now that both files are one.

Every remaining relative import and named import was checked
programmatically against the new file paths and each module's actual
exports, so the app should build and run exactly as before.

## Known issues / suggestions (not changed, to avoid breaking things)

- **`src/index.css` is empty.** Either intentional (all styling comes
  from `src/styles/`) or a leftover — worth confirming.
- **`src/shared/shared.jsx` mixes concerns**: demo/mock data (`TOPICS`,
  `STUDENTS`, `GRADE_QUEUE`, etc.) and UI components (`Spark`, `Trend`,
  `Icon`, `TopicInput`, ...) live in one 570-line file. Splitting into
  `data/mock-data.js` and `components/charts.jsx` would be a clean
  follow-up, but touches a lot of import lines, so it was left as-is
  here.
- **Runtime CSS injection**: `src/styles/*.js` are CSS strings
  concatenated and written into a `<style>` tag via `useEffect` in
  `App.jsx`, rather than imported as real `.css` files. It works, but
  you lose CSS syntax highlighting/linting in most editors. Converting
  to actual `.css` files (imported via Vite's `?raw` or as global
  stylesheets) would be more idiomatic if you want to invest the time.
- **Two favicons in the original tree** (`favicon.svg` and
  `default favicon.svg`, the latter with a space in the filename) —
  pick one when you restore your `public/` folder.
- **`App.jsx` is ~2,970 lines.** It's the app shell (view routing +
  top-level state) and works fine, but is a good candidate to split by
  view/route if it keeps growing.
- **`public/icons.svg`** (from your original tree) doesn't appear to be
  referenced anywhere — the `Icon` component in `shared.jsx` inlines its
  SVG paths directly rather than using a sprite sheet. Worth checking
  if it's still needed before restoring it.
