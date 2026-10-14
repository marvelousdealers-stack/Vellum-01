# API Contract — Frontend ↔ Backend

Stage 1 output: what the frontend currently expects, mapped to the
backend design in *AI-Powered Testing & Grading Platform — A Complete
Build Guide (MERN Stack)*. Use this as the target when building routes/
models — it's the concrete version of the guide's Section 6 (Database
Design) and Section 8 (API Endpoints), reconciled against what the UI
actually does today.

> **Update:** this section is the contract the frontend implements today
> (`src/api/*.js`). Sections further down predate the router migration and
> are being rewritten step by step. Turn the mock off with
> `VITE_USE_MOCK=false` (and set `VITE_API_BASE_URL`); no code changes.

## Conventions (every endpoint)

- **Auth:** `Authorization: Bearer <token>`. A `401` sends the user to login
  (one handler, `onUnauthorized` in `api/client.js`). The token user decides
  scope: teachers see their own tests and grading queue; students see only
  their class's published tests and their own attempts.
- **Errors:** non-2xx with JSON `{ "message": string, "code"?: string }`.
  `message` is shown to users as-is. Codes the UI reacts to: `NOT_RELEASED`
  (403), `NOT_OPEN` (409), `NO_VARIANT` (403), `INVALID_MARKS` (400).
- **Ids:** `_id` or `id` — both accepted (`api/wire.js` renames `_id`).
- **Times:** ISO-8601 strings on the wire. These fields are converted to
  millisecond timestamps in the UI: `createdAt`, `updatedAt`, `publishedAt`,
  `stoppedAt`, `startedAt`, `deadline`, `submittedAt`, `availableFrom`,
  `availableUntil`, `at`, `reviewedAt`, `closesAt`. Anything else stays as sent.
- **Answer keys never reach a student before release:** `correctIndex`,
  `expectedAnswer` and `rubric` must be stripped from the questions inside a
  student's attempt until their result is released.

## Auth

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` → `{ token, user }`. 401 with `{ message }` on bad credentials; `403 ACCOUNT_DISABLED` for a deactivated account (whose existing tokens also get 401) |
| GET | `/api/auth/me` | The signed-in user. A 401 here ends the session |

`user` = `{ id, name, email, role: "admin"|"teacher"|"student", active, cls?, classId?, roll? (students), classIds? (teachers) }`.
The role comes from the account; the UI shows the screens for it and the
server must enforce it on every endpoint (403 otherwise).

## Reads (what each screen loads)

| Method | Endpoint | Returns | Used by |
|---|---|---|---|
| GET | `/api/tests` | Teacher: own tests, with `questionSet` / `variants`. Student: published tests of their class **without questions**. Both: server-computed `status` (`draft`\|`scheduled`\|`live`\|`completed`), `settings` (complete), `questionCount`, `totalMarks` (per student). Re-fetched every 30 s | drafts, review, live, student tests |
| GET | `/api/attempts` | The student's own attempts. Each has `questions` (snapshot, no answer key), `answers`, `flags`, `status`, `deadline`, and **`released`** and **`totals`** (`null` until released) | student tests, history |
| GET | `/api/tests/:id/attempts` | Teacher: one row per student in the class — `{ student: { id, name, roll }, attempt: { id, status, startedAt, deadline, submittedAt, submitReason, progress: { answered, total }, flags: [{ type, at }] } \| null }`. Never the answers. Polled every 20 s | live control |
| GET | `/api/grading/queue` | Teacher: written answers to review — see "Grading" | grade review |
| GET | `/api/attempts/:id/review` | Student: one released attempt, question by question — see "Grading". `403 NOT_RELEASED` while hidden | history review |

Every read goes through one hook shape: `{ data, isLoading, error, refetch }`
(`hooks/useResource.js`). After a successful write the matching keys are
refetched (`api/cache.js`), so the backend never has to push updates.

## Admin: accounts & classes

All admin only (403 otherwise). Writes refetch the users and classes lists.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users` | Every teacher and student (never admins); optional `?role=`. `[user]` shape above |
| POST | `/api/users` | `{ name, email, role: "teacher"\|"student", classId? (required for students), classIds? (teachers) }`. Server lowercases the email, assigns a student's roll number (`11A-07`) and emails a temporary password. `409 DUPLICATE_EMAIL`, `400 INVALID_INPUT` |
| PUT | `/api/users/:id` | `{ active? }` and/or, for students, `{ classId }` (`null` unassigns; a new class gets a new roll). `409 CANNOT_CHANGE_SELF` / `CANNOT_CHANGE_ADMIN` |
| DELETE | `/api/users/:id` | Removes the account and its class links; test history stays. `409 CANNOT_CHANGE_ADMIN` |
| POST | `/api/classes` | `{ name, teacherIds? }`. The server derives `code` ("Grade 11 — Section A" → `11A`) and the id. `409 DUPLICATE_CLASS`, `400 INVALID_INPUT` (a non-teacher in `teacherIds`) |
| PUT | `/api/classes/:id` | `{ name?, teacherIds? }`; the code never changes (tests and students reference it) |
| DELETE | `/api/classes/:id` | `409 CLASS_IN_USE` while it has tests; otherwise students are unassigned and its subjects removed |
| GET | `/api/classes/:id/roster` | `{ teachers: [{ id, name, email, classCount }], students: [{ id, name, roll, email, active, average }] }`. `average` = mean % over submitted tests, `null` before the first |

