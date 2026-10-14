# Vellum — Project Plan & Handoff

> **Give this file + the latest project zip to a new chat.** It is the single source of truth for what the project is, what is done, what is left, and the rules we work by. Read it fully before touching code. Update the checkboxes and the "Progress log" at the end of every working session, then hand the updated file to the next chat.

Legend: `[x]` done · `[~]` partly done · `[ ]` not started · **(guide)** = required/described by the PDF guide · **(extra)** = not in the guide.

---

## 0. Instructions for the next chat (read first)

1. **Scope: frontend only.** There is no backend. Do not build or simulate server logic inside the UI. The backend will be built later by someone following `API-CONTRACT.md`.
2. **The app only talks HTTP.** While there is no server, a *fake backend* in `src/mocks/` answers `/api/*` in the browser (on by default). It is the only place server rules live. When the real server exists: `VITE_USE_MOCK=false`, set `VITE_API_BASE_URL`, delete `src/mocks/`.
3. **Keep the existing project and theme.** Improve it; do not restart or re-theme. Use existing components/tokens (`src/components/common`, `src/components/ui`, Tailwind v4 tokens in `src/styles/index.css`).
4. **Token-efficient working style** (user preference): answer directly, no recap, no filler, no emojis; short bullets; return only changed files/lines in chat; deliver code as a **zip in `/mnt/user-data/outputs/`** and say what changed in a few lines. Don't ask clarifying questions for minor ambiguity — pick the sensible option and say so in one line. Do depth only when the task needs it.
5. **Read little, grep first.** Don't `cat` big files. Use `grep -n`, `sed -n 'a,bp'`, and the file map in §2.4. Change by small `python`/`sed` edits.
6. **Verify before delivering** (no network assumed in the sandbox — `npm install` may be impossible): bundle-check the whole app with esbuild, run the integration test (§12), and check for unused imports. State plainly that the app was **not** run in a browser unless it was.
7. **One phase per chat.** Pick the next phase from §7, finish it, update this file, stop.
8. **Respect the contract.** Any new endpoint/field is added to `API-CONTRACT.md` *and* to the fake server (`src/mocks/handlers.js`) in the same change, with realistic status codes and error codes.

