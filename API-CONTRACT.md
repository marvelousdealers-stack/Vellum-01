# API Contract — Frontend ↔ Backend

Stage 1 output: what the frontend currently expects, mapped to the
backend design in *AI-Powered Testing & Grading Platform — A Complete
Build Guide (MERN Stack)*. Use this as the target when building routes/
models — it's the concrete version of the guide's Section 6 (Database
Design) and Section 8 (API Endpoints), reconciled against what the UI
actually does today.

## How the frontend is wired for this right now

Every backend call goes through `src/api/*.js`, which sit on top of
`src/api/client.js`. While `MOCK_MODE` (in `client.js`) is `true`, these
modules return local mock data instead of calling `fetch` — components
never know the difference. To connect a real backend:

1. Set `MOCK_MODE = false` in `src/api/client.js` (or wire it to
   `import.meta.env.VITE_API_BASE_URL` being set).
2. Fill in the real endpoint calls already stubbed in each `api/*.js`
   file (the `request(...)` calls are already written to match the
   table below — most just need the backend to exist).
3. Nothing in the components needs to change.

Only the flows touched in this pass have an `api/` module so far
(`materials.js`, `tests.js`, plus the shared `client.js`). The rest of
Section 8's endpoints don't have a frontend module yet — add one per
feature as it gets wired, following the same pattern.

## Collections (Section 6) vs. current frontend shape