`GET /api/classes` items also carry `subjectCount` and `teachers: [{ id, name }]`.

## Classes & subjects

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/classes` | Classes the user can see: teacher → the ones they teach, student → their own, admin → all. `[{ id, code, name, studentCount }]` |
| GET | `/api/subjects` | Subjects in those classes (optional `?classId=`), creation order — the first is a class's default. `[{ id, classId, name, outline, createdAt, updatedAt }]` |
| POST | `/api/subjects` | Teacher. Body `{ classId, name, outline? }`. `400 INVALID_SUBJECT` (blank / over 60 chars), `409 DUPLICATE_SUBJECT` (same name in the class, case-insensitive), `404` for a class they don't teach |
| PUT | `/api/subjects/:id` | Teacher. Body `{ name?, outline? }` (outline ≤ 20,000 chars). A rename updates `test.subject` on that subject's tests |
| DELETE | `/api/subjects/:id` | Teacher. `409 SUBJECT_IN_USE` while tests reference it |
| POST | `/api/subjects/:id/materials` | See Materials. `404` if the subject isn't one of theirs |

Tests carry `subjectId` (and the subject's `name` as `subject`, for display).

## Tests

| Method | Endpoint | Purpose | In guide §8 |
|---|---|---|---|
| POST | `/api/tests/generate` | Generate and save a draft. Body: `{ subjectId, title?, mix, targetMarks, duration, mode, difficulty, focusTopics, instruction }`. The server takes class and subject name from `subjectId`. `400 SUBJECT_REQUIRED`, `404` if the teacher has no such subject | yes |
| PUT | `/api/tests/:id` | Edit a draft. Body: `{ questionSet? , variants? }` (debounce on the client) | yes |
| POST | `/api/tests/:id/regenerate` | Rebuild questions from the stored rules | proposed |
| POST | `/api/tests/:id/duplicate` | Copy as a new draft | proposed |
| DELETE | `/api/tests/:id` | Remove a test (and its attempts) | proposed |
| POST | `/api/tests/:id/publish` | Body: `{ availableFrom?, availableUntil?, settings? }`. `settings` = `{ release: "immediately"\|"after_close", aiGrading: boolean, allowBack: boolean }`. 400 if any question fails validation | yes |
| POST | `/api/tests/:id/start-now` | Open a scheduled test immediately | proposed |
| POST | `/api/tests/:id/stop-now` | Close for all students | yes |
| POST | `/api/tests/:id/extend` | Body `{ minutes }`. Adds time to the window close and to every in-progress attempt's `deadline`; 409 if the test already ended. Returns `{ closesAt }` | proposed |
| GET | `/api/tests/:id/live-status` | `{ stopped, closesAt?, deadline? }`, polled every 20 s by a student taking the test. `deadline` is that student's own (so an extension reaches an open test) | yes |

Test document: `{ id, title, subject, classId, cls, status: "draft"|"published",
mode: "class"|"personal", config, questionSet | null, variants | null,
schedule: { availableFrom, availableUntil } | null, publishedAt, stoppedAt,
regeneratedAt, settings, createdAt, updatedAt }`. The client derives
`scheduled | live | completed` from `schedule` and `stoppedAt`; the backend
should apply the same rule when enforcing access. `release: "immediately"`
shows a student their marks as soon as they submit; `"after_close"` waits until
the test has ended. `aiGrading: false` routes every written answer to the
teacher's manual queue. `allowBack: false` = one question at a time, no way back.

Question: `{ id, type: "mcq"|"truefalse"|"short"|"long"|"numerical", topic,
marks, text, options|null, correctIndex|null, expectedAnswer, rubric:
[{ label, points }] }`.

## Attempts

| Method | Endpoint | Purpose | In guide §8 |
|---|---|---|---|
| GET | `/api/tests/:id/start` | Start or resume the student's attempt; returns it with `questions` (own variant in personalized mode). 409 `NOT_OPEN` / 403 `NO_VARIANT` | yes |
| PUT | `/api/attempts/:id/answers` | Best-effort backup of one answer: `{ questionId, value }`. Ignored after submit | proposed |
| POST | `/api/tests/:id/flag` | Anti-cheat event `{ type }`, e.g. `"tab-switch"`; server timestamps it | yes |
| POST | `/api/tests/:id/submit` | `{ reason: "manual"\|"timeout"\|"stopped", answers }`. **The full answer map is sent**, so submit never depends on earlier saves. Idempotent. Grades immediately (see Grading) | yes |

Attempt: `{ id, testId, student, variantIndex|null, startedAt, deadline,
status: "in_progress"|"submitted", submittedAt, submitReason, questions,
answers: { [questionId]: number|string }, flags: [{ type, at }] }`. `deadline` =
`min(start + duration, availableUntil)`, fixed at start. The server should also
auto-submit attempts past `deadline` or whose test was stopped (the mock does
this client-side in `settleExpired`; in real mode that function does nothing).

## Grading

A grade, per question of a submitted attempt:
`{ marks, max, status: "final"|"ai_draft"|"pending", source: "auto"|"ai"|"teacher",
confidence: 0–1|null, rubric: [{ label, points, awarded }]|null, feedback, aiMarks? }`.

- Objective questions: `final`, `source: "auto"` at submit.
- Written, AI grading on: `ai_draft` with `marks`, `confidence`, `rubric`,
  `feedback` from the model (`aiMarks` keeps the original suggestion).
- Written, AI grading off: `pending`, `marks: null`.
- Students only ever see `final` marks, so an unreviewed AI mark can't leak.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/grading/queue` | Queue items (below), one per written answer on the teacher's tests |
| PATCH | `/api/grades/:attemptId/:questionId` | `{ marks, feedback?, final }`. `final: true` accepts/overrides (becomes `final`, `source: "teacher"` if the mark differs from `aiMarks`); `false` saves a draft. 400 `INVALID_MARKS` outside `0..max` |
| POST | `/api/grading/approve` | `{ items: [{ attemptId, questionId }] }` — accept AI marks unchanged. Only `ai_draft` grades change. Returns `{ approved }` |

Queue item: `{ id, attemptId, questionId, testId, student, roll, test, date,
question, topic, answer, modelAnswer, maxScore, score, aiScore|null,
confidence: "low"|"med"|"high"|null, status: "pending"|"reviewed",
manual: boolean, source, rubric, feedback, flags }`. Confidence buckets:
`<0.6` low, `<0.8` med, otherwise high.

Review (student): `GET /api/attempts/:id/review` →
`{ attemptId, test: { title, subject, cls }, submittedAt, submitReason, flags,
totals: { earned, max, complete, notFinal },
items: [{ question: { id, type, topic, marks, text, options },
answer, correctIndex|null, modelAnswer, grade }] }`.
`grade` is `{ status: "final", marks, max, feedback }` once final, otherwise
just `{ status: "grading", max }` — no marks. `totals` counts final marks only.

---

## How the frontend is wired for this right now

Every backend call goes through `src/api/*.js` on top of `src/api/client.js`,
and the app only speaks HTTP. While there is no backend, `src/mocks` answers
those requests in the browser (`VITE_USE_MOCK`, default on). To connect the
real one: implement this contract, set `VITE_USE_MOCK=false` and
`VITE_API_BASE_URL`, and delete `src/mocks`. Nothing else changes.

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