**Recommended next step** (user's stated intent): the user is going to run the app with the mock data to review the look and feel. Next work is either (a) a **UI/UX improvement pass** on specific screens the user names (§8), or (b) **Phase 5** (§7). Ask the user which, in one line, if not told.

---

## 1. What the project is

**Vellum** — the frontend of an *AI-Powered Testing & Grading Platform* (a MERN-stack final-year project, described in `AI_Testing_Platform_MERN_Full_Guide_Final.pdf`). Three roles — **Admin, Teacher, Student**.

Core loop (guide §1): teacher adds a course outline (required) and optional past papers (text / PDF / image) → system extracts text, finds recurring topics, optionally tops up thin topics with web research → teacher sets rules (mode same-for-class or personalized, question mix, marks, duration, optional focus topics + free-text instruction) → AI generates the test → teacher reviews/edits and publishes (scheduled window or manual start/stop) → students take it with a timer and anti-cheat → objective questions graded instantly, written answers AI-graded against a rubric with teacher override/remarks (or AI off → manual queue) → per-student weakness report + class analytics + print/PDF export → weak spots feed the next test generation → full test history for students → separate lightweight LMS (courses/lessons/progress).

Guide's own advice (§9.2): finish the **Core** list first, then **Enhanced**. Human review of every AI output is a deliberate design decision.

---

## 2. Snapshot

### 2.1 Stack
React 19 + Vite 8 + Tailwind CSS v4 (`@tailwindcss/vite`), `react-router` 8 (data router, lazy pages), `recharts`, `lucide-react`, `class-variance-authority` / `clsx` / `tailwind-merge`, `react-to-print` (installed, **unused**). ESLint 10. Deploy file present: `netlify.toml` (guide says Vercel — see §11).

### 2.2 Run
```
npm install
npm run dev        # or dev.bat on Windows
```
No `.env` needed. `.env.example`: `VITE_USE_MOCK` (default on), `VITE_API_BASE_URL` (default `/api`; a full URL also works).

### 2.3 Demo accounts (fake backend)
Login screen shows role cards (mock only; a real server ignores them):
- **Teacher** `r.chen@westfield.edu` → Dr. R. Chen
- **Student** `maya.okafor@westfield.edu` → Maya Okafor (class 11A)
- **Admin** `s.whitfield@westfield.edu`
Any password works in mock mode. Other students: Sofia Lindqvist, Priya Nair, Jayden Park, Adrian Bell, Tomás Reyes (rolls 11A-xx).

Seed tests (teacher): *Wave Optics — Quiz 2* (live, manual), *Newton's Laws — Unit Test* (draft), *Thermodynamics — Mid-term* (personalized, scheduled tomorrow), *Bonding & Structure* (draft), *Kinematics — Quiz* (completed; 6 submissions with AI-graded written answers of varied quality → fills the grade queue). Maya also has a finished attempt on Kinematics.
Data persists in `localStorage` (`vellum.mockdb.v2`). Reset: run `__resetVellum()` in the browser console. Two tabs (teacher + student) work together; a teacher Stop reaches an open student test within ~20 s.

### 2.4 File map (what to open for what)
```
API-CONTRACT.md                 the backend contract (auth, reads, tests, attempts, grading); older sections below it are stale
README.md                       how it's wired, per-role flows, env, connecting a backend
src/main.jsx                    boots; dynamically imports the fake server when mock is on
src/api/client.js               request(), call() (token, wire conversion, ApiError, invalidates), USE_MOCK, onUnauthorized
src/api/wire.js                 _id→id, ISO↔ms conversion (fromWire/toWire)
src/api/cache.js                tiny query cache (dedupe, invalidate, refetch)
src/api/{auth,tests,attempts,grades,materials}.js   one function per endpoint (real-only, no mock branches)
src/hooks/useResource.js        the single read hook → { data, isLoading, error, refetch }, optional refetchInterval
src/hooks/{useTests,useAttempts,useGrading}.js      screen data hooks (+ useDraftAutosave.js)
src/lib/questions.js            THE question schema + validation (mcq|truefalse|short|long|numerical)
src/lib/{testSettings,attempts,time,id,cn,...}.js   UI-only helpers (no server rules)
src/context/AppContext.jsx      user/role session, active class, UI state; signIn/signOut; static demo lists still here
src/routes/{index.jsx,guards.jsx,paths.js}          router (paths.js = legacy view-id → path adapter)
src/layout/                     Layout, Sidebar, TopBar, navConfig.js (nav + some hardcoded badge counts), CommandPalette
src/pages/*                     route pages (thin; they compose components)
src/components/{common,ui}/     shared primitives (Bento, MetricCard, TableShell, StatusDot, EmptyState, PageLoading/PageError, ModalShell…)
src/components/teacher-*/ student-*/ take-test/ admin-*/   feature components
src/mocks/                      FAKE BACKEND (dev only): server.js (fetch interceptor), handlers.js (endpoints), engine.js (server rules), db.js (+seed), generator.js, grader.js, README.md
src/data/                       static demo data still used by screens with no API yet (see §5, §7)
```

---

## 3. Architecture rules (decisions already made — keep them)

- **Data seams.** Reads → `useResource` hooks returning `{ data, isLoading, error, refetch }` over `api/cache.js`. Writes → `api/*.js` functions using `call()` with `invalidates` keys. Pages render `PageLoading` / `PageError` / `EmptyState`. Components never import `src/mocks`.
- **No server logic in the UI.** Status (`draft|scheduled|live|completed`), deadlines, who can see what, grading, totals, result release, answer-key withholding are **server** responsibilities (implemented in `src/mocks/engine.js` + `handlers.js`). The UI displays them. UI-only validation (`validateQuestions`) is for UX; server must re-validate.
- **Wire conventions.** Server sends `_id` + ISO-8601 strings; `api/wire.js` converts to `id` + ms timestamps (time fields: `createdAt updatedAt publishedAt stoppedAt startedAt deadline submittedAt availableFrom availableUntil at reviewedAt closesAt`). The fake server emits the real format so adapters are exercised.
- **Errors.** `ApiError { status, code, message }`. Codes the UI reacts to: `NOT_RELEASED`(403) `NOT_OPEN`(409) `NO_VARIANT`(403) `INVALID_MARKS`(400) `NOT_EDITABLE`(409) `INVALID_QUESTIONS`(400). 401 → `onUnauthorized` → sign out.
- **Student independence.** A student's attempt carries its own `questions` snapshot (no answer key); the test page needs nothing from the teacher's test. Answers live in component state and are backed up (`PUT /attempts/:id/answers`); the **full answer map is sent on submit**. Deadline is server-fixed; extension arrives via the 20 s `live-status` poll (`deadline`).
- **Grades.** Per question: `{ marks, max, status: final|ai_draft|pending, source: auto|ai|teacher, confidence 0–1, rubric[], feedback, aiMarks }`. Students only ever see `final` marks. AI marks are drafts until the teacher approves/overrides. `settings.aiGrading=false` → written answers `pending` (manual queue).
- **Test settings** (set in the publish dialog, stored on the test): `release: immediately|after_close`, `aiGrading`, `allowBack` (default on). Add new options here (anti-cheat flags go here).
- **Question schema** is single-sourced in `src/lib/questions.js`; labels are derived from `type`, never stored.
- **Autosave** in the draft editor: local edits + debounced `PUT` (`useDraftAutosave`), flush before preview/publish.
- **Polling, not websockets** (guide §7.7): tests list 30 s, student attempts 30 s, live roster 20 s, grade queue 30 s, student live-status 20 s.

---

## 4. Progress log — DONE

### Original UI (before this plan)
- [x] Whole UI shell: theme (light/dark), layout, sidebar/top bar/command palette, 25+ screens across 3 roles, charts, empty/skeleton components, route-based lazy loading, error boundary.

### Step 1 — generate → review → publish
- [x] Unified question schema (`lib/questions.js`) + `validateQuestions`.
- [x] New-test rules screen now creates a real draft (title field, focus topics capped at 4 and empty by default, mix/marks/duration/mode/difficulty/instruction).
- [x] Draft review page `/teacher/drafts/:testId` (class mode) and per-student variants review (personalized mode); read-only for live/completed; validation banner.
- [x] Student-view preview `/teacher/preview/:testId` (variant via `?v=`).
- [x] Publish dialog: open now or schedule window (validated against duration), question validation across all variants.
- [x] Drafts list: Open / Publish / Regenerate / Duplicate / Delete / Start now / Stop; dashboard "Recent drafts" and sidebar Drafts badge from real data.
- [x] Fixed: `TakeTest` lost answers (single `selected` state); stop-overlay countdown that never fired.

### Step 2 — student side
- [x] Student **Tests** page (`/student/tests`): Open now / Upcoming / Submitted / Closed.
- [x] `/take/:testId` flow: intro (start is a deliberate click) → runner → submitted screen; old `/take` redirects.
- [x] Runner: one question at a time, per-question answers kept, server-fixed countdown, auto-submit at 0:00, confirm-before-submit dialog with unanswered count, tab-switch recording (count shown), 20 s stop poll + overlay, back-navigation setting.

### Step 3 — teacher live control + settings
- [x] **Live Control** (`/teacher/live?test=<id>`): picker for multiple live tests; roster with progress/status/flags; Extend (adds time to window + open attempts); confirmed Stop; ended state.
- [x] Publish settings: result release timing, AI grading on/off (stored; consumed by grading), allow going back (enforced in runner + intro text).

### Step 4 — grading + history
- [x] Server-side-style grading pipeline (in the fake backend): objective final at submit; written answers AI-draft with confidence/rubric/feedback, or `pending` when AI is off.
- [x] **Grade review** (`/teacher/review`): real queue, approve / override / save-as-draft with feedback, bulk-approve high-confidence, flags shown, manual queue tab; removed fake "Release results" / "Download PDF" buttons.
- [x] **Student history** list + per-attempt review page (`/student/history/:attemptId`) with answers, correct answers, marks, feedback; locked state when not released.

### Backend-readiness refactor (the "don't pretend" pass)
- [x] `api/client.js`: bearer token, `ApiError`, 401 handler, query params, FormData-safe; `call()` with wire conversion + cache invalidation.
- [x] `api/wire.js` adapters; `api/cache.js` query cache; `useResource` hook (+ polling).
- [x] All `api/*.js` modules real-only; all server rules moved to `src/mocks/` (fake server intercepting `fetch`, emitting `_id`+ISO, status codes, latency, role scoping, release gating, key withholding, server-side expiry sweep).
- [x] Auth wired: `POST /auth/login`, `GET /auth/me`, `signIn/signOut`, 401 → sign out; role cards on Login only in mock mode.
- [x] Draft editor autosave; live roster from server rows; student test page driven by server's `released`/`totals`.
- [x] `API-CONTRACT.md` updated (conventions, reads, tests, attempts, grading, auth); README data-layer section rewritten.
- [x] Fake-server base-URL bug fixed (works with `/api` or a full URL).
- [x] Integration test through the fake server (67 checks) + cache/wire coverage — see §12.

---

## 5. Status against the PDF guide

| Guide § | Feature | Status | Notes |
|---|---|---|---|
| 7.1 | Auth & roles | **[x]** | Login/token/`me`/401 done. Role guards + session-expired toast (5.1); admin creates/deactivates/removes accounts via the API (5.3). **Missing:** password reset / real email. |
| 7.2 | Class & subject management | **[x]** | Admin Classes/Users/Dashboard still **static demo data**. Subject entity (5.2); admin accounts, classes, rosters and KPIs on the API (5.3). **Missing:** assigning teachers to specific subjects, academic year. |
| 7.3 | Multi-format material upload & extraction | **[~]** | Multi-file + paste UI, type/size validation, real `POST /subjects/:id/materials` through the client. **Missing:** per-item tag (outline vs past paper) + year (items currently have no tag), render the upload *response* (still shows static `EXTRACTED_TOPICS`), extracted-text review bound to real items, saved-materials library (list/delete/re-extract), per-file status/extraction-route from server. |
| 7.4 | Recurring question detection | **[ ]** | Clusters page is static; no API; no "no past papers" empty state; no question-split review/fix UI; no similarity-threshold control (stretch). |
| 7.5 | Web research for thin outlines | **[ ]** | Only a decorative "Thin · web" badge. Need "enrich with current info" toggle, labeled web snippets (supplementary, separate from teacher's material), per-topic control. |
| 7.6 | Test generation, personalization, review | **[x]** UI / **[~]** | Done end-to-end (see §4). **Missing:** question bank wiring (save approved questions, manual add/edit, quick swap, "Add to draft" currently a stub), the "queued 2 of 32" banner on the rules screen is still fake, show per-student weak topics driving personalization (variants screen shows `weakTopic`). |
| 7.7 | Scheduling & manual control | **[x]** | Schedule window, start now, stop, extend, polling. |
| 7.8 | Test-taking interface (anti-cheat) | **[~]** | Done: timer, auto-submit, one-at-a-time, tab-switch log, allow-back setting. **Missing:** fullscreen request + exit logging, window blur, block right-click/copy/paste/cut, randomized question & option order per student (server or client), `beforeunload` warning, flag timeline on teacher side. |
| 7.9 | Auto-grading & human override | **[x]** | See §4. **Missing:** filter grade queue by test, re-run AI grading, rubric editing. |
| 7.10 | Analytics, test history, PDF export | **[~]** | History list + review done. **Missing:** weakness profile built from graded attempts (Student Profile tally per topic), class analytics from API, student dashboard/progress from API (`/student` and `/student/analytics` are the same component with static data), teacher per-test results page, drill-down routes, **PDF export via `react-to-print`** + `.no-print` on chrome (today `window.print()`; `.no-print` defined but unused so sidebar/top bar would print). |
| 7.11 | Lightweight LMS | **[~]** | Teacher/student LMS screens work on static data. **Missing:** API, course↔Subject link, lesson reorder, persisted progress, "take related test" button, teacher progress from real data. |
| — | Class Discussion **(extra)** | **[~]** | Static; not in the guide. Keep optional; don't prioritize over Core. |
| §11 | Pitfall: human review of AI output | **[x]** | Enforced: AI marks are drafts until teacher approves; teacher reviews drafted tests before publish. |

---

## 6. Original gap analysis (from the first review) → current status

Critical defects found at the start:
- [x] Generate → review → publish loop disconnected (orphan screens) → fixed.
- [x] `TakeTest` kept one answer only → fixed (answers per question, server deadline, auto-submit, submit confirm, submitted screen).
- [x] No student test picker/start screen → fixed.
- [~] Anti-cheat only tab-visibility count → now recorded with timestamps; **fullscreen/blur/copy-paste/right-click/shuffle still open** (Phase 7).
- [x] "No way back" vs navigator → made a per-test setting (`allowBack`, default on).
- [x] Question shape inconsistent (`"MCQ"`/`"mcq"`/`"Short answer"`) → single schema.
- [~] State-driven navigation → `drafts/:testId`, `preview/:testId`, `take/:testId`, `history/:attemptId` done; **still state-driven:** admin class detail (`/admin/classes/detail`), teacher student profile (`selectedStudent` in context).

Missing screens/components list:
- [ ] Subject entity + switcher + CRUD · [x] Publish dialog · [x] Student attempt review · [ ] Teacher per-test results page with flag timeline · [ ] Materials tag/year + library + real extraction results · [ ] Split reviewer + clusters empty state · [ ] Web-enrich toggle + snippets · [ ] Question bank: save approved, manual add/edit/swap, "Add to draft" · [ ] Student dashboard (available tests, latest result, weak topics, LMS progress) · [ ] `react-to-print` export + `.no-print` · [ ] LMS ↔ Subject link, reorder, "take related test" · [ ] Role guard · [x] Stateful data layer (replaced by fake server).

Cleanup list:
- [~] Rewrite stale `API-CONTRACT.md` (new sections done; older "Collections (Section 6)"/legacy parts remain — audit and prune).
- [~] Hardcoded nav badge counts (Drafts and student Tests are real; **users, classes, materials, discussion, courses still hardcoded** in `navConfig.js`); admin KPIs hardcoded; some static mock dates are in the future.
- [ ] Remove/verify unused files: `DotPlot`, `separator`, `useDebouncedValue`, `useDocumentTitle`, `SearchHint`, `bootstrapTheme`, `formatters`, empty `New Text Document.txt` (re-run the unused-file check; some may have become used).
- [ ] Merge duplicate `NumberStepper` (teacher-new-test + teacher-live-control).
- [ ] Remove `routes/paths.js` legacy adapter once all pages use `useNavigate`.
- [x] Focus topics capped at 4 (guide: 2–4) and no longer prefilled.
- [ ] Add `vercel.json` SPA rewrite (guide targets Vercel; repo has `netlify.toml`).
- [ ] Small bug: `AppContext` classList entries define a duplicate `short` key — verify and fix.

---

## 7. Remaining work — phased plan

Each phase: build the UI **and** the contract + fake-server endpoints it needs, then update docs/tests. Order is a recommendation; the user may reorder.

### Phase 5 — Structure & access (guide 7.1, 7.2)
- [x] **5.1 Role guards**: `RequireRole` (`src/routes/guards.jsx`) on `/admin`, `/teacher`, `/student` groups, `/take/:testId` (student) and `/teacher/preview/:testId` (teacher); wrong role → own home. 401 while signed in → sign out + "session expired" toast (`AppContext`); 401 with no session (bad login) stays the form's error. Not unit-tested (React-only; no test runner until Phase 10).
- [x] **5.2 Subjects**: `GET /classes`, `GET/POST/PUT/DELETE /subjects` (contract + fake handlers, mock db v3 with classes/subjects, `subjectId` on tests); `AppContext` classes, active class and subject from the API; `SubjectSwitcher` under the class switcher; `<Scope />` and `SubjectGate` replace every hardcoded "Physics"/`"physics-11a"`; teacher Subjects page (`/teacher/subjects`: add, rename, outline, delete). Drafts list filters by class + subject. Admin pages still on static `CLASSES` (5.3). Student pages show the class name only (they span all subjects).
- [x] **5.3 Admin on API**: `GET/POST/PUT/DELETE /users`, `POST/PUT/DELETE /classes`, `GET /classes/:id/roster` (contract + fake handlers; mock db v4 persists users); `useUsers`/`useClassRoster` hooks + `api/admin.js`; Accounts, Classes, Class detail and Admin overview read and write the API (no static data, survive refresh); deactivate/reactivate accounts; student add = new account or enroll an unassigned student (roll assigned by server); `/admin/classes/:classId` route (so 5.4's admin half is done); dead `openClass`/`rosterOverrides`/modal flags removed from context; admin nav badges live. Fake data note: 11A keeps its 6 demo students (their tests are seeded by name); 11B has 6, 10A has 5; Dr. Chen now teaches 11A + 11B only (as the admin data always said).
- [x] **5.4 Id routes**: `/admin/classes/:classId` (5.3) and `/teacher/analytics/:studentId` (`TeacherStudentProfile`; the id is the student's roll number until analytics uses real data; unknown id → error state). `openClass` is gone from context; `selectedStudent` was page-local and is now the URL.
- [x] **5.5 Nav badges**: every hardcoded number removed. Live: admin Accounts/Classes, teacher Drafts and Grade review (pending items, from `useGradeQueue`), student Tests (open) and Courses (course count). Materials, Question bank and Discussion show no badge (no unread/count model yet).
- *Done when:* a student can't open `/teacher/*`; no "Physics" literal in feature code; admin screens work after a refresh; deep links work.

### Phase 6 — Materials, clusters, question bank (guide 7.3–7.5, 7.6 bank)
- [ ] **6.1 Upload tagging**: per-item tag (outline / past paper) + year; fix FormData fields; per-file status from the response (extraction route direct/vision/ocr, warnings); progress/error per file.
- [ ] **6.2 Real extraction review**: bind `ExtractedTextReview` to server text per item; edit + confirm saves (`PUT /materials/:id`).
- [ ] **6.3 Materials library**: list/delete/re-extract; outline view/edit (`GET/DELETE /subjects/:id/materials`).
- [ ] **6.4 Clusters**: API-driven; empty state when no past papers; question-split review/fix UI; cluster detail; (stretch) similarity threshold.
- [ ] **6.5 Web research**: "enrich with current info" toggle in rules; thin-topic indicator from server; show labeled web snippets separately from teacher material.
- [ ] **6.6 Question bank**: API; save approved questions on publish; manual add/edit; quick swap in review; "Add to draft" carries selection into the new-test flow.
- [ ] **6.7** Replace the fake "queued 2 of 32" banner with server-reported generation progress for personalized mode.
- *Done when:* uploading a mix of files tags correctly and the library shows them after refresh; clusters page handles zero past papers.

### Phase 7 — Anti-cheat & test integrity (guide 7.8)
- [ ] **7.1 `useAntiCheat` hook** used by `TestRunner`: fullscreen request (on the intro "Begin" click) + exit logging; window blur; block right-click, copy/paste/cut on the test page; `beforeunload` warning; every event → `POST /tests/:id/flag` with a type.
- [ ] **7.2 Publish-dialog toggles** stored in `test.settings` (e.g. `requireFullscreen`, `blockCopyPaste`, `shuffleQuestions`, `shuffleOptions`); intro screen lists active rules.
- [ ] **7.3 Randomization** of question and option order per student (decide server vs client; server preferred so grading maps correctly — contract change).
- [ ] **7.4 Teacher per-test results page** (class results + per-student flag timeline), linked from Live ended state and Drafts completed rows.
- *Done when:* each flag type appears with timestamps on the teacher side; settings change what the student can do.

### Phase 8 — Analytics, profiles, export (guide 7.10)
- [ ] **8.1 Weakness profile** per student/subject/topic (correct vs attempted) from graded attempts: `GET /students/:id/profile`; feeds personalized generation (server) and the student/teacher dashboards.
- [ ] **8.2 Student dashboard/progress** from API (available tests, latest result, weak topics → "practice"), separate `/student` and `/student/analytics`.
- [ ] **8.3 Teacher analytics** from API: class weak topics, student drill-down by route, history of any student in class (`GET /students/:id/history`).
- [ ] **8.4 PDF/print export** with `react-to-print` on: weakness report, student result review, reviewed test; add `.no-print` to chrome; check print stylesheet (`media="print"`).
- [ ] **8.5** Show which weak topics shaped each personalized variant (variants screen) from server data.

### Phase 9 — LMS (guide 7.11)
- [ ] Courses/lessons/progress API; course↔Subject link; lesson reorder; student progress persisted; teacher progress view; "take related test" CTA from a lesson.
- [ ] Decide fate of Class Discussion (**extra**): keep static, wire to API, or hide.

### Phase 10 — Quality, polish, release
- [ ] Add a real test runner (**vitest**) and port the integration test (§12); add tests for `wire`, `cache`, `questions`, `useDraftAutosave`.
- [ ] Run `npm run lint` and fix; remove dead code (§6 cleanup); merge duplicate components.
- [ ] Accessibility pass (focus management in dialogs, aria-live on timers/saves, keyboard nav in runner).
- [ ] Responsive pass (mobile test taking, tables on small screens).
- [ ] `vercel.json`; confirm production build with `VITE_USE_MOCK=false` excludes `src/mocks`.
- [ ] Prune/rewrite remaining stale parts of `API-CONTRACT.md` and `README.md`; consider a short `docs/backend-handoff.md` for the backend dev.

---

## 8. UI/UX improvement backlog (the user will review the app with mock data)

The user is running the mock app to judge layout and flow. When they send screen-specific feedback, work through this checklist per screen:

- States: loading skeleton, empty, error + retry, success toast — all present and consistent?
- Long content: long test/student names, 10+ tests, 50+ students, long answers (truncation, wrapping).
- Mobile (≤ 640 px) and tablet; sticky bars; table → card fallbacks; test runner on phone.
- Dark/light parity; contrast; focus rings; keyboard-only use of dialogs and the runner.
- Copy: plain, consistent terms (Test vs Quiz, Published vs Live, "Results after close").
- Flows to review end-to-end: **(T)** new test → review → publish → live → grade; **(S)** tests → take → submitted → history review; **(A)** admin accounts/classes.
- Known rough edges to look at: rules screen "queued" banner (fake), grade-review breadcrumb hardcoded, student dashboard/progress identical, discussion/LMS/admin on static data, nav badges hardcoded, sidebar avatar initials from name, drafts list actions hidden on small screens.

---

## 9. Backend handoff (what the future backend must do)

Full detail in `API-CONTRACT.md`. Summary of the **rules the UI relies on** (all currently implemented in `src/mocks/engine.js` + `handlers.js` — treat them as the reference implementation):
- Auth: `POST /auth/login`, `GET /auth/me`, Bearer token, 401 on invalid; role decides access; 403 otherwise.
- `GET /tests`: teacher → own tests with questions; student → published tests of their class **without questions**; both with server-computed `status`, complete `settings`, `questionCount`, `totalMarks`.
- Test lifecycle: generate (LLM) → `PUT` edits only while draft/scheduled (409 `NOT_EDITABLE` otherwise) → publish (validate questions, store settings/schedule) → start-now / stop-now / extend → status derived from schedule + manual stop.
- Attempts: `GET /tests/:id/start` snapshots the student's questions (no answer key), fixes the deadline (`min(start+duration, availableUntil)`); autosave `PUT`; flags `POST`; submit `POST` with the **full answers map**, idempotent; server auto-submits past-deadline attempts and attempts whose test ended (grace ≈ 30 s).
- Grading at submit: objective final; written → AI draft (marks, confidence, rubric verdicts, feedback) or `pending` if `aiGrading=false`. Teacher `PATCH /grades/:attemptId/:questionId`, bulk `POST /grading/approve`.
- Release: `immediately` after submit, or `after_close`. Students receive `released` + `totals` (final marks only); `GET /attempts/:id/review` → 403 `NOT_RELEASED` until released and **only then** includes correct answers/model answers.
- Never send answer keys (`correctIndex`, `expectedAnswer`, `rubric`) to students before release. Never send other students' answers to a student.
- Still-to-be-specified endpoints (added as phases land): subjects, classes, users, materials library/extraction/clusters/web research, question bank, student profile/history, analytics, LMS.

---

## 10. Known issues, caveats, unverified

- **The app has never been opened in a browser by the assistant.** Verified only by: whole-app esbuild bundle (no unresolved imports/syntax errors), an unused-import scan, and Node integration tests of the API/cache/wire/fake-server logic. React rendering, `useResource` inside React, layout and CSS are unverified — expect small runtime/UI bugs; fix as the user reports them.
- ESLint and `vite build` were not run (no `node_modules` in the sandbox).
- The AI grader and test generator are **stand-ins** in `src/mocks` (keyword matching; template questions). They exist to exercise UI states, not to be accurate.
- Fake-server data is in `localStorage`; schema version `vellum.mockdb.v2` (reset with `__resetVellum()` after seed changes).
- Static demo data remains for: admin screens, class list, analytics, student dashboard/progress, LMS, discussion, question bank, clusters, extracted-materials sample (`src/data/*`).
- Some static dates in demo data are in the future.
- `README.md` / `API-CONTRACT.md` still contain older sections (e.g. original dark-theme notes, `Collections (Section 6)`) that predate the migration — audit when touched.
- `windows`-style `dev.bat` is present; `New Text Document.txt` is an empty stray file.

---

## 11. Open decisions (ask the user when relevant)

1. `allowBack` default (currently **on**; guide says "no way back").
2. Fill-in-the-blank question type: guide §7.9 lists it; the schema has `truefalse` and `numerical` but not "fill-in-the-blank". Add or keep as is?
3. Hosting: guide says Vercel (+ Render); repo has `netlify.toml`. Which one?
4. Randomization of questions/options: server-side (preferred) or client-side?
5. Class Discussion (not in the guide): keep, wire to API, or hide?
6. Whether the backend dev wants a separate `docs/backend-handoff.md` derived from the contract.

---

## 12. Testing approach

- **Integration test** (Node, no browser): drives the real `src/api/*` modules through the real `client.js` into the fake server — 67 checks covering auth + 401 + role scoping, `_id`/ISO adaptation, tests lifecycle (generate/save/validate/publish/schedule/start/stop/extend/duplicate/regenerate/delete), student attempts (start, snapshot without keys, autosave, flags, submit idempotency), release gating (`immediately` vs `after_close`, 403 `NOT_RELEASED`), server-side expiry sweep, roster, grading queue (override, drafts, bulk approve, manual queue, `INVALID_MARKS`), network error mapping, cache refetch after writes. File: `tests/integration.test.js` (header comment says how to bundle/run with esbuild: `esbuild tests/integration.test.js --bundle --platform=node --format=esm --alias:@=./src --loader:.js=jsx --define:import.meta.env='{"DEV":false,"VITE_USE_MOCK":"true"}' --outfile=/tmp/int.mjs && node /tmp/int.mjs`). Run it with both `/api` and a full URL base.
- **Whole-app bundle check**: `esbuild src/main.jsx --bundle --format=esm --loader:.js=jsx --alias:@=./src` with packages marked `--external` (catches syntax and unresolved imports).
- **Unused-import scan** (small node script over `src/`).
- **Next**: replace with vitest (+ React Testing Library) in Phase 10.
- Always re-run all of the above before delivering a zip.

---

## 13. Suggested chat workflow (saves tokens)

1. New chat: attach **this `plan.md` + the latest project zip**. Say which phase/step (or which UI screens) to work on.
2. The assistant unzips, reads §0, §3 and only the files relevant to the phase (grep first).
3. Work in small verified increments; deliver a zip + a 5–10 line summary.
4. At the end of each chat, update **§4 Progress log**, the checkboxes in §5–§7 and §10, and bump the zip name. Give the updated `plan.md` to the next chat.
5. Don't paste long logs/code into chat; reference file paths.

---

## 14. Progress log (append one entry per session)

| Date | Zip | What changed |
|---|---|---|
| 2026-10-08 | `vellum-01` | Original UI uploaded; full gap analysis against the guide (frontend-only scope). |
| 2026-10-09 | `vellum-02` | Step 1: question schema, mock store, generate → review → publish, publish dialog, drafts lifecycle. |
| 2026-10-09 | `vellum-03` | Step 2: student Tests page, intro/runner/submitted flow, per-question answers, auto-submit, polling stop. |
| 2026-10-09 | `vellum-04` | Step 3: Live Control on real attempts (Extend/Stop), publish settings (release, AI grading, allow back). |
| 2026-10-09 | `vellum-05` | Step 4: grading pipeline, grade review, student history + attempt review; async hook shape (`useResource`), `wire`, `cache`. |
| 2026-10-13 | `vellum-06` | Backend-readiness refactor: real-only API modules, fake backend in `src/mocks`, auth (`/auth/*`), autosave, server-driven status/release; full-URL base fix. |
| 2026-10-13 | `vellum-07` | Added this `plan.md` and `tests/integration.test.js`. |
| 2026-10-13 | `vellum-08` | Phase 5.1: `RequireRole` guards, session-expired toast. Next: 5.2 Subjects. |
| 2026-10-14 | `vellum-09` | Phase 5.2: subjects + classes on the API, SubjectSwitcher, Subjects page. Next: 5.3 Admin on API. |
| 2026-10-14 | `vellum-10` | Phase 5.3: admin on the API (users, classes, roster, KPIs). Light theme confirmed as default (bootstrapTheme.js fixed). Next: 5.4 analytics id route, 5.5 nav badges. |
| 2026-10-14 | `vellum-11` | Phase 5.4 + 5.5: analytics student route, live nav badges. **Phase 5 complete.** Next: Phase 6 (see §7). |