| Guide's collection | Current frontend mock (`src/data/*.js`) | Gap to close |
|---|---|---|
| **User** | `USERS` — `{ name, email, role, cls, status }` | No `id`/`_id`. `cls` is a display string ("11A, 11B"), not a reference to a Class document. No password/auth fields (expected — auth doesn't exist client-side yet). |
| **Class** | `CLASSES` — now `{ id, code, name, teachers, students, subjects }` (fixed this pass — see below) | `id` and `code` were added this pass. `teachers` is an array of display-name strings, not User references — fine for mock data, but the real shape should be an array of teacher `_id`s once User has real ids. |
| **Subject** | Referenced implicitly (e.g. "Physics" is hardcoded in a few places, like the Materials screen's breadcrumb) | No real Subject record/selection exists yet. The Materials screen currently hardcodes `subjectId: "physics-11a"` when calling `uploadMaterials` — replace with a real subject picker once Subject CRUD exists. |
| **Past Paper** | Folded into `UPLOAD_FILES`/`EXTRACTED_TOPICS` mock data (now replaced by real file state in the Materials screen) | No distinction yet between "outline" and "past paper" tags at the API-call level — the new Materials UI collects a `tag` per item (`"outline"` vs `"pastpaper"` — wire this into the upload payload once the backend exists), and `year` isn't collected in the UI yet. |
| **Question** | `QUESTION_BANK`, `GENERATED_QUESTIONS`, `CLUSTERS` — no `id` field on individual questions in most of these; `GENERATED_QUESTIONS` items get a client `id` only when cloned (via `createId()`) | Needs real `_id`s from the backend on fetch. Embedding vectors and appearance counts aren't modeled client-side at all (expected — that's backend-only data, surfaced to the UI only as the already-computed `CLUSTERS` weight). |
| **Test** | Draft objects in `App.jsx` (`drafts` state), built by the `Draft` wrapper | Each saved draft now carries `{ id, title, cls, mode, config, questions, marks, status, ... }` plus `questionSet` (class mode) or `variants` (personal mode). `config` is the full generation rule set (`mix, targetMarks, duration, mode, difficulty, focusTopics, instruction`) — this is what `POST /api/tests/generate` receives and what "Regenerate" resends. `questions`/`marks` are always derived from `config.mix`, never from array lengths, so they're correct in both modes. Still missing: `subjectId`, and `id` is client-generated until the create call returns a real one. |
| **Student Test Variant** | `variants: [{ studentName, weakTopic, questions }]` on a personal-mode draft, reviewed in `VariantsReviewScreen` | Keyed by `studentName` because `STUDENTS` has no ids yet (deferred). Real shape per Section 6: `{ testId, studentId, questions }` — swap `studentName` for `studentId` when students get real ids. `weakTopic` is display-only (the topic the generator leaned on). |
| **Test Attempt** | The `Take` component's local state (`selected`, `textAnswer`, `answered`, `flags`) | No submission call exists yet — `Take`'s "Submit test" button just calls `onExit()`. Anti-cheat flags (tab-switch count) are tracked in local state but never sent anywhere. Needs a `POST /api/tests/:id/submit` call with `{ answers: [...], flags: [...] }` once that endpoint exists. |
| **Student Profile** | `STUDENT_PROFILES` (topic-accuracy breakdown, used by the weakness dashboard) | No `id` linking a profile to a specific student — currently matched by student name string, same class of issue as the old `CLASSES` bug fixed this pass. Worth fixing the same way once `STUDENTS` gets real ids (see "Deferred" below). |
| **Course / Lesson (LMS)** | `LMS_COURSES`, `LMS_LESSONS`, `MY_LESSONS` | Lessons already carry an `id` (via `createId()` now, was `Date.now()`). `LessonEditor`'s file-attachment field takes a pasted URL, not a real upload — confirm whether the intended flow is "upload elsewhere (e.g. Cloudinary), paste the URL here" before building a real file input for it. |
| **Lesson Progress** | Tracked via `usePersistentState` (localStorage) per lesson | Will need `POST /api/lessons/:id/complete` once it exists; straightforward swap, no UI change needed. |

## Endpoints (Section 8) already reflected in frontend code

| Endpoint | Frontend seam |
|---|---|
| `POST /api/subjects/:id/materials` | `src/api/materials.js#uploadMaterials` — called from the rebuilt Materials screen in `App.jsx`. Currently hardcodes `subjectId`. |
| `POST /api/tests/generate` | `src/api/tests.js#generateTest` — **now called** from `Draft` (via `DraftRulesScreen`'s `onCreate`). Request body = the `config` above. Response: draft Test fields plus `questionSet: Question[]` (class mode) **or** `variants: [{ studentId, weakTopic, questions }]` (personal mode). "Regenerate" reuses it via `regenerateTest(draft.config)`. |
| `GET /api/tests/:id/live-status` | `src/api/tests.js#getLiveStatus` — wired into `Take`'s polling loop this pass, on a hardcoded `"demo-test"` id. |
| `POST /api/tests/:id/stop-now` | `src/api/tests.js#stopTestNow` — **now called** by the Live test screen's "Stop test for everyone" (hardcoded `"demo-test"` id until a real test id flows in). |
| `POST /api/tests/:id/extend` | `src/api/tests.js#extendTest` — **not in the guide's Section 8; the backend needs to add it.** Body `{ minutes }` (teacher-chosen, 1–60), returns the new close time. Called by the Live test screen's Extend control. |
| *(proposed)* `PATCH /api/results/:attemptId/questions/:questionId` | **Not built yet, not in the guide either.** This is where a teacher's manual override (`score`, `remark`) from `GradingDetailPanel` should go — see "Grade override wasn't actually saving" below. The guide's `POST /api/results/:attemptId/grade` is the *system's* automatic first-pass grading trigger, not a teacher's later edit to one question. |

Every other endpoint in the guide's Section 8 table doesn't have a
frontend module yet. Add one per feature, following the pattern in
`materials.js`/`tests.js`, as each screen gets wired to a real call.

## Fixed this pass (Stage 1 follow-through)

- **`CLASSES` now has a real `id` field.** The old `classShort()` function
  guessed a class's short code by checking whether its *name* contained
  certain substrings (e.g. `"Grade 11 — Section A"` → contains `"11"`
  and `"A"` → `"11A"`) — fragile, and hardcoded to only recognize three
  specific classes. It's been removed. Class identity now flows through
  `CLASSES[i].id` everywhere (the switcher, active-class state,
  `CLASS_STATS` lookup); `CLASSES[i].code` is kept purely as an authored
  display label (the short badge in the class switcher), not derived by
  guessing.
- **Fixed a real bug this surfaced**: saving a draft test while viewing
  a non-default class was tagging it with the *wrong* class's short
  code, because it was reading the raw (now-real) class id where a
  display code was expected. It would have silently vanished from that
  class's draft list. Fixed to read the display code correctly.
- **Materials/upload screen rebuilt** with a real `<input type="file">`
  (keyboard-accessible, drag-and-drop as a progressive enhancement per
  current accessibility guidance), file type/size validation, and a
  "paste text" fallback — replacing a dropzone that didn't accept real
  files at all.
- **`Take` (test-taking) screen**: removed a hardcoded 20-second
  auto-stop `setTimeout` that would end every test regardless of
  content; removed the hardcoded `total = 10` and odd `23:47` starting
  timer (both now derive from the actual question data / a named
  constant); replaced a fake 5-second `live`/`polling` cosmetic toggle
  with a real 20-second polling loop matching §7.7, calling the new
  `getLiveStatus` stub.
- **Client-generated ids**: every `Date.now()` used as an id (lesson
  save, draft clone/duplicate, chat thread/reply, activity feed item)
  now goes through `src/lib/id.js#createId()` (`crypto.randomUUID()`).
  `Date.now()` calls that are genuinely timestamps (`lastActivity`, "how
  long ago" displays) were left alone.

### Second pass (teacher-side testing round)

- **Live test — "Extend by 10 minutes"** was a button with no handler, and
  the "Time remaining" KPI was a hardcoded `23`. Now: teacher picks the
  amount (stepper, 1–60), remaining time is real state that counts down,
  and Extend goes through `extendTest`. "Stop" now goes through
  `stopTestNow`.
- **Topic-accuracy tooltip** vanished before "View students" could be
  clicked (Recharts hides its `<Tooltip>` the moment the pointer leaves
  the data point). Replaced with self-managed hover state and a ~200ms
  grace period shared by the dot and the tooltip.
- **Grade review text overflow**: the table used `table-layout: auto`,
  letting long answer text in an expanded row widen the whole table past
  the viewport. Fixed with `table-layout: fixed` on a new
  `.gr-table-grading` modifier (applied to the grade-review table only —
  `.gr-table` is shared by four other tables, which are untouched), plus
  `overflow-wrap: anywhere` on answer/question text. *(An earlier attempt
  applied this to the shared `.gr-table` by mistake; corrected.)*
- **Personalized tests now produce one variant per student** and are
  reviewed in `VariantsReviewScreen`: searchable list, Reviewed / Not
  reviewed filter, click a row to edit that student's set in the same
  editor used for class mode, "Publish all N" at the top. Previously
  personal mode silently generated one shared set.
- **Question generation moved out of the UI** into `api/tests.js`
  (`buildQuestions`, `buildVariants`), so components only ask the API
  layer for questions. Also fixed topic tagging restarting from the first
  topic on every question-type row.
- **`Draft` save/publish**: the "Save draft" path hardcoded `cls: "11A"`
  (wrong class when viewing another) and every draft was titled "Newton's
  Laws — Unit Test". Both fixed; the full `config` is now stored on the
  draft.
- **Regenerate** called the generator three times with a global default
  mix, ignoring the draft's own rules. Now one call with the draft's
  stored `config`.
- **PublishModal claimed anti-cheat measures that don't exist**
  ("One question at a time", "Shuffled questions & options"). Now labeled
  "coming soon" until built; copy is also mode-aware for personalized
  publishes.
- **Focus topics**: custom topics already worked (type + Enter); the "6"
  is a total-selection cap (the guide suggests 2–4). Only the placeholder
  text changed. **Focus topics + free-text guidance stay available in
  personalized mode by design** — §7.6: the teacher's guidance always
  takes priority over automatic signals; personalization only adds each
  student's weak topics on top.
- Removed dead imports (`QuestionMixBuilder`, `DEFAULT_MIX`) from `App.jsx`.

### Third pass (grouping fix + upload screen bug)

- **Materials dropzone rendered as a collapsed sliver** (screenshot: a
  thin dashed strip with the icon/heading floating outside it). Root
  cause: the dropzone is a `<label>` (for the accessible hidden file
  input), and `<label>` is inline by default — `.dropzone`'s CSS was
  written for the original `<div>` and never set `display`. One-line fix:
  `.dropzone { display: block; ... }`.
- **Grade review — "by question" vs "by student" (issue #1, now built).**
  A "Group by: Question / Student" toggle sits above the table.
  *Question* is unchanged. *Student* groups the same rows by
  student+test; clicking a row opens **every** question that student
  answered on that test, stacked in one panel (not just one row) — score/
  marks/confidence/flags shown are combined across the group, "Status"
  shows `x / y reviewed` until every question in that submission is
  saved. Grouping is computed client-side from the existing flat rows
  (`student + "::" + test` as the key), so it needs no backend change —
  though see "Student ids" below for the real key it should use.
  `GRADE_QUEUE` also got 4 more rows (a second question per student on
  "Newton's Laws — Unit Test") since every student previously had exactly
  one question per test, which made student-grouping indistinguishable
  from question-grouping in the demo data.
- **Grade override wasn't actually saving — found while wiring the
  above.** `GradingDetailPanel`'s "Accept & continue" showed a success
  toast, but `onSave` took no arguments and nothing upstream ever called
  `setOverrides`/`setRemarks` — the score typed into "Your mark" was
  discarded the moment the row closed, and the "Reviewed" count/badges
  never changed no matter what a teacher did. This wasn't a side effect
  of grouping — the flat question-by-question table had the exact same
  bug, just less noticeable since nothing else depended on the totals
  being real. Fixed: `onSave(score, remark)` now actually persists into
  `overrides`/`remarks`, plus a new `reviewedIds` Set drives every status
  badge, filter chip, and the "% reviewed" progress bar in the page.
  Real endpoint for this save is the proposed `PATCH` route above.


- **`STUDENTS`/`USERS` still have no `id` field**, matched by name
  string in several mock datasets (`STUDENT_PROFILES`, `GRADE_QUEUE`,
  etc.). Same class of bug as the `CLASSES` one just fixed, but touches
  far more files — worth doing as its own pass once those datasets
  start coming from a real API (which will hand you real ids for free).
- **No "pick a test to take" flow.** `setView("take")` jumps straight to
  a single hardcoded demo test — there's no list of available tests for
  a student to choose from, so `Take` has no `testId` to actually poll
  or submit against yet. This is a missing feature, not a bug; needed
  before `getLiveStatus`/`stopTestNow`/a real submit call can be
  properly exercised.
- **Anti-cheat gaps vs. §7.8**: no fullscreen enforcement, no
  right-click/copy-paste blocking, no question/option randomization.
  Only tab-switch detection exists today.
- **`QuestionNavigator` allows jumping to any question**, which
  contradicts §7.8's "one question at a time, no way back" — a UX
  decision to make explicitly, not something changed silently here.
- **No web-research/grounding affordance** anywhere in the UI (§7.5) —
  open question whether that needs a teacher-facing toggle or can stay
  fully backend-automatic.
- **Personalized variants are keyed by `studentName`**, and "Reviewed" is
  local screen state that isn't persisted server-side (expected until a
  real save endpoint exists — see the proposed `PATCH` route above).
- **Seed drafts** in `App.jsx` have no `config`/`questionSet`, so opening
  one shows an empty editor. Mock-data gap only; real drafts come from
  the API.

### Fourth pass (light/dark theme — no backend impact)

- **Purely visual — zero API/data-shape changes.** Adds a light theme
  ("Vellum Light") alongside the existing dark theme ("Vellum Noir") and
  a sidebar toggle to switch between them. Nothing here touches
  `src/api/*`, mock data shapes, or any endpoint — safe to ignore when
  wiring the real backend.
- All color is still driven by the same CSS-variable tokens
  (`--bg`, `--ink`, `--accent`, `--mark`, etc.) introduced with the dark
  theme; the light theme (`src/styles/index.css`) just
  redefines those same variables under `html[data-theme="light"]`.
  While auditing for the new theme, a few leftover hardcoded colors from
  *before* the dark theme existed were found still live in
  `base.js`/`polish.js`/`responsive.js` (e.g. `#0F1115`, `#FF6033`,
  `rgba(91,155,213,…)`) — these would have rendered wrong (illegible or
  off-brand) the moment light mode activated, so they were converted to
  the same token system (two new tokens added: `--on-mark` / `--on-accent`,
  the correct ink color for text/icons sitting on a `--mark`/`--accent`
  fill, which flips near-black ↔ near-white between themes).
- Theme choice persists to `localStorage` under the key `vellum.theme`
  (via the existing `usePersistentState` pattern — see
  `src/hooks/useTheme.js`), with a tiny synchronous bootstrap in
  `src/main.jsx` that applies the saved theme before React mounts, to
  avoid a flash of the wrong theme on load. First-ever visit (no stored
  value) follows the OS/browser `prefers-color-scheme` setting.

